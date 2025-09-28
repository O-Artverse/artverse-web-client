'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { Button, Input, Textarea } from '@heroui/react';
import Image from 'next/image';
import { Camera } from '@phosphor-icons/react';
import { useUpdateProfile, useUploadAvatar } from '@/hooks/mutations/user.mutation';
import { showToast } from '@/utils/showToast';
import { getUserAvatarUrl } from '@/utils/imageUtils';

export const EditProfile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    description: '',
    website: '',
    instagram: '',
    twitter: '',
    facebook: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        description: user.description || '',
        website: user.website || '',
        instagram: user.instagram || '',
        twitter: user.twitter || '',
        facebook: user.facebook || '',
      });
      setAvatarPreview(getUserAvatarUrl(user.avatar) || null);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      uploadAvatarMutation.mutate(file, {
        onSuccess: (response) => {
          if (response.avatarUrl) {
            dispatch(updateUser({ avatar: response.avatarUrl }));
            showToast({
              title: 'Avatar updated successfully',
              color: 'success'
            });
          }
        },
        onError: (error) => {
          console.error('Error uploading avatar:', error);
          showToast({
            title: 'Error uploading avatar',
            color: 'error'
          });
        }
      });
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData, {
      onSuccess: (response) => {
        dispatch(updateUser(response));
        showToast({
          title: 'Changes saved successfully',
          color: 'success'
        });
      },
      onError: (error) => {
        console.error('Error updating profile:', error);
        showToast({
          title: 'Error updating profile',
          color: 'error'
        });
      }
    });
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return user.name[0].toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="bg-content1 rounded-lg shadow-sm p-8">
      <h1 className="text-2xl font-bold mb-2 text-foreground">
        Edit profile
      </h1>
      <p className="text-default-600 mb-8">
        Keep your personal details private. Information you add here is visible to anyone who can view your profile.
      </p>

      {/* Avatar Section */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground mb-4">
          Photo
        </label>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-default-200 flex items-center justify-center">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-default-600">
                  {getInitials()}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-content1 rounded-full p-1.5 shadow-md cursor-pointer hover:bg-default-100">
              <Camera size={16} className="text-default-600" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <button className="text-sm text-default-600 hover:text-foreground">
            Change
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              First name
            </label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Your first name"
              variant="bordered"
              classNames={{
                input: "!text-foreground",
                inputWrapper: "border-default-300"
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Last name
            </label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Your last name"
              variant="bordered"
              classNames={{
                input: "!text-foreground",
                inputWrapper: "border-default-300"
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            About
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Tell your story"
            variant="bordered"
            minRows={3}
            classNames={{
              input: "!text-foreground",
              inputWrapper: "border-default-300"
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Website
          </label>
          <Input
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://"
            variant="bordered"
            classNames={{
              input: "!text-foreground",
              inputWrapper: "border-default-300"
            }}
          />
          <p className="text-xs text-default-500 mt-1">
            Add a link to drive traffic to your website
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Username
          </label>
          <Input
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Username"
            variant="bordered"
            classNames={{
              input: "!text-foreground",
              inputWrapper: "border-default-300"
            }}
          />
          <p className="text-xs text-default-500 mt-1">
            www.artverse.com/{formData.username || 'username'}
          </p>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">
            Social media links
          </h3>

          <div>
            <label className="block text-xs text-default-600 mb-1">
              Instagram
            </label>
            <Input
              value={formData.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              placeholder="@username"
              variant="bordered"
              classNames={{
                input: "!text-foreground",
                inputWrapper: "border-default-300"
              }}
            />
          </div>

          <div>
            <label className="block text-xs text-default-600 mb-1">
              Twitter
            </label>
            <Input
              value={formData.twitter}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
              placeholder="@username"
              variant="bordered"
              classNames={{
                input: "!text-foreground",
                inputWrapper: "border-default-300"
              }}
            />
          </div>

          <div>
            <label className="block text-xs text-default-600 mb-1">
              Facebook
            </label>
            <Input
              value={formData.facebook}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              placeholder="facebook.com/username"
              variant="bordered"
              classNames={{
                input: "!text-foreground",
                inputWrapper: "border-default-300"
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-default-200">
        <Button
          variant="light"
          className="text-default-600"
        >
          Reset
        </Button>
        <Button
          color="primary"
          onPress={handleSave}
          isLoading={updateProfileMutation.isPending}
        >
          Save
        </Button>
      </div>
    </div>
  );
};