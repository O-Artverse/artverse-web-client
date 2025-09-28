'use client';

import { useState } from 'react';
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
  useDisclosure
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

export default function ArtworksPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isArtist = user?.businessType === 'ARTIST';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);

  // Mock artworks data
  const mockArtworks = [
    {
      id: 1,
      title: "Sunset Dreams",
      description: "A beautiful landscape painting capturing the essence of a sunset",
      digitalPrice: 25,
      physicalPrice: 850,
      hasPhysicalVersion: true,
      status: "PUBLISHED",
      category: "Landscape",
      medium: "Oil on Canvas",
      dimensions: "60x40 cm",
      year: 2024,
      views: 324,
      likes: 45,
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
      tags: ["sunset", "landscape", "nature"]
    },
    {
      id: 2,
      title: "Urban Rhythm",
      description: "Modern abstract piece inspired by city life",
      digitalPrice: 35,
      physicalPrice: 1200,
      hasPhysicalVersion: true,
      status: "PUBLISHED",
      category: "Abstract",
      medium: "Acrylic on Canvas",
      dimensions: "80x60 cm",
      year: 2024,
      views: 567,
      likes: 78,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      tags: ["abstract", "urban", "modern"]
    },
    {
      id: 3,
      title: "Nature's Call",
      description: "A serene forest scene with wildlife",
      digitalPrice: 15,
      physicalPrice: 0,
      hasPhysicalVersion: false,
      status: "DRAFT",
      category: "Nature",
      medium: "Watercolor",
      dimensions: "50x35 cm",
      year: 2024,
      views: 234,
      likes: 32,
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
      tags: ["nature", "forest", "wildlife"]
    }
  ];

  const filteredArtworks = mockArtworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artwork.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || artwork.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteArtwork = (artwork: any) => {
    setSelectedArtwork(artwork);
    onOpen();
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log('Deleting artwork:', selectedArtwork?.id);
    onClose();
  };

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
            <div className="text-2xl font-bold text-blue-600">
              {mockArtworks.length}
            </div>
            <div className="text-sm text-gray-600">Total Artworks</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">
              {mockArtworks.filter(a => a.status === 'PUBLISHED').length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">
              {mockArtworks.filter(a => a.status === 'DRAFT').length}
            </div>
            <div className="text-sm text-gray-600">Drafts</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">
              ${mockArtworks.reduce((sum, a) => sum + a.digitalPrice + (a.hasPhysicalVersion ? a.physicalPrice : 0), 0).toLocaleString()}
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
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2">
                  <Chip
                    size="sm"
                    color={artwork.status === 'PUBLISHED' ? 'success' : 'warning'}
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
                    {artwork.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{artwork.medium}</span>
                  <span>{artwork.dimensions}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{artwork.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={16} />
                    <span>{artwork.likes}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-auto">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-blue-600 dark:text-blue-400">💻</span>
                      <span className="text-xs font-semibold">${artwork.digitalPrice}</span>
                    </div>
                    {artwork.hasPhysicalVersion && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-600 dark:text-green-400">📦</span>
                        <span className="text-xs font-semibold">${artwork.physicalPrice}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex gap-2">
                    {artwork.tags.slice(0, 2).map((tag) => (
                      <Chip key={tag} size="sm" variant="flat" color="default">
                        {tag}
                      </Chip>
                    ))}
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
              Are you sure you want to delete "{selectedArtwork?.title}"? This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}