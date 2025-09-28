'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, RadioGroup, Radio } from '@heroui/react';
import { useUpgradeToBusinessAccount } from '@/hooks/mutations/user.mutation';
import { useAppDispatch } from '@/store/hooks';
import { upgradeToBusinessSuccess } from '@/store/slices/authSlice';
import { showToast } from '@/utils/showToast';
import { refreshTokens } from '@/services/auth.service';
import webStorageClient from '@/utils/webStorageClient';

interface SwitchToArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwitchToArtistModal: React.FC<SwitchToArtistModalProps> = ({
  isOpen,
  onClose
}) => {
  const [businessType, setBusinessType] = useState<'ARTIST' | 'ORGANIZATION'>('ARTIST');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationDescription, setOrganizationDescription] = useState('');

  const upgradeAccount = useUpgradeToBusinessAccount();
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      const payload = {
        businessType,
        ...(businessType === 'ORGANIZATION' && {
          organizationName,
          organizationDescription
        })
      };

      if (businessType === 'ORGANIZATION' && !organizationName.trim()) {
        showToast({
          title: 'Organization name is required',
          color: 'error'
        });
        return;
      }

      const result = await upgradeAccount.mutateAsync(payload);

      // Update Redux state with the upgrade result
      dispatch(upgradeToBusinessSuccess({
        businessType,
        organization: result.organization,
        user: result.user
      }));

      // Refresh tokens to get new JWT with updated role
      try {
        const refreshToken = webStorageClient.getRefreshToken();
        if (refreshToken) {
          const newTokens = await refreshTokens(refreshToken);
          // Update stored tokens with new ones containing BUSINESS role
          webStorageClient.setToken(newTokens.accessToken);
          if (newTokens.refreshToken) {
            webStorageClient.setRefreshToken(newTokens.refreshToken);
          }
        }
      } catch (error) {
        console.error('Failed to refresh tokens after upgrade:', error);
        // If token refresh fails, show message to user to refresh page
        showToast({
          title: 'Please refresh the page to access business features',
          color: 'warning'
        });
      }

      showToast({
        title: 'Account upgraded successfully!',
        color: 'success'
      });

      onClose();
    } catch (error: any) {
      showToast({
        title: error.message || 'Failed to upgrade account',
        color: 'error'
      });
    }
  };

  const resetForm = () => {
    setBusinessType('ARTIST');
    setOrganizationName('');
    setOrganizationDescription('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-foreground">Switch to Business Account</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upgrade your account to start selling artwork and access business features
          </p>
        </ModalHeader>

        <ModalBody className="py-6">
          <div className="space-y-6">
            <RadioGroup
              label="Account Type"
              value={businessType}
              onValueChange={(value) => setBusinessType(value as 'ARTIST' | 'ORGANIZATION')}
              classNames={{
                base: "max-w-full",
                label: "text-medium font-medium"
              }}
            >
              <Radio value="ARTIST" className="w-full">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">Individual Artist</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Perfect for individual artists and creators
                  </span>
                </div>
              </Radio>
              <Radio value="ORGANIZATION" className="w-full">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">Organization/Gallery</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    For galleries, studios, and art organizations
                  </span>
                </div>
              </Radio>
            </RadioGroup>

            {businessType === 'ORGANIZATION' && (
              <div className="space-y-4 mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Organization Details</h3>
                <Input
                  label="Organization Name"
                  placeholder="Enter your organization name"
                  value={organizationName}
                  onValueChange={setOrganizationName}
                  isRequired
                  variant="bordered"
                  classNames={{
                    input: "outline-none",
                  }}
                />
                <Textarea
                  label="Description (Optional)"
                  placeholder="Tell us about your organization..."
                  value={organizationDescription}
                  onValueChange={setOrganizationDescription}
                  variant="bordered"
                  minRows={3}
                  classNames={{
                    input: "outline-none",
                  }}
                />
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Business Features Include:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Upload and sell your artwork</li>
                <li>• Create and manage galleries</li>
                <li>• Access to business dashboard</li>
                <li>• Analytics and insights</li>
                {businessType === 'ORGANIZATION' && (
                  <li>• Manage multiple artists</li>
                )}
              </ul>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={handleClose}
            disabled={upgradeAccount.isPending}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={upgradeAccount.isPending}
            disabled={upgradeAccount.isPending}
          >
            {upgradeAccount.isPending ? 'Upgrading...' : 'Upgrade Account'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};