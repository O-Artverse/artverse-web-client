'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Switch } from '@heroui/react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    newFollowers: true,
    newLikes: true,
    newComments: true,
    newMessages: true,
    artworkUploads: false,
    systemUpdates: true,
    securityAlerts: true,
    marketingUpdates: false,
    weeklyDigest: true,
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-content1 rounded-lg shadow-sm p-8">
      <h1 className="text-2xl font-bold mb-2 text-foreground">
        Notifications
      </h1>
      <p className="text-default-600 mb-8">
        Choose how you want to be notified about activity on Artverse.
      </p>

      <div className="space-y-6">
        {/* Notification Channels */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Notification Channels</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Email notifications</p>
                  <p className="text-default-600 text-sm">Receive notifications via email</p>
                </div>
                <Switch
                  isSelected={notifications.emailNotifications}
                  onValueChange={(value) => handleNotificationChange('emailNotifications', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Push notifications</p>
                  <p className="text-default-600 text-sm">Receive notifications in your browser</p>
                </div>
                <Switch
                  isSelected={notifications.pushNotifications}
                  onValueChange={(value) => handleNotificationChange('pushNotifications', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">SMS notifications</p>
                  <p className="text-default-600 text-sm">Receive notifications via text message</p>
                </div>
                <Switch
                  isSelected={notifications.smsNotifications}
                  onValueChange={(value) => handleNotificationChange('smsNotifications', value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Activity Notifications */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Activity Notifications</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">New followers</p>
                  <p className="text-default-600 text-sm">When someone follows you</p>
                </div>
                <Switch
                  isSelected={notifications.newFollowers}
                  onValueChange={(value) => handleNotificationChange('newFollowers', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Likes on your artwork</p>
                  <p className="text-default-600 text-sm">When someone likes your content</p>
                </div>
                <Switch
                  isSelected={notifications.newLikes}
                  onValueChange={(value) => handleNotificationChange('newLikes', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Comments on your artwork</p>
                  <p className="text-default-600 text-sm">When someone comments on your content</p>
                </div>
                <Switch
                  isSelected={notifications.newComments}
                  onValueChange={(value) => handleNotificationChange('newComments', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Direct messages</p>
                  <p className="text-default-600 text-sm">When you receive a new message</p>
                </div>
                <Switch
                  isSelected={notifications.newMessages}
                  onValueChange={(value) => handleNotificationChange('newMessages', value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Content Notifications */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Content Notifications</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">New artwork from following</p>
                  <p className="text-default-600 text-sm">When artists you follow upload new work</p>
                </div>
                <Switch
                  isSelected={notifications.artworkUploads}
                  onValueChange={(value) => handleNotificationChange('artworkUploads', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Weekly digest</p>
                  <p className="text-default-600 text-sm">Summary of activity from the past week</p>
                </div>
                <Switch
                  isSelected={notifications.weeklyDigest}
                  onValueChange={(value) => handleNotificationChange('weeklyDigest', value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* System Notifications */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">System Notifications</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">System updates</p>
                  <p className="text-default-600 text-sm">Important updates about Artverse</p>
                </div>
                <Switch
                  isSelected={notifications.systemUpdates}
                  onValueChange={(value) => handleNotificationChange('systemUpdates', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Security alerts</p>
                  <p className="text-default-600 text-sm">Important security notifications</p>
                </div>
                <Switch
                  isSelected={notifications.securityAlerts}
                  onValueChange={(value) => handleNotificationChange('securityAlerts', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Marketing updates</p>
                  <p className="text-default-600 text-sm">News about features and promotions</p>
                </div>
                <Switch
                  isSelected={notifications.marketingUpdates}
                  onValueChange={(value) => handleNotificationChange('marketingUpdates', value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-default-200">
          <Button color="primary">
            Save Notification Settings
          </Button>
        </div>
      </div>
    </div>
  );
};