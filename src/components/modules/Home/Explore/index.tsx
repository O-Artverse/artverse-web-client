'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Export as ExportIcon, DotsThree as DotsThreeIcon } from '@phosphor-icons/react'
import { listArts, type Art, type Category } from '@/data/ArtData'

function ActionBtn({ children, label }: React.PropsWithChildren<{ label: string }>) {
    return (
        <button
            aria-label={label}
            className="h-9 w-9 grid place-items-center rounded-full bg-white dark:bg-neutral-900/90 ring-1 ring-black/10 dark:ring-white/10 shadow-md backdrop-blur hover:shadow-[0_0_10px_rgba(210,67,207,0.35)] dark:hover:shadow-[0_0_12px_rgba(210,67,207,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
            <span className="text-primary">{children}</span>
        </button>
    )
}

const Card = React.memo(function Card({ a }: { a: Art }) {
    const [loaded, setLoaded] = useState(false)
    const [hover, setHover] = useState(false)
    const pb = `${a.ratio * 100}%`
    return (
        <div
            className="mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-gray-100 dark:bg-neutral-800 relative"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Link href={`/explore/${a.id}`} className="relative block w-full" style={{ paddingBottom: pb }}>
                {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-neutral-700" />}
                <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
                    className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setLoaded(true)}
                    unoptimized
                    loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 to-black/50" />
                {hover && (
                    <div className="absolute bottom-2 right-2 z-10 flex gap-2">
                        <ActionBtn label="Share"><ExportIcon size={16} weight="bold" /></ActionBtn>
                        <ActionBtn label="More"><DotsThreeIcon size={18} weight="bold" /></ActionBtn>
                    </div>
                )}
            </Link>
        </div>
    )
})

export default function ExplorePage() {
    const CATS: ('All' | Category)[] = ['All', 'Realism', 'Impressionism', 'Abstract', 'Nature', 'Cityscapes']
    const [active, setActive] = useState<typeof CATS[number]>('All')
    const [items, setItems] = useState<Art[]>([])
    const [skip, setSkip] = useState(0)
    const [loading, setLoading] = useState(false)
    const endRef = useRef<HTMLDivElement>(null)

    // helper: gộp & loại trùng id (chặn duplicate key)
    const mergeById = (prev: Art[], more: Art[]) => {
        const seen = new Set(prev.map(x => x.id))
        const dedup = more.filter(x => !seen.has(x.id))
        return [...prev, ...dedup]
    }

    // load đầu & khi đổi category
    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setSkip(0)
            ; (async () => {
                const data = await listArts({ category: active, take: 30, skip: 0 })
                if (cancelled) return
                setItems(data)          // data đã unique từ mock
                setSkip(30)
                setLoading(false)
            })()
        return () => { cancelled = true }
    }, [active])

    // infinite scroll
    useEffect(() => {
        const io = new IntersectionObserver(async (entries) => {
            if (!entries[0].isIntersecting || loading) return
            setLoading(true)
            const more = await listArts({ category: active, take: 24, skip })
            setItems(prev => mergeById(prev, more))
            setSkip(prev => prev + 24)
            setLoading(false)
        }, { rootMargin: '800px 0px' })
        if (endRef.current) io.observe(endRef.current)
        return () => io.disconnect()
    }, [active, skip, loading])

    const Masonry = useMemo(() => (
        <div className="w-full px-2 sm:px-4 box-border">
            <div className="columns-2 sm:columns-3 md:columns-4 xl:columns-6 2xl:columns-8 gap-3">
                {items.map((a, idx) => <Card key={`${a.id}-${idx}`} a={a} />)}
            </div>
        </div>
    ), [items])

    return (
        <div className="min-h-screen overflow-x-hidden ">
            <div className="w-full bg-transparent px-3 sm:px-6 py-2">
                <div className="flex flex-wrap gap-2">
                    {CATS.map(c => (
                        <button
                            key={c}
                            onClick={() => setActive(c)}
                            className={`rounded-full px-3 py-1 text-sm transition ${active === c
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 dark:bg-neutral-800"
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>


            <main className="py-3 sm:py-6">{Masonry}</main>

            <div ref={endRef} className="py-8 text-center">
                {loading
                    ? <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                    : <p className="text-sm text-gray-500 dark:text-gray-400">Scroll for more…</p>}
            </div>
        </div>
    )
}
