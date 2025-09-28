'use client';

import React from 'react';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { useAppSelector } from '@/store/hooks';

export const AccountManagement = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="bg-content1 rounded-lg shadow-sm p-8">
      <h1 className="text-2xl font-bold mb-2 text-foreground">
        Account management
      </h1>
      <p className="text-default-600 mb-8">
        Manage your account settings and preferences.
      </p>

      <div className="space-y-6">
        {/* Account Status */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Account Status</h3>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">{user?.email}</p>
                <p className="text-default-600 text-sm">
                  Account type: {user?.role === 'BUSINESS' ? `Business (${user.businessType})` : 'Personal'}
                </p>
                <p className="text-default-600 text-sm">
                  Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-success text-sm">Active</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Email Settings</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Primary email</p>
                  <p className="text-default-600 text-sm">{user?.email}</p>
                </div>
                <Button variant="light" size="sm">
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Email verification</p>
                  <p className="text-success text-sm">Verified ✓</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Account Actions</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Download your data</p>
                  <p className="text-default-600 text-sm">Export all your account data</p>
                </div>
                <Button variant="bordered" size="sm">
                  Download
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Deactivate account</p>
                  <p className="text-default-600 text-sm">Temporarily disable your account</p>
                </div>
                <Button variant="bordered" color="warning" size="sm">
                  Deactivate
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Delete account</p>
                  <p className="text-default-600 text-sm">Permanently delete your account and all data</p>
                </div>
                <Button variant="bordered" color="danger" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};