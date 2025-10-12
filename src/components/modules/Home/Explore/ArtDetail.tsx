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
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import artworkService, { type Artwork, type ArtworkComment } from '@/services/artwork.service'
import { useAppSelector } from '@/store/hooks'
import { getArtworkImageUrl, getImageUrl } from '@/utils/imageUtils'
import { useAddToCart } from '@/hooks/mutations/cart.mutation'

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

/* ---------- tiny emoji list ---------- */
const EMOJIS = ['😊', '😍', '😅', '🔥', '👏', '👍', '🎉', '❤️', '😢', '🤔']

/* ================= PAGE ================= */
export default function ArtDetail({ id }: { id: string }) {
    const queryClient = useQueryClient()
    const currentUser = useAppSelector((state) => state.auth.user)
    const [imgLoaded, setImgLoaded] = useState(false)
    const [showProtectionMessage, setShowProtectionMessage] = useState(false)
    const addToCart = useAddToCart()

    // Fetch artwork data
    const { data: art, isLoading, error } = useQuery({
        queryKey: ['artwork', id],
        queryFn: () => artworkService.getArtworkById(id),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    // Fetch related artworks with infinite scroll
    const {
        data: relatedData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: relatedLoading,
    } = useInfiniteQuery({
        queryKey: ['artworks', 'related', art?.categoryId, id],
        queryFn: async ({ pageParam = 0 }) => {
            const result = await artworkService.getArtworks({
                categoryId: art?.categoryId,
                status: 'PUBLISHED',
                limit: 12,
                offset: pageParam,
            })
            // Filter out current artwork
            return {
                ...result,
                data: result.data.filter(a => a.id !== id)
            }
        },
        getNextPageParam: (lastPage, pages) => {
            const totalFetched = pages.reduce((sum, page) => sum + page.data.length, 0)
            return totalFetched < lastPage.total ? totalFetched : undefined
        },
        enabled: !!art?.categoryId,
        initialPageParam: 0,
    })

    // Intersection observer for infinite scroll
    const loadMoreRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage()
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(loadMoreRef.current)
        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    // Fetch comments
    const { data: comments = [] } = useQuery({
        queryKey: ['comments', id],
        queryFn: () => artworkService.getComments(id),
        enabled: !!id,
    })

    // Like mutation
    const likeMutation = useMutation({
        mutationFn: () => artworkService.toggleLike(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artwork', id] })
        },
    })

    // Create comment mutation
    const createCommentMutation = useMutation({
        mutationFn: (data: { content: string; parentId?: string }) =>
            artworkService.createComment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', id] })
        },
    })

    // Delete comment mutation
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: string) => artworkService.deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', id] })
        },
    })

    // Update comment mutation
    const updateCommentMutation = useMutation({
        mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
            artworkService.updateComment(commentId, { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', id] })
        },
    })

    // Like comment mutation
    const likeCommentMutation = useMutation({
        mutationFn: (commentId: string) => artworkService.toggleCommentLike(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', id] })
        },
    })

    // root composer
    const root = useTextHistory('')
    const [bold, setBold] = useState(false)
    const [italic, setItalic] = useState(false)
    const [underline, setUnderline] = useState(false)
    const [showEmojiRoot, setShowEmojiRoot] = useState(false)
    const [replyTo, setReplyTo] = useState<string | null>(null)
    const rootInputRef = useRef<HTMLInputElement>(null)
    const emojiRootRef = useRef<HTMLDivElement>(null)

    // Flatten all pages of related artworks
    const related = relatedData?.pages.flatMap(page => page.data) || []

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

    const toggleArtLike = () => {
        likeMutation.mutate()
    }

    const handleImageProtection = () => {
        setShowProtectionMessage(true)
        setTimeout(() => setShowProtectionMessage(false), 3000)
    }

    const sendRootComment = () => {
        const content = root.value.trim()
        if (isEffectivelyEmpty(content)) return

        createCommentMutation.mutate(
            { content },
            {
                onSuccess: () => {
                    root.setValue('')
                    setBold(false)
                    setItalic(false)
                    setUnderline(false)
                },
            }
        )
    }

    const sendReply = (parentId: string, content: string) => {
        if (isEffectivelyEmpty(content)) return

        createCommentMutation.mutate(
            { content, parentId },
            {
                onSuccess: () => {
                    setReplyTo(null)
                },
            }
        )
    }

    if (isLoading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Loading artwork...</p>
            </div>
        )
    }

    if (error || !art) {
        return (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <p>Artwork not found.</p>
                <Link href="/explore" className="mt-4 inline-block text-purple-600 hover:text-purple-700">
                    ← Back to Explore
                </Link>
            </div>
        )
    }

    const ratio = art.height / art.width
    const isLikedByUser = art.likes?.some(like => like.userId) || false

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

            <div className="mx-auto h-[calc(100%-38px)] overflow-y-auto p-0.5">
                {/* Top: image + info */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6 w-fit">
                    {/* Left image */}
                    <div className="relative rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10 flex items-center justify-center min-h-[400px]">
                        {/* zoom button top-left */}
                        <a
                            href={getArtworkImageUrl(art.imageUrl) || ''}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute left-2 top-2 z-10 rounded-full bg-black/70 text-white p-2 hover:bg-black/80"
                            title="Open full image"
                        >
                            <ArrowsOutSimple size={16} />
                        </a>
                        {!imgLoaded && (
                            <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-neutral-800" />
                        )}
                        <div
                            className="relative w-fit h-full max-h-[600px] flex items-center justify-center p-2 select-none"
                            onContextMenu={(e) => {
                                e.preventDefault()
                                handleImageProtection()
                            }}
                            onDragStart={(e) => e.preventDefault()}
                        >
                            <Image
                                src={art.imageUrl || ''}
                                alt={art.title}
                                width={art.width}
                                height={art.height}
                                unoptimized
                                priority
                                draggable={false}
                                className={`object-contain rounded-lg max-w-fit max-h-full transition-opacity select-none pointer-events-none ${imgLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoad={() => setImgLoaded(true)}
                                onContextMenu={(e) => e.preventDefault()}
                                style={{
                                    width: 'auto',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none',
                                    MozUserSelect: 'none',
                                }}
                            />
                            {/* Invisible overlay to prevent direct image access */}
                            <div
                                className="absolute inset-0 cursor-default"
                                onContextMenu={(e) => {
                                    e.preventDefault()
                                    handleImageProtection()
                                }}
                                onDragStart={(e) => e.preventDefault()}
                            />

                            {/* Protection message */}
                            {showProtectionMessage && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm animate-fade-in z-20">
                                    <p className="text-sm font-medium">🔒 This artwork is protected</p>
                                    <p className="text-xs text-gray-300 mt-1">Right-click and download are disabled</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right info */}
                    <div className="relative rounded-2xl flex flex-col gap-14">
                        <div className="flex flex-col gap-5">
                            {/* meta row */}
                            <div className="flex items-center gap-2 text-[12px]">
                                <button
                                    onClick={toggleArtLike}
                                    disabled={likeMutation.isPending}
                                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 bg-gray-100 text-gray-800 ring-1 ring-black/5 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-100 dark:ring-white/10 dark:hover:bg-neutral-700 disabled:opacity-50"
                                    aria-label="like"
                                >
                                    <Heart
                                        size={14}
                                        weight={isLikedByUser ? 'fill' : 'regular'}
                                        className="text-rose-600"
                                    />
                                    {art.likeCount}
                                </button>
                                <button className="rounded-lg p-1.5 bg-gray-100 text-gray-800 ring-1 ring-black/5 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-100 dark:ring-white/10 dark:hover:bg-neutral-700">
                                    <ChatCircle size={14} />
                                </button>
                                <button className="rounded-lg p-1.5 bg-gray-100 text-gray-800 ring-1 ring-black/5 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-100 dark:ring-white/10 dark:hover:bg-neutral-700">
                                    <ShareFat size={14} />
                                </button>
                            </div>

                            {/* Organization label (if exists) */}
                            {art.organization && (
                                <div className="flex items-center gap-2 text-[12px] text-gray-600 dark:text-gray-300">
                                    <div className="bg-[#9C27B0]/80 rounded-md p-1 text-white">
                                        <Building size={13} />
                                    </div>
                                    <span className="tracking-wide font-semibold">{art.organization.name.toUpperCase()}</span>
                                </div>
                            )}

                            {/* title + desc */}
                            <div className="flex flex-col gap-4">
                                <h1 className="text-[15px] sm:text-[16px] font-semibold uppercase tracking-wide">
                                    {art.title.toUpperCase()}
                                </h1>
                                <p className="text-[13px] text-gray-700 dark:text-gray-300">
                                    {art.description || 'No description available.'}
                                </p>
                            </div>

                            {/* tags */}
                            {art.tags && art.tags.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {art.tags.map(t => (
                                        <span key={t} className="rounded-full px-2.5 py-1 text-[12px] bg-gray-100 text-gray-800 ring-1 ring-black/5 dark:bg-neutral-800 dark:text-gray-100 dark:ring-white/10">{t}</span>
                                    ))}
                                </div>
                            )}

                            {/* Metadata */}
                            {(art.medium || art.dimensions || art.year) && (
                                <div className="text-[13px] space-y-1 text-gray-600 dark:text-gray-400">
                                    {art.medium && <div><b>Medium:</b> {art.medium}</div>}
                                    {art.dimensions && <div><b>Dimensions:</b> {art.dimensions}</div>}
                                    {art.year && <div><b>Year:</b> {art.year}</div>}
                                </div>
                            )}

                            {/* author */}
                            <div className="flex items-center gap-2">
                                {art.creator.avatar ? (
                                    <Image src={getImageUrl(art.creator.avatar) || ''} alt={art.creator.username} width={32} height={32} className="rounded-full" />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 grid place-items-center text-[11px] font-bold text-white">
                                        {art.creator.firstName.slice(0, 1)}{art.creator.lastName.slice(0, 1)}
                                    </div>
                                )}
                                <div className="text-[13px] leading-tight">
                                    <div className="font-medium">{art.creator.firstName} {art.creator.lastName}</div>
                                    <div className="text-gray-500 dark:text-gray-400">@{art.creator.username}</div>
                                </div>
                            </div>
                        </div>

                        {/* prices */}
                        {art.price && (
                            <div className="flex flex-col gap-3 mb-5">
                                <div className="gap-2 items-center rounded-xl flex px-3 py-2 text-[12px] bg-[#eeee] dark:bg-neutral-800 w-fit">
                                    <span className="text-[14px] font-bold text-[#9C27B0]/80">Physic Price</span>
                                    <span className="text-[14px] font-bold text-[#9C27B0]/80">{Number(art.price).toLocaleString('vi-VN')} VND</span>
                                </div>
                                {currentUser && (
                                    <button
                                        onClick={() => addToCart.mutate({ artworkId: art.id, quantity: 1 })}
                                        disabled={addToCart.isPending}
                                        className="rounded-xl w-fit px-4 py-2.5 text-sm font-semibold bg-[#9C27B0] text-white hover:bg-[#9C27B0]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Category */}
                <div className="mt-6 text-[13px]">
                    <span className="text-gray-600 dark:text-gray-400">Category: </span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">{art.category.name}</span>
                    {art.category.description && (
                        <p className="mt-1 text-gray-500 dark:text-gray-400">{art.category.description}</p>
                    )}
                </div>

                {/* Comments Section */}
                <section className="mt-6">
                    <div className="mb-2 text-sm font-semibold">{comments.length} Comments</div>

                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                currentUser={currentUser}
                                replyTo={replyTo}
                                onStartReply={(id) => setReplyTo(id)}
                                onCancelReply={() => setReplyTo(null)}
                                onSendReply={sendReply}
                                onLike={(commentId) => likeCommentMutation.mutate(commentId)}
                                onEdit={(commentId, content) => updateCommentMutation.mutate({ commentId, content })}
                                onDelete={(commentId) => {
                                    if (confirm('Are you sure you want to delete this comment?')) {
                                        deleteCommentMutation.mutate(commentId)
                                    }
                                }}
                            />
                        ))}
                    </div>

                    {/* Root comment composer */}
                    {currentUser && (
                        <>
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
                                        onKeyDown={(e) => e.key === 'Enter' && sendRootComment()}
                                        style={{
                                            fontWeight: bold ? 700 : 400,
                                            fontStyle: italic ? 'italic' : 'normal',
                                            textDecoration: underline ? 'underline' : 'none',
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-end">
                                <button
                                    onClick={sendRootComment}
                                    disabled={createCommentMutation.isPending}
                                    className="inline-flex items-center gap-2 bg-[#9C27B0]/80 px-3 py-2 text-sm font-medium text-white hover:bg-[#9C27B0]/90 rounded-full disabled:opacity-50"
                                >
                                    {createCommentMutation.isPending ? 'Posting...' : 'Comment'} <PaperPlaneRight size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </section>

                {/* Related Artworks */}
                <section className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">
                        Related Artworks
                        {related.length > 0 && (
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-normal">
                                ({related.length} artworks)
                            </span>
                        )}
                    </h2>

                    {relatedLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] rounded-xl bg-gray-200 dark:bg-neutral-800 animate-pulse" />
                            ))}
                        </div>
                    ) : related.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                {related.map((r) => {
                                    const artRatio = r.height / r.width
                                    const isLikedByCurrentUser = r.likes?.some(like => like.userId === currentUser?.id) || false

                                    return (
                                        <Link
                                            key={r.id}
                                            href={`/explore/${r.id}`}
                                            className="group block overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10 hover:ring-2 hover:ring-purple-500/50 transition-all"
                                        >
                                            <div className="relative w-full" style={{ paddingBottom: `${Math.min(artRatio * 100, 150)}%` }}>
                                                <Image
                                                    src={r.imageUrl || ''}
                                                    alt={r.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    loading="lazy"
                                                    unoptimized
                                                />
                                                {/* Overlay with info */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="absolute bottom-0 left-0 right-0 p-2">
                                                        <p className="text-white text-xs font-medium truncate">{r.title}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center gap-1 text-white text-xs">
                                                                <Heart size={12} weight={isLikedByCurrentUser ? 'fill' : 'regular'} />
                                                                <span>{r.likeCount}</span>
                                                            </div>
                                                            <span className="text-white/70 text-xs">•</span>
                                                            <span className="text-white/70 text-xs truncate">
                                                                {r.creator.firstName} {r.creator.lastName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>

                            {/* Infinite scroll trigger */}
                            {hasNextPage && (
                                <div ref={loadMoreRef} className="mt-6 flex justify-center">
                                    {isFetchingNextPage ? (
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                                            <span className="text-sm">Loading more artworks...</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => fetchNextPage()}
                                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                                        >
                                            Load More
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <p>No related artworks found</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

/* --------------- CommentItem Component --------------- */
function CommentItem({
    comment,
    currentUser,
    replyTo,
    onStartReply,
    onCancelReply,
    onSendReply,
    onLike,
    onEdit,
    onDelete,
}: {
    comment: ArtworkComment
    currentUser: any
    replyTo: string | null
    onStartReply: (id: string) => void
    onCancelReply: () => void
    onSendReply: (parentId: string, content: string) => void
    onLike: (commentId: string) => void
    onEdit: (commentId: string, content: string) => void
    onDelete: (commentId: string) => void
}) {
    const reply = useTextHistory('')
    const edit = useTextHistory(comment.content)
    const [b, setB] = useState(false)
    const [i, setI] = useState(false)
    const [u, setU] = useState(false)
    const [showEmo, setShowEmo] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [showActions, setShowActions] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const editRef = useRef<HTMLInputElement>(null)
    const wrapRef = useRef<HTMLDivElement>(null)
    const actionsRef = useRef<HTMLDivElement>(null)

    const replying = replyTo === comment.id
    const isOwner = currentUser?.id === comment.userId
    const isLikedByUser = comment.likes && comment.likes.length > 0

    // Hide emoji and actions when click outside
    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (showEmo && !wrapRef.current?.contains(e.target as Node)) {
                setShowEmo(false)
            }
            if (showActions && !actionsRef.current?.contains(e.target as Node)) {
                setShowActions(false)
            }
        }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [showEmo, showActions])

    // Reset when closing composer
    useEffect(() => {
        if (!replying) {
            reply.setValue('')
            setB(false); setI(false); setU(false); setShowEmo(false)
        }
    }, [replying, reply])

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

    const handleSend = () => {
        onSendReply(comment.id, reply.value)
        reply.setValue('')
        setB(false); setI(false); setU(false); setShowEmo(false)
    }

    const handleEdit = () => {
        onEdit(comment.id, edit.value)
        setIsEditing(false)
    }

    const handleCancelEdit = () => {
        edit.setValue(comment.content)
        setIsEditing(false)
    }

    return (
        <div className="rounded-2xl px-4 py-3">
            <div className="flex items-start gap-3">
                {comment.user.avatar ? (
                    <Image src={comment.user.avatar} alt={comment.user.username} width={36} height={36} className="rounded-full" />
                ) : (
                    <div className="h-9 w-9 rounded-full bg-gray-200 text-gray-700 grid place-items-center text-[11px] font-bold dark:bg-neutral-800 dark:text-gray-100">
                        {comment.user.firstName[0]}{comment.user.lastName[0]}
                    </div>
                )}
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">{comment.user.firstName} {comment.user.lastName}</span>
                        <span className="text-xs text-gray-500">{fmt(comment.createdAt)}</span>
                        {comment.updatedAt !== comment.createdAt && (
                            <span className="text-xs text-gray-400 italic">(edited)</span>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mt-2 space-y-2">
                            <input
                                ref={editRef}
                                className="w-full rounded-lg px-3 py-2 text-sm outline-none bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-gray-100"
                                value={edit.value}
                                onChange={(e) => edit.setValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleEdit()
                                    if (e.key === 'Escape') handleCancelEdit()
                                }}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleEdit}
                                    className="rounded-md bg-purple-600 hover:bg-purple-500 px-3 py-1 text-xs text-white"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600 px-3 py-1 text-xs"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 text-[15px] text-gray-900 dark:text-gray-100">
                            {comment.content}
                        </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 space-y-3 pl-6 border-l border-black/10 dark:border-white/10">
                            {comment.replies.map((ch) => (
                                <div key={ch.id} className="flex items-start gap-3">
                                    {ch.user.avatar ? (
                                        <Image src={ch.user.avatar} alt={ch.user.username} width={32} height={32} className="rounded-full" />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-700 grid place-items-center text-[10px] font-bold dark:bg-neutral-800 dark:text-gray-100">
                                            {ch.user.firstName[0]}{ch.user.lastName[0]}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-700 dark:text-gray-300">
                                            <span className="font-medium">{ch.user.firstName} {ch.user.lastName}</span>
                                            <span className="text-xs text-gray-500">{fmt(ch.createdAt)}</span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {ch.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    {currentUser && !isEditing && (
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <button
                                onClick={() => onLike(comment.id)}
                                className="inline-flex items-center gap-1 hover:text-rose-600 dark:hover:text-rose-400"
                            >
                                <Heart size={14} weight={isLikedByUser ? 'fill' : 'regular'} className={isLikedByUser ? 'text-rose-600' : ''} />
                                <span>{comment.likeCount > 0 ? comment.likeCount : ''}</span>
                            </button>
                            {!replying && (
                                <button className="hover:text-gray-700 dark:hover:text-gray-200" onClick={() => onStartReply(comment.id)}>
                                    Reply
                                </button>
                            )}
                            {isOwner && (
                                <div className="relative" ref={actionsRef}>
                                    <button
                                        onClick={() => setShowActions(!showActions)}
                                        className="hover:text-gray-700 dark:hover:text-gray-200"
                                    >
                                        <DotsThreeVertical size={16} />
                                    </button>
                                    {showActions && (
                                        <div className="absolute z-20 left-0 mt-1 rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/10 py-1 min-w-[100px]">
                                            <button
                                                onClick={() => {
                                                    setIsEditing(true)
                                                    setShowActions(false)
                                                }}
                                                className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-neutral-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onDelete(comment.id)
                                                    setShowActions(false)
                                                }}
                                                className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-neutral-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reply composer */}
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
                                    placeholder={`Reply to ${comment.user.firstName}`}
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
