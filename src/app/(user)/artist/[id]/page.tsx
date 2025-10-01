'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Export as ExportIcon, DotsThree as DotsThreeIcon, MapPin, Calendar, Palette } from '@phosphor-icons/react'
import { useInfiniteArtworks } from '@/hooks/queries/artwork.query'
import { useQuery } from '@tanstack/react-query'
import axiosClient from '@/configs/axios-client'
import type { Artwork } from '@/services/artwork.service'
import { getUserAvatarUrl, getArtworkImageUrl } from '@/utils/imageUtils'

interface ArtistProfile {
    id: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
    description?: string
    email?: string
    businessType?: string
    createdAt: string
    _count?: {
        createdArtworks: number
    }
}

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

const Card = React.memo(function Card({ artwork }: { artwork: Artwork }) {
    const [loaded, setLoaded] = useState(false)
    const [hover, setHover] = useState(false)
    const ratio = artwork.height / artwork.width
    const pb = `${ratio * 100}%`
    return (
        <div
            className="mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-gray-100 dark:bg-neutral-800 relative"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Link href={`/explore/${artwork.id}`} className="relative block w-full" style={{ paddingBottom: pb }}>
                {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-neutral-700" />}
                <Image
                    src={artwork.imageUrl || ''}
                    alt={artwork.title}
                    fill
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
                    className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setLoaded(true)}
                    unoptimized
                    loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0" />
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

export default function ArtistPage() {
    const params = useParams()
    const artistId = params.id as string
    const loadMoreRef = useRef<HTMLDivElement>(null)

    // Fetch artist profile
    const { data: artist, isLoading: isLoadingProfile } = useQuery<ArtistProfile>({
        queryKey: ['artist', artistId],
        queryFn: async () => {
            const response = await axiosClient.get(`/users/${artistId}`)
            return response.data
        },
    })

    // Fetch artist's artworks with infinite scroll
    const {
        data: artworksData,
        isLoading: isLoadingArtworks,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteArtworks({
        status: 'PUBLISHED',
        creatorId: artistId,
        limit: 20,
    })

    // Flatten all pages
    const items = artworksData?.pages.flatMap(page => page.data) || []

    // Intersection observer for infinite scroll
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

    const Masonry = useMemo(() => (
        <div className="w-full px-0 sm:px-0 box-border">
            <div className="columns-2 sm:columns-3 md:columns-4 xl:columns-6 2xl:columns-8 gap-3">
                {items.map((artwork) => <Card key={artwork.id} artwork={artwork} />)}
            </div>
        </div>
    ), [items])

    if (isLoadingProfile) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
            </div>
        )
    }

    if (!artist) {
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-gray-500 dark:text-gray-400">Artist not found</p>
            </div>
        )
    }

    const fullName = `${artist.firstName} ${artist.lastName}`
    const joinDate = new Date(artist.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    return (
        <div className="h-full">
            {/* Artist Profile Header */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-800">
                            {getUserAvatarUrl(artist.avatar) ? (
                                <Image
                                    src={getUserAvatarUrl(artist.avatar)!}
                                    alt={fullName}
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-purple-600">
                                    {artist.firstName.charAt(0)}{artist.lastName.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold dark:text-white mb-1">{fullName}</h1>
                                <p className="text-gray-600 dark:text-gray-400">@{artist.username}</p>
                            </div>
                        </div>

                        {artist.description && (
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                {artist.description}
                            </p>
                        )}

                        {/* Stats & Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            {artist.businessType && (
                                <div className="flex items-center gap-2">
                                    <Palette size={18} weight="bold" className="text-purple-600" />
                                    <span className="capitalize">{artist.businessType.toLowerCase()}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar size={18} weight="bold" className="text-purple-600" />
                                <span>Joined {joinDate}</span>
                            </div>
                            {artist._count?.createdArtworks !== undefined && (
                                <div className="flex items-center gap-2">
                                    <Palette size={18} weight="bold" className="text-purple-600" />
                                    <span>{artist._count.createdArtworks} {artist._count.createdArtworks === 1 ? 'artwork' : 'artworks'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Artworks Section */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold dark:text-white">Artworks</h2>
            </div>

            <main className="py-3 sm:py-3 min-h-[calc(100vh-400px)]">
                {isLoadingArtworks ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <p className="text-gray-500 dark:text-gray-400">No artworks found</p>
                    </div>
                ) : (
                    <>
                        {Masonry}

                        {/* Infinite scroll trigger */}
                        {hasNextPage && (
                            <div ref={loadMoreRef} className="mt-8 pb-8 flex justify-center">
                                {isFetchingNextPage ? (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent"></div>
                                        <span className="text-sm">Loading more artworks...</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => fetchNextPage()}
                                        className="px-6 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Load More Artworks
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}