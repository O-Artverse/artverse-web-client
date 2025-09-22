'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import { useAppSelector } from '@/store/hooks';
import { useGetBusinessDashboard } from '@/hooks/mutations/user.mutation';
import { showToast } from '@/utils/showToast';

export default function BusinessPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const getDashboard = useGetBusinessDashboard();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard.mutateAsync();
        setDashboardData(data);
      } catch (error: any) {
        showToast({
          title: error.message || 'Failed to load dashboard',
          color: 'error'
        });
      }
    };

    fetchDashboard();
  }, []);

  const getBusinessTypeDisplay = () => {
    if (user?.businessType === 'ARTIST') return 'Artist Account';
    if (user?.businessType === 'ORGANIZATION') return 'Organization Account';
    return 'Business Account';
  };

  if (getDashboard.isPending) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Business Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, {user?.username}!
            </p>
          </div>
          <Chip
            color="primary"
            variant="flat"
            className="text-sm"
          >
            {getBusinessTypeDisplay()}
          </Chip>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-gray-600">Total Artworks</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">$0</div>
            <div className="text-sm text-gray-600">Total Sales</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Profile Views</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Followers</div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Quick Actions</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Button
              color="primary"
              size="lg"
              className="w-full"
              startContent={<span>📸</span>}
            >
              Upload New Artwork
            </Button>
            <Button
              color="default"
              variant="bordered"
              size="lg"
              className="w-full"
              startContent={<span>📁</span>}
            >
              Create Album
            </Button>
            <Button
              color="default"
              variant="bordered"
              size="lg"
              className="w-full"
              startContent={<span>👤</span>}
            >
              Edit Profile
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Account Information</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Account Type:</span>
              <span className="font-medium">{getBusinessTypeDisplay()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Username:</span>
              <span className="font-medium">@{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            {user?.ownedOrganizations && user.ownedOrganizations.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Organization:</span>
                <span className="font-medium">{user.ownedOrganizations[0].name}</span>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Features Available */}
      {dashboardData && (
        <Card className="mt-8">
          <CardHeader>
            <h3 className="text-xl font-semibold">Available Features</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardData.features?.map((feature: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}