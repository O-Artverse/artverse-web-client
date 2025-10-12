'use client'

import React, { useState } from 'react'
import { useMyAlbums } from '@/hooks/queries/album.query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import albumService, { type CreateAlbumDto } from '@/services/album.service'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Lock, Globe, Users } from '@phosphor-icons/react'
import { getArtworkImageUrl } from '@/utils/imageUtils'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, useDisclosure } from '@heroui/react'
import toast from 'react-hot-toast'

export default function AlbumsPage() {
  const { data: albums, isLoading } = useMyAlbums()
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [formData, setFormData] = useState<CreateAlbumDto>({
    name: '',
    description: '',
    privacy: 'PUBLIC',
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateAlbumDto) => albumService.createAlbum(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums', 'my-albums'] })
      toast.success('Album created successfully')
      onOpenChange()
      setFormData({ name: '', description: '', privacy: 'PUBLIC' })
    },
    onError: () => {
      toast.error('Failed to create album')
    },
  })

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Album name is required')
      return
    }
    createMutation.mutate(formData)
  }

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'PRIVATE':
        return <Lock size={16} weight="bold" />
      case 'FRIENDS_ONLY':
        return <Users size={16} weight="bold" />
      default:
        return <Globe size={16} weight="bold" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold dark:text-white">My Albums</h1>
        <Button
          color="primary"
          startContent={<Plus size={20} weight="bold" />}
          onPress={onOpen}
          className="bg-purple-600 text-white"
        >
          Create Album
        </Button>
      </div>

      {/* Albums Grid */}
      {albums && albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album) => {
            const coverImage = album.coverImage || album.artworks?.[0]?.artwork.imageUrl
            const artworkCount = album._count?.artworks || 0

            return (
              <Link key={album.id} href={`/albums/${album.id}`}>
                <div className="group cursor-pointer">
                  {/* Cover Image */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-neutral-800 mb-3">
                    {coverImage ? (
                      <Image
                        src={getArtworkImageUrl(coverImage) || ''}
                        alt={album.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <Plus size={48} weight="thin" />
                      </div>
                    )}
                    {/* Privacy Badge */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <span className="text-white text-xs">
                        {getPrivacyIcon(album.privacy)}
                      </span>
                    </div>
                  </div>

                  {/* Album Info */}
                  <h3 className="font-semibold text-lg dark:text-white mb-1 line-clamp-1">
                    {album.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {artworkCount} {artworkCount === 1 ? 'artwork' : 'artworks'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Plus size={64} weight="thin" className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold dark:text-white mb-2">No albums yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first album to organize your favorite artworks
          </p>
          <Button
            color="primary"
            startContent={<Plus size={20} weight="bold" />}
            onPress={onOpen}
            className="bg-purple-600 text-white"
          >
            Create Album
          </Button>
        </div>
      )}

      {/* Create Album Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent className="bg-white dark:bg-[#1E1B26]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-gray-900 dark:text-white">Create New Album</ModalHeader>
              <ModalBody>
                <Input
                  label="Album Name"
                  placeholder="Enter album name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  isRequired
                />
                <Textarea
                  label="Description"
                  placeholder="Enter album description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Select
                  label="Privacy"
                  placeholder="Select privacy"
                  selectedKeys={[formData.privacy || 'PUBLIC']}
                  onSelectionChange={(keys) => setFormData({ ...formData, privacy: Array.from(keys)[0] as any })}
                >
                  <SelectItem key="PUBLIC">Public</SelectItem>
                  <SelectItem key="PRIVATE">Private</SelectItem>
                  <SelectItem key="FRIENDS_ONLY">Friends Only</SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={createMutation.isPending}
                  className="bg-purple-600"
                >
                  Create Album
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
