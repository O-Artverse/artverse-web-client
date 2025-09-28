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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
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
  Users,
  Heart,
  Star,
  EnvelopeSimple,
  Phone,
  Globe,
  BookmarkSimple,
  Eye,
  Palette,
  Camera,
  Cube,
  Image as ImageIcon,
  Play,
  ArrowRight,
  DotsThree,
  Share,
  Trash,
  Download,
  X,
  GridFour,
  List as ListIcon
} from '@phosphor-icons/react';
import Image from 'next/image';
import { getUserAvatarUrl } from '@/utils/imageUtils';
import Link from 'next/link';
import { useState } from 'react';
import MainLayout from '@/components/core/layouts/MainLayout';

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
                    Premium Member
                  </Chip>
                  {user.city && (
                    <span className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm">
                      <MapPin size={16} />
                      {user.city}
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm">
                    <Calendar size={16} />
                    Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
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
                <Button
                  variant="light"
                  size="lg"
                  startContent={<DotsThree size={18} />}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  More Options
                </Button>
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

          <Tab key="activity" title="Activity">
            <div className="mt-6">
              <UserActivity user={user} />
            </div>
          </Tab>

          <Tab key="collections" title="Collections">
            <div className="mt-6">
              <UserCollections />
            </div>
          </Tab>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// User Overview Component
function UserOverview({ user }: { user: any }) {
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
                <a href={user.website} className="text-blue-600 dark:text-blue-400 hover:underline">
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
              <Heart size={16} className="text-red-500" />
              <span className="text-gray-700 dark:text-gray-300">Liked Artworks</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">24</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookmarkSimple size={16} className="text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-300">Saved Items</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">Following</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">8</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye size={16} className="text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Profile Views</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">156</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// User Activity Component
function UserActivity({ user }: { user: any }) {
  const mockActivities = [
    {
      id: 1,
      type: 'like',
      content: 'Liked artwork "Sunset Dreams"',
      artist: 'John Artist',
      time: '2 hours ago',
      icon: '❤️',
      color: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      artwork: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100'
    },
    {
      id: 2,
      type: 'save',
      content: 'Saved artwork "Urban Rhythm" to Favorites',
      artist: 'Jane Designer',
      time: '5 hours ago',
      icon: '🔖',
      color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      artwork: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100'
    },
    {
      id: 3,
      type: 'follow',
      content: 'Started following Modern Art Gallery',
      artist: 'Modern Art Gallery',
      time: '1 day ago',
      icon: '👥',
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      artwork: null
    },
    {
      id: 4,
      type: 'comment',
      content: 'Commented on "Nature\'s Call"',
      artist: 'Nature Lover',
      time: '2 days ago',
      icon: '💬',
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      artwork: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100'
    },
    {
      id: 5,
      type: 'like',
      content: 'Liked artwork "Digital Dreams"',
      artist: 'Sarah Smith',
      time: '3 days ago',
      icon: '❤️',
      color: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      artwork: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-[#1E1B26] [box-shadow:0_1px_4px_rgba(0,0,0,0.2)]">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <Button variant="light" size="sm" color="primary">
            View All
          </Button>
        </CardHeader>
        <CardBody className="space-y-3">
          {mockActivities.map((activity, index) => (
            <div key={activity.id} className="group">
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activity.color}`}>
                  <span className="text-lg">{activity.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium mb-1">
                        {activity.content}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        by {activity.artist}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {activity.time}
                      </p>
                    </div>

                    {/* Artwork preview */}
                    {activity.artwork && (
                      <div className="ml-4 flex-shrink-0">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform">
                          <Image
                            src={activity.artwork}
                            alt="Artwork preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              {index < mockActivities.length - 1 && (
                <div className="ml-16 border-b border-gray-100 dark:border-gray-800"></div>
              )}
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-200 dark:border-red-800">
          <CardBody className="text-center p-4">
            <div className="text-2xl mb-2">❤️</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">127</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Likes</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-200 dark:border-yellow-800">
          <CardBody className="text-center p-4">
            <div className="text-2xl mb-2">🔖</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">43</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Items Saved</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800">
          <CardBody className="text-center p-4">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">89</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Comments</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800">
          <CardBody className="text-center p-4">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">25</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

// User Collections Component
function UserCollections() {
  const { isOpen: isGalleryOpen, onOpen: onGalleryOpen, onClose: onGalleryClose } = useDisclosure();
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const mockCollections = [
    {
      id: 1,
      name: 'Nghệ thuật',
      nameEn: 'Fine Art',
      count: 15,
      period: '6 tháng',
      description: 'Bộ sưu tập nghệ thuật cổ điển và hiện đại',
      mainImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      previews: [
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200'
      ]
    },
    {
      id: 2,
      name: 'Hình nền',
      nameEn: 'Wallpapers',
      count: 1,
      period: '4 tháng',
      description: 'Bộ sưu tập hình nền đẹp cho desktop',
      mainImage: 'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=400',
      previews: []
    },
    {
      id: 3,
      name: 'Digital Art',
      nameEn: 'Digital Creations',
      count: 8,
      period: '2 tháng',
      description: 'Nghệ thuật số và illustration hiện đại',
      mainImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
      previews: [
        'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=200',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200'
      ]
    },
    {
      id: 4,
      name: 'Photography',
      nameEn: 'Photo Collection',
      count: 23,
      period: '8 tháng',
      description: 'Những bức ảnh đẹp từ nhiếp ảnh gia tài năng',
      mainImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      previews: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200'
      ]
    },
  ];

  return (
    <div className="space-y-8">
      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCollections.map((collection) => (
          <Card
            key={collection.id}
            className="bg-white dark:bg-[#1E1B26] [box-shadow:0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer border-0"
            isPressable
          >
            <CardBody className="p-0">
              {/* Main Image Area */}
              <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
                {/* Main artwork - large */}
                <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-700">
                  <Image
                    src={collection.mainImage}
                    alt={collection.name}
                    fill
                    className="object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Small preview thumbnails in corner */}
                {collection.previews.length > 0 && (
                  <div className="absolute top-3 right-3 flex gap-1">
                    {collection.previews.slice(0, 2).map((preview, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 relative overflow-hidden rounded-lg border-2 border-white/80 backdrop-blur-sm shadow-lg group-hover:scale-105 transition-transform duration-300"
                      >
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Collection count badge */}
                <div className="absolute bottom-3 right-3">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      {collection.count} Ghim
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Info */}
              <div className="p-5 space-y-3">
                {/* Title and period */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {collection.period}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                  {collection.description}
                </p>

                {/* Action row */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    size="sm"
                    variant="light"
                    color="primary"
                    className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onPress={() => {
                      setSelectedCollection(collection);
                      onGalleryOpen();
                    }}
                  >
                    Xem tất cả
                  </Button>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <DotsThree size={18} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Collection actions">
                      <DropdownItem
                        key="share"
                        startContent={<Share size={16} />}
                        onPress={() => {
                          navigator.share && navigator.share({
                            title: collection.name,
                            text: collection.description,
                            url: window.location.href + '#collection-' + collection.id
                          });
                        }}
                      >
                        Chia sẻ
                      </DropdownItem>
                      {/* <DropdownItem
                        key="download"
                        startContent={<Download size={16} />}
                        onPress={() => {
                          // Implement download functionality
                          console.log('Download collection:', collection.name);
                        }}
                      >
                        Tải xuống
                      </DropdownItem> */}
                      <DropdownItem
                        key="edit"
                        startContent={<PencilSimple size={16} />}
                        onPress={() => {
                          // Implement edit functionality
                          console.log('Edit collection:', collection.name);
                        }}
                      >
                        Chỉnh sửa
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<Trash size={16} />}
                        onPress={() => {
                          // Implement delete functionality
                          console.log('Delete collection:', collection.name);
                        }}
                      >
                        Xóa bộ sưu tập
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}

        {/* Create New Collection */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 transition-all duration-300 cursor-pointer group min-h-[300px]">
          <CardBody className="p-6 flex flex-col items-center justify-center text-center space-y-4 h-full">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              <ImageIcon size={28} className="text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Tạo bộ sưu tập mới
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Tổ chức những tác phẩm yêu thích của bạn
              </p>
            </div>
            <Button
              color="primary"
              variant="flat"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Bắt đầu
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Gallery Modal */}
      <Modal
        isOpen={isGalleryOpen}
        onClose={onGalleryClose}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "bg-white dark:bg-[#1E1B26]",
          header: "border-b border-gray-200 dark:border-gray-700",
          body: "py-6",
          footer: "border-t border-gray-200 dark:border-gray-700"
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCollection?.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCollection?.count} tác phẩm • {selectedCollection?.period}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="text-gray-600 dark:text-gray-400"
              >
                {viewMode === 'grid' ? <ListIcon size={18} /> : <GridFour size={18} />}
              </Button>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={onGalleryClose}
                className="text-gray-600 dark:text-gray-400"
              >
                <X size={18} />
              </Button>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedCollection && (
              <div className="space-y-6">
                {/* Collection Info */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedCollection.description}
                  </p>
                </div>

                {/* Mock Gallery Content */}
                <div className={`${
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                    : 'space-y-4'
                }`}>
                  {/* Main image */}
                  <div className={`${
                    viewMode === 'grid'
                      ? 'aspect-square relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800'
                      : 'flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg'
                  }`}>
                    {viewMode === 'grid' ? (
                      <>
                        <Image
                          src={selectedCollection.mainImage}
                          alt="Artwork 1"
                          fill
                          className="object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                          <Button
                            isIconOnly
                            variant="flat"
                            className="bg-white/90 text-gray-900"
                          >
                            <Eye size={20} />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <Image
                            src={selectedCollection.mainImage}
                            alt="Artwork 1"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Abstract Masterpiece</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Saved 2 days ago</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-gray-600 dark:text-gray-400"
                          >
                            <Heart size={16} />
                          </Button>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-gray-600 dark:text-gray-400"
                          >
                            <Share size={16} />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Preview images */}
                  {selectedCollection.previews.map((preview: string, index: number) => (
                    <div key={index} className={`${
                      viewMode === 'grid'
                        ? 'aspect-square relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800'
                        : 'flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg'
                    }`}>
                      {viewMode === 'grid' ? (
                        <>
                          <Image
                            src={preview}
                            alt={`Artwork ${index + 2}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                            <Button
                              isIconOnly
                              variant="flat"
                              className="bg-white/90 text-gray-900"
                            >
                              <Eye size={20} />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            <Image
                              src={preview}
                              alt={`Artwork ${index + 2}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{index === 0 ? 'Landscape Beauty' : 'Modern Expression'}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Saved {index + 3} days ago</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              className="text-gray-600 dark:text-gray-400"
                            >
                              <Heart size={16} />
                            </Button>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              className="text-gray-600 dark:text-gray-400"
                            >
                              <Share size={16} />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {/* Additional mock items to show gallery content */}
                  {Array.from({ length: selectedCollection?.count - 3 || 0 }).map((_, index) => (
                    <div key={`mock-${index}`} className={`${
                      viewMode === 'grid'
                        ? 'aspect-square relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700'
                        : 'flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg'
                    }`}>
                      {viewMode === 'grid' ? (
                        <div className="flex items-center justify-center w-full h-full">
                          <Palette size={24} className="text-gray-400" />
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                            <Palette size={20} className="text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Artwork {index + 4}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Saved {index + 5} days ago</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              className="text-gray-600 dark:text-gray-400"
                            >
                              <Heart size={16} />
                            </Button>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              className="text-gray-600 dark:text-gray-400"
                            >
                              <Share size={16} />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={onGalleryClose}
              className="text-gray-600 dark:text-gray-400"
            >
              Đóng
            </Button>
            <Button
              color="primary"
              startContent={<Share size={16} />}
              onPress={() => {
                navigator.share && navigator.share({
                  title: selectedCollection?.name,
                  text: selectedCollection?.description,
                  url: window.location.href + '#collection-' + selectedCollection?.id
                });
              }}
            >
              Chia sẻ bộ sưu tập
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}