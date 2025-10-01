'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Export as ExportIcon, DotsThree as DotsThreeIcon, BookmarkSimple, Heart } from '@phosphor-icons/react'
import { useInfiniteArtworks, useArtworkCategories } from '@/hooks/queries/artwork.query'
import { useMyAlbums } from '@/hooks/queries/album.query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import albumService from '@/services/album.service'
import artworkService from '@/services/artwork.service'
import type { Artwork } from '@/services/artwork.service'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react'
import toast from 'react-hot-toast'
import { useAppSelector } from '@/store/hooks'
import { getArtworkImageUrl } from '@/utils/imageUtils'

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

const Card = React.memo(function Card({
    artwork,
    onAddToAlbum,
    onToggleLike,
    onToggleSave
}: {
    artwork: Artwork
    onAddToAlbum: (artworkId: string) => void
    onToggleLike: (artworkId: string) => void
    onToggleSave: (artworkId: string) => void
}) {
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
            </Link>
            {hover && (
                <div className="absolute bottom-2 right-2 z-10 flex gap-2 pointer-events-auto">
                    <ActionBtn label="Share"><ExportIcon size={16} weight="bold" /></ActionBtn>
                    <Dropdown>
                        <DropdownTrigger>
                            <button
                                aria-label="More options"
                                className="h-9 w-9 grid place-items-center rounded-full bg-white dark:bg-neutral-900/90 ring-1 ring-black/10 dark:ring-white/10 shadow-md backdrop-blur hover:shadow-[0_0_10px_rgba(210,67,207,0.35)] dark:hover:shadow-[0_0_12px_rgba(210,67,207,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                            >
                                <span className="text-primary"><DotsThreeIcon size={18} weight="bold" /></span>
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Artwork actions">
                            <DropdownItem
                                key="add-to-album"
                                startContent={<BookmarkSimple size={16} weight="bold" />}
                                onPress={() => onAddToAlbum(artwork.id)}
                            >
                                Add to Album
                            </DropdownItem>
                            <DropdownItem
                                key="like"
                                startContent={<Heart size={16} weight="bold" />}
                                onPress={() => onToggleLike(artwork.id)}
                            >
                                Like
                            </DropdownItem>
                            <DropdownItem
                                key="save"
                                startContent={<BookmarkSimple size={16} weight="bold" />}
                                onPress={() => onToggleSave(artwork.id)}
                            >
                                Save
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            )}
        </div>
    )
})

export default function ExplorePage() {
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
    const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { user } = useAppSelector((state) => state.auth)
    const queryClient = useQueryClient()

    // Fetch categories
    const { data: categories } = useArtworkCategories()

    // Fetch user's albums
    const { data: albums } = useMyAlbums()

    // Fetch artworks with infinite scroll
    const {
        data: artworksData,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteArtworks({
        status: 'PUBLISHED',
        categoryId: activeCategoryId || undefined,
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

    // Mutations
    const addToAlbumMutation = useMutation({
        mutationFn: ({ albumId, artworkId }: { albumId: string; artworkId: string }) =>
            albumService.addArtworkToAlbum(albumId, { artworkId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums'] })
            toast.success('Added to album')
            onOpenChange()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add to album')
        },
    })

    const toggleLikeMutation = useMutation({
        mutationFn: (artworkId: string) => artworkService.toggleLike(artworkId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artworks'] })
            toast.success('Liked!')
        },
    })

    const toggleSaveMutation = useMutation({
        mutationFn: (artworkId: string) => artworkService.toggleSave(artworkId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artworks'] })
            toast.success('Saved!')
        },
    })

    const handleAddToAlbum = (artworkId: string) => {
        if (!user) {
            toast.error('Please sign in to add to album')
            return
        }
        setSelectedArtworkId(artworkId)
        onOpen()
    }

    const handleAlbumSelect = (albumId: string) => {
        if (selectedArtworkId) {
            addToAlbumMutation.mutate({ albumId, artworkId: selectedArtworkId })
        }
    }

    const Masonry = useMemo(() => (
        <div className="w-full px-0 sm:px-0 box-border">
            <div className="columns-2 sm:columns-3 md:columns-4 xl:columns-6 2xl:columns-8 gap-3">
                {items.map((artwork) => (
                    <Card
                        key={artwork.id}
                        artwork={artwork}
                        onAddToAlbum={handleAddToAlbum}
                        onToggleLike={(id) => toggleLikeMutation.mutate(id)}
                        onToggleSave={(id) => toggleSaveMutation.mutate(id)}
                    />
                ))}
            </div>
        </div>
    ), [items, handleAddToAlbum, toggleLikeMutation, toggleSaveMutation])

    return (
        <div className="h-full ">
            <div className="w-full bg-transparent px-0">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveCategoryId(null)}
                        className={`rounded-full px-3 py-1 text-sm transition ${
                            activeCategoryId === null
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 dark:bg-neutral-800"
                        }`}
                    >
                        All
                    </button>
                    {categories?.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategoryId(category.id)}
                            className={`rounded-full px-3 py-1 text-sm transition ${
                                activeCategoryId === category.id
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 dark:bg-neutral-800"
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <main className="py-3 sm:py-3 min-h-[calc(100vh-300px)]">
                {isLoading ? (
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

            {/* Album Selection Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Add to Album</ModalHeader>
                            <ModalBody>
                                {albums && albums.length > 0 ? (
                                    <div className="space-y-2">
                                        {albums.map((album) => (
                                            <button
                                                key={album.id}
                                                onClick={() => handleAlbumSelect(album.id)}
                                                disabled={addToAlbumMutation.isPending}
                                                className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                                            >
                                                {album.coverImage || album.artworks?.[0]?.artwork.imageUrl ? (
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-neutral-700 relative flex-shrink-0">
                                                        <Image
                                                            src={getArtworkImageUrl(album.coverImage || album.artworks?.[0]?.artwork.imageUrl) || ''}
                                                            alt={album.name}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                                                        <BookmarkSimple size={20} className="text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium dark:text-white">{album.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {album._count?.artworks || 0} artworks
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            No albums yet. Create one first!
                                        </p>
                                        <Link href="/albums">
                                            <Button color="primary" className="bg-purple-600">
                                                Create Album
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}
