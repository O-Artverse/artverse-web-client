'use client';

import { useAppSelector } from '@/store/hooks';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import {
  PencilSimple,
  MapPin,
  Calendar,
  Heart,
  Star,
  EnvelopeSimple,
  Phone,
  Globe,
  BookmarkSimple,
  Eye,
  Palette,
  ArrowRight,
  DotsThree,
  Share,
  Trash,
  X,
  GridFour,
  List as ListIcon
} from '@phosphor-icons/react';
import Image from 'next/image';
import { getUserAvatarUrl, getArtworkImageUrl } from '@/utils/imageUtils';
import Link from 'next/link';
import { useState } from 'react';
import MainLayout from '@/components/core/layouts/MainLayout';
import { useMyAlbums } from '@/hooks/queries/album.query';
import { useSavedArtworks } from '@/hooks/queries/artwork.query';

export default function UserProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedTab, setSelectedTab] = useState('overview');

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Please sign in</h2>
            <p className="text-gray-600 dark:text-gray-400">You need to be signed in to view your profile</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Redirect business users to business profile
  if (user.businessType) {
    window.location.href = '/business/profile';
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <Avatar
                  src={getUserAvatarUrl(user.avatarPath) || undefined}
                  name={`${user.firstName} ${user.lastName}`}
                  className="w-32 h-32 text-2xl border-4 border-white/30 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
                  <Palette size={20} className="text-white" />
                </div>
              </div>

              <div className="text-center md:text-left flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/90 bg-clip-text">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-xl text-white/80 font-medium">Art Collector & Enthusiast</p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <Chip
                    color="secondary"
                    variant="flat"
                    size="lg"
                    className="bg-white/15 text-white border-white/30 backdrop-blur-sm"
                    startContent={<Star size={16} />}
                  >
                    Member
                  </Chip>
                  {user.city && (
                    <span className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm">
                      <MapPin size={16} />
                      {user.city}
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm">
                    <Calendar size={16} />
                    Joined {user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
                  </span>
                </div>

                {user.bio && (
                  <p className="text-white/90 max-w-2xl text-lg leading-relaxed">{user.bio}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/settings?active=edit-profile">
                  <Button
                    color="secondary"
                    variant="solid"
                    size="lg"
                    startContent={<PencilSimple size={18} />}
                    className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-medium"
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          className="w-full"
          classNames={{
            tabList: "bg-white dark:bg-[#1E1B26] rounded-lg p-1 [box-shadow:0_1px_4px_rgba(0,0,0,0.2)]",
            tab: "data-[selected=true]:bg-blue-500 data-[selected=true]:text-white",
          }}
        >
          <Tab key="overview" title="Overview">
            <div className="mt-6">
              <UserOverview user={user} />
            </div>
          </Tab>

          <Tab key="collections" title="My Albums">
            <div className="mt-6">
              <UserCollections />
            </div>
          </Tab>

          <Tab key="saved" title="Saved Artworks">
            <div className="mt-6">
              <SavedArtworks />
            </div>
          </Tab>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// User Overview Component
function UserOverview({ user }: { user: any }) {
  const { data: albums } = useMyAlbums();
  const { data: savedArtworks } = useSavedArtworks();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Basic Info */}
      <Card className="lg:col-span-2 bg-white dark:bg-[#1E1B26] [box-shadow:0_1px_4px_rgba(0,0,0,0.2)]">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About Me</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.email && (
              <div className="flex items-center gap-3">
                <EnvelopeSimple size={20} className="text-gray-400 dark:text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-400 dark:text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{user.phone}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-gray-400 dark:text-gray-500" />
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {user.website}
                </a>
              </div>
            )}
          </div>
          {user.bio && (
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Bio</h4>
              <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-white dark:bg-[#1E1B26] [box-shadow:0_1px_4px_rgba(0,0,0,0.2)]">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Activity</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Palette size={16} className="text-purple-500" />
              <span className="text-gray-700 dark:text-gray-300">Albums</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">{albums?.length || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookmarkSimple size={16} className="text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-300">Saved Artworks</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">{savedArtworks?.length || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye size={16} className="text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Profile Views</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">0</span>
          </div>
        </CardBody>
      </Card>

      {/* Activity Stats Cards */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-200 dark:border-purple-800">
          <CardBody className="text-center p-4">
            <div className="text-2xl mb-2">🎨</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{albums?.length || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Albums</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-200 dark:border-yellow-800">
          <CardBody className="text-center p-4">
            <div className="text-2xl mb-2">🔖</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{savedArtworks?.length || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Saved Items</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800">
          <CardBody className="text-center p-4">
            <div className="text-2xl mb-2">👁️</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Profile Views</div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

// Saved Artworks Component
function SavedArtworks() {
  const { data: savedArtworks, isLoading } = useSavedArtworks();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!savedArtworks || savedArtworks.length === 0) {
    return (
      <Card className="bg-white dark:bg-[#1E1B26] border-gray-200 dark:border-gray-700/30">
        <CardBody className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <BookmarkSimple size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No saved artworks yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start exploring and save artworks you love
          </p>
          <Link href="/explore">
            <Button color="primary">
              Explore Artworks
            </Button>
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">Saved Artworks ({savedArtworks.length})</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {savedArtworks.map((artwork) => (
          <Link key={artwork.id} href={`/artworks/${artwork.id}`}>
            <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <Image
                    src={getArtworkImageUrl(artwork.imageUrl) || ''}
                    alt={artwork.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                    {artwork.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    by {artwork.creator.firstName} {artwork.creator.lastName}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

// User Collections Component
function UserCollections() {
  const { data: albums, isLoading } = useMyAlbums();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!albums || albums.length === 0) {
    return (
      <Card className="bg-white dark:bg-[#1E1B26] border-gray-200 dark:border-gray-700/30">
        <CardBody className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Palette size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No albums yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first album to organize your favorite artworks
          </p>
          <Link href="/albums/create">
            <Button color="primary">
              Create Album
            </Button>
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Albums</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {albums.length} {albums.length === 1 ? 'collection' : 'collections'}
          </p>
        </div>
        <Link href="/albums">
          <Button
            color="primary"
            variant="flat"
            endContent={<ArrowRight size={16} weight="bold" />}
          >
            View All
          </Button>
        </Link>
      </div>

      {/* Albums Grid - Pinterest/Masonry style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {albums.map((album) => {
          const artworkCount = album._count?.artworks || 0;
          const coverImage = getArtworkImageUrl(album.coverImage || album.artworks?.[0]?.artwork.imageUrl);
          const previewImages = album.artworks?.slice(0, 4).map(a => getArtworkImageUrl(a.artwork.imageUrl)).filter(Boolean) as string[] || [];

          return (
            <Link key={album.id} href={`/albums/${album.id}`}>
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#1E1B26] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer">
                {/* Image Grid */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  {previewImages.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Palette size={48} className="text-gray-300 dark:text-gray-600" />
                    </div>
                  )}

                  {previewImages.length === 1 && (
                    <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-700">
                      <Image
                        src={previewImages[0]}
                        alt={album.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  {previewImages.length === 2 && (
                    <div className="grid grid-cols-2 gap-1 h-full p-1">
                      {previewImages.map((img, idx) => (
                        <div key={idx} className="relative overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-700">
                          <Image
                            src={img}
                            alt={`${album.name} ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {previewImages.length === 3 && (
                    <div className="grid grid-cols-2 gap-1 h-full p-1">
                      <div className="relative col-span-2 overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-700">
                        <Image
                          src={previewImages[0]}
                          alt={`${album.name} 1`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      {previewImages.slice(1).map((img, idx) => (
                        <div key={idx} className="relative overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-700">
                          <Image
                            src={img}
                            alt={`${album.name} ${idx + 2}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {previewImages.length >= 4 && (
                    <div className="grid grid-cols-2 gap-1 h-full p-1">
                      {previewImages.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="relative overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-700">
                          <Image
                            src={img}
                            alt={`${album.name} ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {/* Show +N on last image if more items */}
                          {idx === 3 && artworkCount > 4 && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                              <span className="text-white text-2xl font-bold">
                                +{artworkCount - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Privacy Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {album.privacy === 'PUBLIC' ? '🌐 Public' : '🔒 Private'}
                      </span>
                    </div>
                  </div>

                  {/* Item Count Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {artworkCount} {artworkCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Album Info */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                    {album.name}
                  </h3>

                  {album.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {album.description}
                    </p>
                  )}

                  {/* Updated Date */}
                  <p className="text-xs text-gray-500 dark:text-gray-500 pt-1">
                    Updated {new Date(album.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Create New Album Card */}
        <Link href="/albums/create">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[380px] flex items-center justify-center">
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                <Palette size={32} className="text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  Create New Album
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Organize and showcase your favorite artworks in a beautiful collection
                </p>
              </div>
              <Button
                color="primary"
                size="sm"
                className="group-hover:scale-105 transition-transform"
              >
                Get Started
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}