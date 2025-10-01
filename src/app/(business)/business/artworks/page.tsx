'use client';

import { useState, useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner
} from '@heroui/react';
import {
  Plus,
  MagnifyingGlass,
  Eye,
  Heart,
  DotsThree,
  PencilSimple,
  Trash,
  CurrencyDollar,
  Palette
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { useArtworks, useArtworkCategories } from '@/hooks/queries/artwork.query';
import { useDeleteArtwork } from '@/hooks/mutations/artwork.mutation';
import { toast } from 'react-hot-toast';
import type { Artwork } from '@/services/artwork.service';
import { getArtworkImageUrl } from '@/utils/imageUtils';

export default function ArtworksPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isArtist = user?.businessType === 'ARTIST';
  const isOrganization = user?.businessType === 'ORGANIZATION';
  const organizationId = user?.ownedOrganizations?.[0]?.id;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Fetch artworks with filters
  // For organizations: filter by organizationId
  // For artists: filter by creatorId
  const artworksQuery = useArtworks({
    ...(isOrganization && organizationId ? { organizationId } : {}),
    ...(isArtist ? { creatorId: user?.id } : {}),
    status: statusFilter === 'all' ? undefined : statusFilter.toUpperCase(),
    categoryId: categoryFilter === 'all' ? undefined : categoryFilter,
    search: searchQuery || undefined,
  });

  // Fetch categories
  const { data: categories } = useArtworkCategories();

  // Delete mutation
  const deleteMutation = useDeleteArtwork();

  // Filter artworks on client side for search
  const filteredArtworks = useMemo(() => {
    return artworksQuery.data?.data || [];
  }, [artworksQuery.data]);

  const handleDeleteArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedArtwork) return;

    try {
      await deleteMutation.mutateAsync(selectedArtwork.id);
      toast.success('Artwork deleted successfully');
      onClose();
      setSelectedArtwork(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete artwork');
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const allArtworks = artworksQuery.data?.data || [];
    return {
      total: allArtworks.length,
      published: allArtworks.filter((a) => a.status === 'PUBLISHED').length,
      draft: allArtworks.filter((a) => a.status === 'DRAFT').length,
      totalValue: allArtworks
        .reduce((sum, a) => sum + (a.price ? Number(a.price) : 0), 0)
        .toFixed(2),
    };
  }, [artworksQuery.data]);

  // Loading state
  if (artworksQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isArtist ? 'My Artworks' : 'Organization Artworks'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isArtist ? 'Manage your artwork portfolio' : 'Manage artworks in your organization'}
          </p>
        </div>
        <Link href="/business/artworks/create">
          <Button
            color="primary"
            startContent={<Plus size={16} />}
            className="w-full sm:w-auto"
          >
            Upload Artwork
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row gap-4 p-6">
          <Input
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<MagnifyingGlass size={16} />}
            className="flex-1"
          />
          <Select
            placeholder="Filter by category"
            selectedKeys={[categoryFilter]}
            onSelectionChange={(keys) => setCategoryFilter(Array.from(keys)[0] as string)}
            className="w-full sm:w-48"
            items={[{ id: 'all', name: 'All Categories' }, ...(categories || [])]}
          >
            {(category) => (
              <SelectItem key={category.id}>{category.name}</SelectItem>
            )}
          </Select>
          <Select
            placeholder="Filter by status"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
            className="w-full sm:w-48"
          >
            <SelectItem key="all">All Status</SelectItem>
            <SelectItem key="published">Published</SelectItem>
            <SelectItem key="draft">Draft</SelectItem>
            <SelectItem key="archived">Archived</SelectItem>
          </Select>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Artworks</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.published}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">
              {stats.draft}
            </div>
            <div className="text-sm text-gray-600">Drafts</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">
              ${Number(stats.totalValue).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </CardBody>
        </Card>
      </div>

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtworks.map((artwork) => (
          <Card key={artwork.id} className="group hover:shadow-lg transition-shadow">
            <CardBody className="p-0">
              {/* Image */}
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <Image
                  src={artwork.imageUrl || ''}
                  alt={artwork.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2">
                  <Chip
                    size="sm"
                    color={
                      artwork.status === 'PUBLISHED'
                        ? 'success'
                        : artwork.status === 'DRAFT'
                        ? 'warning'
                        : 'default'
                    }
                    variant="solid"
                  >
                    {artwork.status}
                  </Chip>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {artwork.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {artwork.description || 'No description'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{artwork.medium || 'N/A'}</span>
                  <span>{artwork.dimensions || `${artwork.width}x${artwork.height}`}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{artwork.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={16} />
                    <span>{artwork.likeCount}</span>
                  </div>
                  {artwork.price && (
                    <div className="flex items-center gap-1 ml-auto">
                      <CurrencyDollar size={16} />
                      <span className="font-semibold">${Number(artwork.price).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex gap-2">
                    {artwork.tags.slice(0, 2).map((tag) => (
                      <Chip key={tag} size="sm" variant="flat" color="default">
                        {tag}
                      </Chip>
                    ))}
                    {artwork.tags.length > 2 && (
                      <Chip size="sm" variant="flat" color="default">
                        +{artwork.tags.length - 2}
                      </Chip>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      as={Link}
                      href={`/business/artworks/${artwork.id}/edit`}
                    >
                      <PencilSimple size={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDeleteArtwork(artwork)}
                      isLoading={deleteMutation.isPending && selectedArtwork?.id === artwork.id}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredArtworks.length === 0 && (
        <Card className="bg-white dark:bg-[#1E1B26] border-gray-200 dark:border-gray-700/30">
          <CardBody className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Palette size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No artworks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by uploading your first artwork'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link href="/business/artworks/create">
                <Button color="primary" startContent={<Plus size={16} />}>
                  Upload First Artwork
                </Button>
              </Link>
            )}
          </CardBody>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Delete Artwork</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete "{selectedArtwork?.title}"? This
              action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} isDisabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={confirmDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}