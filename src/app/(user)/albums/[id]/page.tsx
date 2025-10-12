'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useAlbum } from '@/hooks/queries/album.query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import albumService from '@/services/album.service'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, DotsThree, Trash, Lock, Globe, Users, Pencil } from '@phosphor-icons/react'
import { getArtworkImageUrl } from '@/utils/imageUtils'
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'
import toast from 'react-hot-toast'

export default function AlbumDetailPage() {
  const params = useParams()
  const albumId = params.id as string
  const { data: album, isLoading } = useAlbum(albumId)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (artworkId: string) => albumService.removeArtworkFromAlbum(albumId, artworkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums', 'detail', albumId] })
      toast.success('Artwork removed from album')
    },
    onError: () => {
      toast.error('Failed to remove artwork')
    },
  })

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'PRIVATE':
        return <Lock size={20} weight="bold" />
      case 'FRIENDS_ONLY':
        return <Users size={20} weight="bold" />
      default:
        return <Globe size={20} weight="bold" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  if (!album) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h3 className="text-xl font-semibold dark:text-white mb-2">Album not found</h3>
        <Link href="/albums">
          <Button color="primary" className="bg-purple-600">
            Back to Albums
          </Button>
        </Link>
      </div>
    )
  }

  const artworks = album.artworks || []

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/albums">
          <Button
            variant="light"
            startContent={<ArrowLeft size={20} weight="bold" />}
            className="mb-4"
          >
            Back to Albums
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold dark:text-white">{album.name}</h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                {getPrivacyIcon(album.privacy)}
              </div>
            </div>
            {album.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-2">{album.description}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'}
            </p>
          </div>

          <Button
            isIconOnly
            variant="light"
            className="text-gray-600 dark:text-gray-400"
          >
            <DotsThree size={24} weight="bold" />
          </Button>
        </div>
      </div>

      {/* Artworks Grid */}
      {artworks.length > 0 ? (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4">
          {artworks
            .sort((a, b) => a.order - b.order)
            .map((item) => {
              const artwork = item.artwork
              const ratio = artwork.height / artwork.width
              const pb = `${ratio * 100}%`

              return (
                <div
                  key={item.id}
                  className="mb-4 break-inside-avoid overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-800 relative group"
                >
                  <Link
                    href={`/explore/${artwork.id}`}
                    className="relative block w-full"
                    style={{ paddingBottom: pb }}
                  >
                    <Image
                      src={getArtworkImageUrl(artwork.imageUrl) || ''}
                      alt={artwork.title}
                      fill
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
                      className="object-cover"
                      unoptimized
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </Link>

                  {/* Remove from album button */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          size="sm"
                          className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur"
                        >
                          <DotsThree size={18} weight="bold" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Artwork actions" className="bg-white dark:bg-[#1E1B26]">
                        <DropdownItem
                          key="view"
                          as={Link}
                          href={`/explore/${artwork.id}`}
                          className="text-gray-700 dark:text-white"
                        >
                          View Details
                        </DropdownItem>
                        <DropdownItem
                          key="remove"
                          className="text-danger"
                          color="danger"
                          startContent={<Trash size={16} weight="bold" className="text-danger" />}
                          onPress={() => deleteMutation.mutate(artwork.id)}
                        >
                          Remove from Album
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  {/* Artwork info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="text-white font-semibold text-sm line-clamp-1">
                      {artwork.title}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {artwork.creator.firstName} {artwork.creator.lastName}
                    </p>
                  </div>
                </div>
              )
            })}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold dark:text-white mb-2">No artworks yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding artworks to this album from the explore page
          </p>
          <Link href="/explore">
            <Button color="primary" className="bg-purple-600">
              Explore Artworks
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}