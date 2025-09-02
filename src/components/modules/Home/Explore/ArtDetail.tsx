'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowLeft,
    ArrowsOutSimple,
    ChatCircle,
    DotsThree,
    DotsThreeVertical,
    Heart,
    PaperPlaneRight,
    ShareFat,
    Smiley,
    TextB,
    TextItalic,
    TextUnderline,
    ArrowUUpLeft,
    ArrowUUpRight,
    Building,
} from '@phosphor-icons/react'
import type { Art, Comment } from '@/data/ArtData'
import { getArt, getRelated, listComments, addComment } from '@/data/ArtData'

/* ---------------- helpers ---------------- */
const fmt = (d: string) => new Date(d).toLocaleString()
const isEffectivelyEmpty = (s: string) => s.replace(/[\s\u200B\uFEFF]/g, '') === ''

// simple text history for undo/redo
function useTextHistory(initial = '') {
    const [value, _setValue] = useState(initial)
    const hist = useRef<string[]>([initial])
    const idx = useRef(0)
    const setValue = (v: string | ((prev: string) => string)) => {
        const next = typeof v === 'function' ? (v as any)(value) : v
        if (hist.current[idx.current] === next) {
            _setValue(next)
            return
        }
        hist.current = hist.current.slice(0, idx.current + 1)
        hist.current.push(next)
        idx.current++
        _setValue(next)
    }
    const undo = () => {
        if (idx.current > 0) {
            idx.current--
            _setValue(hist.current[idx.current])
        }
    }
    const redo = () => {
        if (idx.current < hist.current.length - 1) {
            idx.current++
            _setValue(hist.current[idx.current])
        }
    }
    return { value, setValue, undo, redo }
}

type CNode = Comment & { children: CNode[] }

/** Convert flat comments -> tree (roots: newest first; children: old -> new) */
function buildTree(list: Comment[]) {
    const map = new Map<string, CNode>()
    const roots: CNode[] = []
    list.forEach((c) => map.set(c.id, { ...c, children: [] }))
    map.forEach((n) => {
        if (n.parentId && map.has(n.parentId)) map.get(n.parentId)!.children.push(n)
        else roots.push(n)
    })
    const asc = (a: Comment, b: Comment) =>
        +new Date(a.createdAt) - +new Date(b.createdAt)
    const desc = (a: Comment, b: Comment) =>
        +new Date(b.createdAt) - +new Date(a.createdAt)
    roots.sort(desc)
    roots.forEach((r) => r.children.sort(asc))
    return roots
}

/* ---------- tiny emoji list ---------- */
const EMOJIS = ['😊', '😍', '😅', '🔥', '👏', '👍', '🎉', '❤️', '😢', '🤔']

/* ================= PAGE ================= */
export default function ArtDetail({ id }: { id: string }) {
    const artId = Number(id)

    const [art, setArt] = useState<Art | null>(null)
    const [related, setRelated] = useState<Art[]>([])
    const [comments, setComments] = useState<Comment[]>([])
    const [imgLoaded, setImgLoaded] = useState(false)

    // like for main artwork
    const [artLikes, setArtLikes] = useState(0)
    const [artLiked, setArtLiked] = useState(false)

    // root composer
    const root = useTextHistory('')
    const [bold, setBold] = useState(false)
    const [italic, setItalic] = useState(false)
    const [underline, setUnderline] = useState(false)
    const [showEmojiRoot, setShowEmojiRoot] = useState(false)
    const rootInputRef = useRef<HTMLInputElement>(null)
    const emojiRootRef = useRef<HTMLDivElement>(null)

    // reply state
    const [replyTo, setReplyTo] = useState<string | null>(null)

    // format map per comment id
    const [formatMap, setFormatMap] = useState<
        Record<string, { b: boolean; i: boolean; u: boolean }>
    >({})

    // comment like map
    const [commentLikes, setCommentLikes] = useState<Record<string, number>>({})
    const [commentLiked, setCommentLiked] = useState<Record<string, boolean>>({})

    useEffect(() => {
        let stop = false
            ; (async () => {
                const [a, cs, rs] = await Promise.all([
                    getArt(artId),
                    listComments(artId),
                    getRelated(artId, 14),
                ])
                if (stop) return
                setArt(a)
                setArtLikes(a?.likes ?? 0)
                setComments(cs)
                setRelated(rs)
            })()
        return () => {
            stop = true
        }
    }, [artId])

    // hide emoji when clicking outside (root)
    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!showEmojiRoot) return
            const target = e.target as Node
            if (
                emojiRootRef.current &&
                !emojiRootRef.current.contains(target) &&
                !rootInputRef.current?.contains(target)
            ) {
                setShowEmojiRoot(false)
            }
        }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [showEmojiRoot])

    const insertAtCursor = (
        input: HTMLInputElement | null,
        token: string,
        setValue: (v: string | ((p: string) => string)) => void
    ) => {
        if (!input) {
            setValue((prev) => (prev ?? '') + token)
            return
        }
        const start = input.selectionStart ?? input.value.length
        const end = input.selectionEnd ?? input.value.length
        const next =
            (input.value ?? '').slice(0, start) +
            token +
            (input.value ?? '').slice(end)
        setValue(next)
        requestAnimationFrame(() => {
            input.selectionStart = input.selectionEnd = start + token.length
            input.focus()
        })
    }

    // mock like API
    const fakeLikeApi = async (liked: boolean) =>
        new Promise<void>((r) => setTimeout(r, 120))

    const toggleArtLike = async () => {
        const nextLiked = !artLiked
        setArtLiked(nextLiked)
        setArtLikes((n) => (nextLiked ? n + 1 : Math.max(0, n - 1)))
        await fakeLikeApi(nextLiked)
    }

    const sendRoot = async () => {
        const t = root.value
        if (isEffectivelyEmpty(t)) return
        const c = await addComment(artId, t)
        setComments((p) => [c, ...p])
        setFormatMap((m) => ({ ...m, [c.id]: { b: bold, i: italic, u: underline } }))
        root.setValue('')
        setBold(false)
        setItalic(false)
        setUnderline(false)
    }

    const handleCommentLike = async (id: string) => {
        const next = !(commentLiked[id] ?? false)
        setCommentLiked((m) => ({ ...m, [id]: next }))
        setCommentLikes((m) => ({
            ...m,
            [id]: (m[id] ?? 0) + (next ? 1 : -1),
        }))
        await fakeLikeApi(next)
    }

    const TAGS = ['Realism', 'Impressionism', 'Cubism', 'Surrealism', 'Abstract', 'Vintage']

    if (!art) {
        return (
            <div className="p-6 text-gray-500 dark:text-gray-400">Not found.</div>
        )
    }

    return (
        <div className="min-h-full h-[calc(100vh-160px)] rounded-xl text-gray-900 dark:text-gray-100">
            {/* Back */}
            <div className="mb-3 flex items-center gap-2">
                <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-white bg-[#9C27B0] hover:bg-[#9C27B0]/80"
                >
                    <ArrowLeft size={15} />
                    <span className="text-[12px]">Back</span>
                </Link>
            </div>

            <div className="mx-auto h-[calc(100%-38px)] overflow-y-auto">
                {/* Top: image + info */}
                <div className="grid grid-cols-1 md:grid-cols-[322px,1fr] lg:grid-cols-[322px,1fr] gap-4">
                    {/* Left image */}
                    <div className="relative rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
                        {/* zoom button top-left */}
                        <a
                            href={art.image}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute left-2 top-2 z-10 rounded-full bg-black/70 text-white p-2 hover:bg-black/80"
                            title="Open full image"
                        >
                            <ArrowsOutSimple size={16} />
                        </a>
                        <div
                            className="relative w-full h-full"
                            style={{ paddingBottom: `${art.ratio * 100}%` }}
                        >
                            {!imgLoaded && (
                                <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-neutral-800" />
                            )}
                            <Image
                                src={art.image}
                                alt={art.title}
                                fill
                                unoptimized
                                priority
                                className={`object-fill transition-opacity ${imgLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoad={() => setImgLoaded(true)}
                            />
                        </div>
                    </div>

                    {/* Right info */}
                    <div className="relative rounded-2xl flex flex-col gap-14">
                        <div className="flex flex-col gap-5">
                            {/* meta row */}
                            <div className="flex items-center gap-2 text-[12px]">
                                <button
                                    onClick={toggleArtLike}
                                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 bg-gray-100 text-gray-800 ring-1 ring-black/5 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-100 dark:ring-white/10 dark:hover:bg-neutral-700"
                                    aria-label="like"
                                >
                                    <Heart
                                        size={14}
                                        weight={artLiked ? 'fill' : 'regular'}
                                        className="text-rose-600"
                                    />
                                    {artLikes}
                                </button>
                                <button className="rounded-lg p-1.5 bg-gray-100 text-gray-800 ring-1 ring-black/5 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-100 dark:ring-white/10 dark:hover:bg-neutral-700">
                                    <ChatCircle size={14} />
                                </button>
                                <button className="rounded-lg p-1.5 bg-gray-100 text-gray-800 ring-1 ring-black/5 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-100 dark:ring-white/10 dark:hover:bg-neutral-700">
                                    <ShareFat size={14} />
                                </button>
                                <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 bg-gray-100 text-gray-800 ring-1 ring-black/5 dark:bg-neutral-800 dark:text-gray-100 dark:ring-white/10">
                                    Physical artwork available: <b className="ml-1">5</b>
                                </span>
                            </div>

                            {/* museum label */}
                            <div className="flex items-center gap-2 text-[12px] text-gray-600 dark:text-gray-300">
                                <div className="bg-[#9C27B0]/80 rounded-md p-1 text-white">
                                    <Building size={13} />
                                </div>
                                <span className="tracking-wide font-semibold">TATE MODERN</span>
                            </div>

                            {/* title + desc */}
                            <div className="flex flex-col gap-4">
                                <h1 className="text-[15px] sm:text-[16px] font-semibold uppercase tracking-wide">
                                    {art.title.toUpperCase()}
                                </h1>
                                <p className="text-[13px] text-gray-700 dark:text-gray-300">
                                    {art.description}
                                </p>
                            </div>

                            {/* tags */}
                            <div className="flex flex-wrap gap-3">
                                {['Realism', 'Impressionism', 'Cubism', 'Surrealism', 'Abstract', 'Vintage'].map(t => (
                                    <span key={t} className="rounded-full px-2.5 py-1 text-[12px] bg-gray-100 text-gray-800 ring-1 ring-black/5 dark:bg-neutral-800 dark:text-gray-100 dark:ring-white/10">{t}</span>
                                ))}
                            </div>

                            {/* author */}
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 grid place-items-center text-[11px] font-bold text-white">
                                    {art.author.slice(0, 1)}
                                </div>
                                <div className="text-[13px] leading-tight">
                                    <div className="font-medium">{art.author}</div>
                                    <div className="text-gray-500 dark:text-gray-400">Artist</div>
                                </div>
                            </div>
                        </div>

                        {/* prices */}
                        <div className="flex flex-wrap gap-3 mb-5">
                            <button className="gap-2 items-center rounded-xl flex px-3 py-2 text-[12px] bg-[#eeee] dark:bg-neutral-800">
                                <span className="text-[14px] font-bold text-[#9C27B0]/80">Digital</span>
                                <span className="text-[14px] font-bold text-[#9C27B0]/80">12$</span>
                            </button>
                            <button className="gap-2 items-center rounded-xl flex px-3 py-2 text-[12px] text-white bg-[#9C27B0]/80 ring-1 ring-purple-500/40 hover:bg-[#9C27B0]/80">
                                <span className="text-[14px] font-bold">Physical</span>
                                <span className="text-[14px] font-bold">30$</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* notes */}
                <div className="mt-3 text-[12px] leading-5 text-gray-600 dark:text-gray-400 space-y-1.5">
                    <p><b>Digital Artwork:</b> You will receive a high-resolution digital file (JPG/PNG/PDF) via email. You can download and print it yourself at any size and on any material you prefer.</p>
                    <p><b>Physical Artwork:</b> You will receive the original painting (or printed copy) shipped to your address. Carefully packaged and delivered via a trusted courier.</p>
                </div>

                {/* comments */}
                <section className="mt-6">
                    <div className="mb-2 text-sm font-semibold">{comments.length} Comments</div>

                    <div className="space-y-3">
                        {buildTree(comments).map((node) => (
                            <CommentItem
                                key={node.id}
                                node={node}
                                liked={commentLiked[node.id] ?? false}
                                likeCount={commentLikes[node.id] ?? 0}
                                onToggleLike={() => handleCommentLike(node.id)}
                                onStartReply={() => setReplyTo(node.id)}
                                replying={replyTo === node.id}
                                onCancelReply={() => setReplyTo(null)}
                                onSendReply={async (text, fmtFlags) => {
                                    if (!replyTo) return
                                    if (isEffectivelyEmpty(text)) return
                                    const c = await addComment(artId, text)
                                    c.parentId = replyTo
                                    setComments((p) => [c, ...p])
                                    setFormatMap((m) => ({ ...m, [c.id]: fmtFlags }))
                                    setReplyTo(null) // sẽ kích hoạt useEffect trong CommentItem để reset an toàn lần nữa
                                }}
                                formatMap={formatMap}
                            />
                        ))}
                    </div>

                    {/* root composer */}
                    <div className="mt-4 rounded-2xl p-5 bg-[#eeeeee] dark:bg-[#1E1B26]">
                        <div className="h-[44px] rounded-xl flex items-center px-2 bg-white text-gray-700 dark:bg-[#121212] dark:text-gray-300">
                            <button onClick={() => setBold(v => !v)} className={`px-2 py-1 hover:text-black dark:hover:text-white ${bold ? 'font-bold' : ''}`} title="Bold"><TextB size={16} /></button>
                            <button onClick={() => setItalic(v => !v)} className={`px-2 py-1 hover:text-black dark:hover:text-white ${italic ? 'italic' : ''}`} title="Italic"><TextItalic size={16} /></button>
                            <button onClick={() => setUnderline(v => !v)} className={`px-2 py-1 hover:text-black dark:hover:text-white ${underline ? 'underline' : ''}`} title="Underline"><TextUnderline size={16} /></button>

                            <div className="relative" ref={emojiRootRef}>
                                <button onClick={() => setShowEmojiRoot(s => !s)} className="px-2 py-1 hover:text-black dark:hover:text-white" title="Emojis"><Smiley size={16} /></button>
                                {showEmojiRoot && (
                                    <div className="absolute z-20 mt-2 rounded-xl bg-white shadow-lg ring-1 ring-black/5 p-2 dark:bg-neutral-900 dark:ring-white/10">
                                        <div className="flex gap-1">
                                            {EMOJIS.map(e => (
                                                <button key={e} onClick={() => insertAtCursor(rootInputRef.current, e, root.setValue)} className="px-1.5 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10">{e}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button onClick={root.undo} className="ml-2 px-2 py-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" title="Undo"><ArrowUUpLeft size={16} /></button>
                            <button onClick={root.redo} className="px-2 py-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" title="Redo"><ArrowUUpRight size={16} /></button>

                            <button className="ml-auto px-2 py-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><DotsThree size={18} /></button>
                        </div>

                        <div className="mt-2">
                            <input
                                ref={rootInputRef}
                                className="w-full h-[43px] rounded-xl p-3 text-sm outline-none bg-gray-100 text-gray-900 placeholder:text-gray-400 dark:bg-[#121212] dark:text-gray-100 dark:placeholder:text-gray-500"
                                placeholder="Write your comment"
                                value={root.value}
                                onChange={(e) => root.setValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendRoot()}
                                style={{
                                    fontWeight: bold ? 700 : 400,
                                    fontStyle: italic ? 'italic' : 'normal',
                                    textDecoration: underline ? 'underline' : 'none',
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-2 flex justify-end">
                        <button onClick={sendRoot} className="inline-flex items-center gap-2 bg-[#9C27B0]/80 px-3 py-2 text-sm font-medium text-white hover:bg-[#9C27B0]/90 rounded-full">
                            Comment <PaperPlaneRight size={16} />
                        </button>
                    </div>
                </section>

                {/* related */}
                <div className="mt-8 mb-2 font-semibold">Related artworks</div>
                <div className="w-full box-border">
                    <div className="columns-2 sm:columns-3 md:columns-4 xl:columns-6 gap-2">
                        {related.map((r, i) => (
                            <Link key={`${r.id}-${i}`} href={`/explore/${r.id}`} className="mb-2 break-inside-avoid block overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
                                <div className="relative w-full" style={{ paddingBottom: `${r.ratio * 100}%` }}>
                                    <Image src={r.image} alt={r.title} fill className="object-cover" loading="lazy" unoptimized />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* --------------- one comment item --------------- */
function CommentItem({
    node,
    onStartReply,
    onCancelReply,
    replying,
    onSendReply,
    liked,
    likeCount,
    onToggleLike,
    formatMap,
}: {
    node: CNode
    replying: boolean
    onStartReply: () => void
    onCancelReply: () => void
    onSendReply: (text: string, fmt: { b: boolean; i: boolean; u: boolean }) => void
    liked: boolean
    likeCount: number
    onToggleLike: () => void
    formatMap: Record<string, { b: boolean; i: boolean; u: boolean }>
}) {
    const reply = useTextHistory('')
    const [b, setB] = useState(false)
    const [i, setI] = useState(false)
    const [u, setU] = useState(false)
    const [showEmo, setShowEmo] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const wrapRef = useRef<HTMLDivElement>(null)

    // Ẩn emoji khi click ra ngoài
    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!showEmo) return
            if (!wrapRef.current?.contains(e.target as Node)) setShowEmo(false)
        }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [showEmo])

    // Khi đóng composer hoặc sau khi gửi → reset tất cả
    useEffect(() => {
        if (!replying) {
            reply.setValue('')
            setB(false); setI(false); setU(false); setShowEmo(false)
        }
    }, [replying])

    const insertEmoji = (token: string) => {
        const el = inputRef.current
        if (!el) {
            reply.setValue((v) => v + token)
            return
        }
        const start = el.selectionStart ?? reply.value.length
        const end = el.selectionEnd ?? reply.value.length
        const next = reply.value.slice(0, start) + token + reply.value.slice(end)
        reply.setValue(next)
        requestAnimationFrame(() => {
            el.selectionStart = el.selectionEnd = start + token.length
            el.focus()
        })
    }

    const fmtStyle = (id: string) => {
        const f = formatMap[id]
        return f
            ? {
                fontWeight: f.b ? 700 : 400,
                fontStyle: f.i ? ('italic' as const) : 'normal',
                textDecoration: f.u ? 'underline' : 'none',
            }
            : undefined
    }

    // Gửi và CLEAR tại chỗ để không lưu emoji cũ
    const handleSend = () => {
        onSendReply(reply.value, { b, i, u })
        reply.setValue('')
        setB(false); setI(false); setU(false); setShowEmo(false)
    }

    return (
        <div className="rounded-2xl px-4 py-3">
            <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-gray-200 text-gray-700 grid place-items-center text-[11px] font-bold dark:bg-neutral-800 dark:text-gray-100">
                    {node.user.name.slice(0, 1)}
                </div>
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">{node.user.name}</span>
                        <span className="text-xs text-gray-500">{fmt(node.createdAt)}</span>
                    </div>

                    <div className="mt-2 text-[15px] text-gray-900 dark:text-gray-100" style={fmtStyle(node.id)}>
                        {node.content}
                    </div>

                    {/* children */}
                    {node.children.length > 0 && (
                        <div className="mt-3 space-y-3 pl-6 border-l border-black/10 dark:border-white/10">
                            {node.children.map((ch) => (
                                <div key={ch.id} className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-700 grid place-items-center text-[10px] font-bold dark:bg-neutral-800 dark:text-gray-100">
                                        {ch.user.name.slice(0, 1)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-700 dark:text-gray-300">
                                            <span className="font-medium">{ch.user.name}</span>
                                            <span className="text-xs text-gray-500">{fmt(ch.createdAt)}</span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900 dark:text-gray-100" style={fmtStyle(ch.id)}>
                                            {ch.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* actions */}
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <button onClick={onToggleLike} className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200">
                            <Heart size={14} className="text-rose-500" weight={liked ? 'fill' : 'regular'} />
                            <span>{likeCount}</span>
                        </button>
                        {!replying && (
                            <button className="hover:text-gray-700 dark:hover:text-gray-200" onClick={onStartReply}>
                                Reply
                            </button>
                        )}
                        <DotsThreeVertical size={16} />
                    </div>

                    {/* reply composer */}
                    {replying && (
                        <div className="mt-3 pl-6" ref={wrapRef}>
                            <div className="h-[40px] rounded-xl flex items-center px-2 bg-gray-100 text-gray-700 dark:bg-[#1b1a20] dark:text-gray-300">
                                <button onClick={() => setB(v => !v)} className={`px-2 py-1 hover:text-black dark:hover:text-white ${b ? 'font-bold' : ''}`} title="Bold"><TextB size={16} /></button>
                                <button onClick={() => setI(v => !v)} className={`px-2 py-1 hover:text-black dark:hover:text-white ${i ? 'italic' : ''}`} title="Italic"><TextItalic size={16} /></button>
                                <button onClick={() => setU(v => !v)} className={`px-2 py-1 hover:text-black dark:hover:text-white ${u ? 'underline' : ''}`} title="Underline"><TextUnderline size={16} /></button>

                                <div className="relative">
                                    <button onClick={() => setShowEmo(s => !s)} className="px-2 py-1 hover:text-black dark:hover:text-white" title="Emojis"><Smiley size={16} /></button>
                                    {showEmo && (
                                        <div className="absolute z-20 mt-2 rounded-xl bg-white shadow-lg ring-1 ring-black/5 p-2 dark:bg-neutral-900 dark:ring-white/10">
                                            <div className="flex gap-1">
                                                {EMOJIS.map(e => (
                                                    <button key={e} onClick={() => insertEmoji(e)} className="px-1.5 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10">{e}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button onClick={reply.undo} className="ml-2 px-2 py-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" title="Undo"><ArrowUUpLeft size={16} /></button>
                                <button onClick={reply.redo} className="px-2 py-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" title="Redo"><ArrowUUpRight size={16} /></button>

                                <button className="ml-auto px-2 py-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><DotsThree size={18} /></button>
                            </div>

                            <div className="relative mt-2">
                                <input
                                    ref={inputRef}
                                    className="w-full rounded-xl px-4 py-2.5 pr-28 text-sm outline-none bg-gray-100 text-gray-900 placeholder:text-gray-400 dark:bg-[#121212] dark:text-gray-100 dark:placeholder:text-gray-500"
                                    placeholder={`Reply to ${node.user.name}`}
                                    value={reply.value}
                                    onChange={(e) => reply.setValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    style={{
                                        fontWeight: b ? 700 : 400,
                                        fontStyle: i ? 'italic' : 'normal',
                                        textDecoration: u ? 'underline' : 'none',
                                    }}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                                    <button onClick={handleSend} className="rounded-md bg-purple-600 hover:bg-purple-500 px-3 py-1.5 text-xs text-white inline-flex items-center gap-1">
                                        <PaperPlaneRight size={14} /> Send
                                    </button>
                                    <button onClick={onCancelReply} className="rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600 px-3 py-1.5 text-xs">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
