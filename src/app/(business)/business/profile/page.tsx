'use client';

import { useAppSelector } from '@/store/hooks';
import { Card, CardBody, CardHeader, Button, Avatar, Chip, Tabs, Tab } from '@heroui/react';
import {
  PencilSimple,
  MapPin,
  Calendar,
  Users,
  Palette,
  Buildings,
  Globe,
  Phone,
  EnvelopeSimple,
  Trophy,
  Heart,
  Eye,
  CurrencyDollar
} from '@phosphor-icons/react';
import { getUserAvatarUrl } from '@/utils/imageUtils';
import Link from 'next/link';
import { useState } from 'react';

export default function BusinessProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedTab, setSelectedTab] = useState('overview');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Please sign in</h2>
          <p className="text-gray-600 dark:text-gray-400">You need to be signed in to view your profile</p>
        </div>
      </div>
    );
  }

  // Redirect regular users to user profile
  if (!user.businessType) {
    window.location.href = '/profile';
    return null;
  }

  const isArtist = user.businessType === 'ARTIST';
  const isOrganization = user.businessType === 'ORGANIZATION';

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className={`bg-gradient-to-r ${
        isArtist
          ? 'from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700'
          : 'from-blue-500 to-indigo-500 dark:from-blue-700 dark:to-indigo-700'
      } rounded-xl p-8 text-white relative overflow-hidden shadow-lg`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar
              src={getUserAvatarUrl(user.avatarPath) || undefined}
              name={`${user.firstName} ${user.lastName}`}
              className="w-24 h-24 text-large border-4 border-white/20"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <Chip
                  color={isArtist ? 'secondary' : 'primary'}
                  variant="flat"
                  className="bg-white/20 text-white border-white/30"
                >
                  {isArtist ? '🎨 Artist' : '🏢 Organization'}
                </Chip>
                {user.city && (
                  <span className="flex items-center gap-1 text-sm opacity-90">
                    <MapPin size={16} />
                    {user.city}
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm opacity-90">
                  <Calendar size={16} />
                  Joined {new Date(user.createdAt).getFullYear()}
                </span>
              </div>
              {user.bio && (
                <p className="text-white/90 max-w-2xl">{user.bio}</p>
              )}
            </div>
            <Link href="/settings?active=edit-profile">
              <Button
                color="secondary"
                variant="solid"
                startContent={<PencilSimple size={16} />}
                className="bg-white/20 hover:bg-white/30 backdrop-blur border-white/30"
              >
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        className="w-full"
        classNames={{
          tabList: "bg-white dark:bg-[#1E1B26] rounded-lg p-1 shadow-md",
          tab: "data-[selected=true]:bg-blue-500 data-[selected=true]:text-white",
        }}
      >
        <Tab key="overview" title="Overview">
          <div className="mt-6">
            {isArtist ? <ArtistOverview user={user} /> : <OrganizationOverview user={user} />}
          </div>
        </Tab>

        <Tab key="portfolio" title={isArtist ? "Portfolio" : "Gallery"}>
          <div className="mt-6">
            {isArtist ? <ArtistPortfolio /> : <OrganizationGallery />}
          </div>
        </Tab>

        <Tab key="analytics" title="Analytics">
          <div className="mt-6">
            <BusinessAnalytics userType={isArtist ? 'artist' : 'organization'} />
          </div>
        </Tab>

        {isOrganization && (
          <Tab key="members" title="Members">
            <div className="mt-6">
              <OrganizationMembers />
            </div>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}

// Artist Overview Component
function ArtistOverview({ user }: { user: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Artist Info */}
      <Card className="lg:col-span-2 bg-white dark:bg-[#1E1B26] border-gray-200 dark:border-gray-700/30">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Artist Profile</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.email && (
              <div className="flex items-center gap-3">
                <EnvelopeSimple size={20} className="text-gray-400 dark:text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Palette size={20} className="text-gray-400 dark:text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Digital Artist</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-400 dark:text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{user.phone}</span>
              </div>
            )}
          </div>
          {user.bio && (
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Artist Statement</h4>
              <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Artist Stats */}
      <Card className="bg-white dark:bg-[#1E1B26] border-gray-200 dark:border-gray-700/30">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Artist Stats</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Palette size={16} className="text-purple-500" />
              <span className="text-gray-700 dark:text-gray-300">Artworks</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">24</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye size={16} className="text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Total Views</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">15.4K</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart size={16} className="text-red-500" />
              <span className="text-gray-700 dark:text-gray-300">Total Likes</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">892</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CurrencyDollar size={16} className="text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-300">Revenue</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">$12.5K</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Organization Overview Component
function OrganizationOverview({ user }: { user: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Organization Info */}
      <Card className="lg:col-span-2 bg-white dark:bg-[#1E1B26] border-gray-200 dark:border-gray-700/30">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Organization Profile</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.email && (
              <div className="flex items-center gap-3">
                <EnvelopeSimple size={20} className="text-gray-400 dark:text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Buildings size={20} className="text-gray-400 dark:text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Art Organization</span>
            </div>
            {user.website && (
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-gray-400 dark:text-gray-500" />
                <a href={user.website} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {user.website}
                </a>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-400 dark:text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{user.phone}</span>
              </div>
            )}
          </div>
          {user.bio && (
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-white">About Organization</h4>
              <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Organization Stats */}
      <Card className="bg-white dark:bg-[#1E1B26] border-gray-200 dark:border-gray-700/30">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Organization Stats</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">Artists</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Palette size={16} className="text-purple-500" />
              <span className="text-gray-700 dark:text-gray-300">Artworks</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">156</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Events</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">3</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CurrencyDollar size={16} className="text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-300">Revenue</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">$45K</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Artist Portfolio Component
function ArtistPortfolio() {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-[#1E1B26] border-gray-200 dark:border-gray-700/30">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Portfolio</h3>
          <Link href="/business/artworks">
            <Button color="primary" size="sm">
              Manage Portfolio
            </Button>
          </Link>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Drafts</div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">$12.5K</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Sales</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Organization Gallery Component
function OrganizationGallery() {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-[#1E1B26] border-gray-200 dark:border-gray-700/30">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Organization Gallery</h3>
          <Link href="/business/artworks">
            <Button color="primary" size="sm">
              View All Artworks
            </Button>
          </Link>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">156</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Artworks</div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Artists</div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Events</div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">$45K</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Business Analytics Component
function BusinessAnalytics({ userType }: { userType: 'artist' | 'organization' }) {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-[#1E1B26] border-gray-200 dark:border-gray-700/30">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {userType === 'artist' ? 'Artist Analytics' : 'Organization Analytics'}
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Detailed analytics and insights for your {userType === 'artist' ? 'artwork performance' : 'organization activities'}.
          </p>
          <Link href="/business/analytics">
            <Button color="primary">View Detailed Analytics</Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}

// Organization Members Component
function OrganizationMembers() {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-[#1E1B26] border-gray-200 dark:border-gray-700/30">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Organization Members</h3>
          <Link href="/business/artists">
            <Button color="primary" size="sm">
              Manage Members
            </Button>
          </Link>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Total Members</span>
              <span className="font-semibold text-gray-900 dark:text-white">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Active Members</span>
              <span className="font-semibold text-gray-900 dark:text-white">10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Pending Invites</span>
              <span className="font-semibold text-gray-900 dark:text-white">2</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}