'use client';

import { useAppSelector } from '@/store/hooks';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import {
  Palette,
  Users,
  Calendar,
  TrendUp,
  Eye,
  Heart,
  CurrencyDollar,
  Plus
} from '@phosphor-icons/react';
import Link from 'next/link';

interface ArtistStats {
  totalArtworks: number;
  totalViews: number;
  totalLikes: number;
  totalRevenue: number;
  recentArtworks: Array<{
    id: number;
    title: string;
    digitalPrice: number;
    physicalPrice: number;
    hasPhysicalVersion: boolean;
    views: number;
    likes: number;
  }>;
}

interface OrgStats {
  totalArtists: number;
  totalArtworks: number;
  activeEvents: number;
  totalRevenue: number;
  recentEvents: Array<{
    id: number;
    title: string;
    date: string;
    attendees: number;
  }>;
}

export default function BusinessDashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isArtist = user?.businessType === 'ARTIST';

  // Mock data for demonstration
  const artistStats: ArtistStats = {
    totalArtworks: 24,
    totalViews: 15420,
    totalLikes: 892,
    totalRevenue: 12500000,
    recentArtworks: [
      { id: 1, title: "Sunset Dreams", digitalPrice: 25000, physicalPrice: 850000, hasPhysicalVersion: true, views: 324, likes: 45 },
      { id: 2, title: "Urban Rhythm", digitalPrice: 35000, physicalPrice: 1200000, hasPhysicalVersion: true, views: 567, likes: 78 },
      { id: 3, title: "Nature's Call", digitalPrice: 15000, physicalPrice: 0, hasPhysicalVersion: false, views: 234, likes: 32 }
    ]
  };

  const orgStats: OrgStats = {
    totalArtists: 12,
    totalArtworks: 156,
    activeEvents: 3,
    totalRevenue: 45000000,
    recentEvents: [
      { id: 1, title: "Modern Art Exhibition", date: "2025-10-15", attendees: 125 },
      { id: 2, title: "Digital Artists Showcase", date: "2025-11-02", attendees: 89 },
      { id: 3, title: "Contemporary Art Fair", date: "2025-11-20", attendees: 0 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-blue-100">
          {isArtist
            ? "Ready to showcase your creativity to the world?"
            : "Let's manage your organization and upcoming events."
          }
        </p>
        <div className="mt-4 flex gap-3">
          {isArtist ? (
            <Link href="/business/artworks/create">
              <Button
                color="secondary"
                variant="solid"
                startContent={<Plus size={16} />}
                className="bg-white/20 hover:bg-white/30 backdrop-blur border-white/20"
              >
                Create New Artwork
              </Button>
            </Link>
          ) : (
            <Link href="/business/events/create">
              <Button
                color="secondary"
                variant="solid"
                startContent={<Plus size={16} />}
                className="bg-white/20 hover:bg-white/30 backdrop-blur border-white/20"
              >
                Create New Event
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isArtist ? (
          <>
            <Card className="bg-white dark:bg-[#1E1B26]">
              <CardBody className="flex flex-row items-center gap-4 p-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Palette size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Artworks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isArtist ? artistStats.totalArtworks : orgStats.totalArtworks}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white dark:bg-[#1E1B26]">
              <CardBody className="flex flex-row items-center gap-4 p-6">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <Eye size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isArtist ? artistStats.totalViews.toLocaleString() : '0'}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white dark:bg-[#1E1B26]">
              <CardBody className="flex flex-row items-center gap-4 p-6">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <Heart size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isArtist ? artistStats.totalLikes : 0}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white dark:bg-[#1E1B26]">
              <CardBody className="flex flex-row items-center gap-4 p-6">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <CurrencyDollar size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(isArtist ? artistStats.totalRevenue : orgStats.totalRevenue).toLocaleString('vi-VN')} VND
                  </p>
                </div>
              </CardBody>
            </Card>
          </>
        ) : (
          <>
            <Card className="bg-white dark:bg-[#1E1B26]">
              <CardBody className="flex flex-row items-center gap-4 p-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Users size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Artists</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isArtist ? 0 : orgStats.totalArtists}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white dark:bg-[#1E1B26]">
              <CardBody className="flex flex-row items-center gap-4 p-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Palette size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Artworks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isArtist ? artistStats.totalArtworks : orgStats.totalArtworks}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white dark:bg-[#1E1B26]">
              <CardBody className="flex flex-row items-center gap-4 p-6">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <Calendar size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Events</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isArtist ? 0 : orgStats.activeEvents}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white dark:bg-[#1E1B26]">
              <CardBody className="flex flex-row items-center gap-4 p-6">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <TrendUp size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(isArtist ? artistStats.totalRevenue : orgStats.totalRevenue).toLocaleString('vi-VN')} VND
                  </p>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isArtist ? 'Recent Artworks' : 'Upcoming Events'}
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {isArtist ? (
                artistStats.recentArtworks.map((artwork) => (
                  <div key={artwork.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {artwork.title}
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <span className="text-blue-600 dark:text-blue-400">💻</span>
                            {artwork.digitalPrice.toLocaleString('vi-VN')} VND
                          </span>
                          {artwork.hasPhysicalVersion && (
                            <span className="flex items-center gap-1">
                              <span className="text-green-600 dark:text-green-400">📦</span>
                              {artwork.physicalPrice.toLocaleString('vi-VN')} VND
                            </span>
                          )}
                        </div>
                        <div className="mt-1">
                          {artwork.views} views • {artwork.likes} likes
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                orgStats.recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.date} • {event.attendees} registered
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 gap-3">
              {isArtist ? (
                <>
                  <Link href="/business/artworks/create">
                    <Button
                      variant="flat"
                      color="primary"
                      className="w-full justify-start"
                      startContent={<Plus size={16} />}
                    >
                      Upload New Artwork
                    </Button>
                  </Link>
                  <Link href="/business/artworks">
                    <Button
                      variant="flat"
                      color="default"
                      className="w-full justify-start"
                      startContent={<Palette size={16} />}
                    >
                      Manage Artworks
                    </Button>
                  </Link>
                  <Link href="/business/organizations">
                    <Button
                      variant="flat"
                      color="default"
                      className="w-full justify-start"
                      startContent={<Users size={16} />}
                    >
                      Join Organization
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/business/events/create">
                    <Button
                      variant="flat"
                      color="primary"
                      className="w-full justify-start"
                      startContent={<Plus size={16} />}
                    >
                      Create New Event
                    </Button>
                  </Link>
                  <Link href="/business/artists">
                    <Button
                      variant="flat"
                      color="default"
                      className="w-full justify-start"
                      startContent={<Users size={16} />}
                    >
                      Invite Artists
                    </Button>
                  </Link>
                  <Link href="/business/artworks">
                    <Button
                      variant="flat"
                      color="default"
                      className="w-full justify-start"
                      startContent={<Palette size={16} />}
                    >
                      View Organization Artworks
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}