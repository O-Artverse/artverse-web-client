'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Switch } from '@heroui/react';

export const PrivacyAndData = () => {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    searchEngineIndexing: false,
    activityTracking: true,
    dataCollection: false,
    thirdPartySharing: false,
    marketingEmails: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-content1 rounded-lg shadow-sm p-8">
      <h1 className="text-2xl font-bold mb-2 text-foreground">
        Privacy and data
      </h1>
      <p className="text-default-600 mb-8">
        Control how your data is used and who can see your information.
      </p>

      <div className="space-y-6">
        {/* Profile Visibility */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Profile Visibility</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Public profile</p>
                  <p className="text-default-600 text-sm">Make your profile visible to everyone</p>
                </div>
                <Switch
                  isSelected={settings.profileVisibility}
                  onValueChange={(value) => handleSettingChange('profileVisibility', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Search engine indexing</p>
                  <p className="text-default-600 text-sm">Allow search engines to index your profile</p>
                </div>
                <Switch
                  isSelected={settings.searchEngineIndexing}
                  onValueChange={(value) => handleSettingChange('searchEngineIndexing', value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Data Collection */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Data Collection</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Activity tracking</p>
                  <p className="text-default-600 text-sm">Track your activity to improve recommendations</p>
                </div>
                <Switch
                  isSelected={settings.activityTracking}
                  onValueChange={(value) => handleSettingChange('activityTracking', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Analytics data collection</p>
                  <p className="text-default-600 text-sm">Help us improve by sharing anonymous usage data</p>
                </div>
                <Switch
                  isSelected={settings.dataCollection}
                  onValueChange={(value) => handleSettingChange('dataCollection', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Third-party data sharing</p>
                  <p className="text-default-600 text-sm">Share data with trusted partners for better experience</p>
                </div>
                <Switch
                  isSelected={settings.thirdPartySharing}
                  onValueChange={(value) => handleSettingChange('thirdPartySharing', value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Communication Preferences */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Communication</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Marketing emails</p>
                  <p className="text-default-600 text-sm">Receive emails about new features and promotions</p>
                </div>
                <Switch
                  isSelected={settings.marketingEmails}
                  onValueChange={(value) => handleSettingChange('marketingEmails', value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Data Export</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Export personal data</p>
                  <p className="text-default-600 text-sm">Download a copy of your personal data</p>
                </div>
                <Button variant="bordered" size="sm">
                  Export Data
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Data portability</p>
                  <p className="text-default-600 text-sm">Transfer your data to another service</p>
                </div>
                <Button variant="bordered" size="sm">
                  Transfer Data
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-default-200">
          <Button color="primary">
            Save Privacy Settings
          </Button>
        </div>
      </div>
    </div>
  );
};