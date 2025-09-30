'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip
} from '@heroui/react';
import {
  ArrowLeft,
  Upload,
  Plus,
  X
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { useArtworkCategories, useArtwork } from '@/hooks/queries/artwork.query';
import { useUpdateArtwork } from '@/hooks/mutations/artwork.mutation';
import { toast } from 'react-hot-toast';
import { useAppSelector } from '@/store/hooks';
import axiosClient from '@/configs/axios-client';
import { getArtworkImageUrl } from '@/utils/imageUtils';

export default function EditArtworkPage() {
  const router = useRouter();
  const params = useParams();
  const artworkId = params.id as string;

  const { user } = useAppSelector((state) => state.auth);
  const isOrganization = user?.businessType === 'ORGANIZATION';
  const isArtist = user?.businessType === 'ARTIST';
  const ownedOrgId = user?.ownedOrganizations?.[0]?.id;

  // Get all organizations where user is member (for artists)
  const [userOrganizations, setUserOrganizations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    medium: '',
    dimensions: '',
    year: new Date().getFullYear(),
    price: '',
    tags: [] as string[],
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
    organizationId: ''
  });
  const [newTag, setNewTag] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch artwork data
  const { data: artwork, isLoading: artworkLoading } = useArtwork(artworkId);

  // Fetch categories from API
  const { data: categories, isLoading: categoriesLoading } = useArtworkCategories();

  // Update artwork mutation
  const updateMutation = useUpdateArtwork();

  // Load artwork data into form
  useEffect(() => {
    if (artwork) {
      setFormData({
        title: artwork.title,
        description: artwork.description || '',
        categoryId: artwork.categoryId,
        medium: artwork.medium || '',
        dimensions: artwork.dimensions || '',
        year: artwork.year || 0,
        price: artwork.price ? String(artwork.price) : '',
        tags: artwork.tags || [],
        status: artwork.status as 'DRAFT' | 'PUBLISHED',
        organizationId: artwork.organizationId || ''
      });
      setImagePreview(getArtworkImageUrl(artwork.imageUrl) || '');
    }
  }, [artwork]);

  // Fetch organizations for artists
  React.useEffect(() => {
    if (isArtist) {
      axiosClient.get('/organizations/my-organizations')
        .then(res => {
          setUserOrganizations(res.data || []);
        })
        .catch(err => {
          console.error('Failed to fetch organizations:', err);
        });
    }
  }, [isArtist]);

  const mediums = [
    'Oil on Canvas', 'Acrylic on Canvas', 'Watercolor', 'Digital Art',
    'Photography', 'Charcoal', 'Pencil', 'Mixed Media', 'Sculpture', 'Print'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const compressImage = (file: File, maxSizeMB = 5): Promise<{ file: File; dataUrl: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions to keep under maxSizeMB
          const maxDimension = 2000; // Max width or height
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Start with high quality and reduce if needed
          let quality = 0.9;
          const compress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to compress image'));
                  return;
                }

                const sizeInMB = blob.size / (1024 * 1024);
                if (sizeInMB > maxSizeMB && quality > 0.1) {
                  quality -= 0.1;
                  compress();
                } else {
                  const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  const dataUrl = canvas.toDataURL('image/jpeg', quality);
                  resolve({ file: compressedFile, dataUrl });
                }
              },
              'image/jpeg',
              quality
            );
          };
          compress();
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        toast.loading('Compressing image...');
        const { file: compressedFile, dataUrl } = await compressImage(file);
        setSelectedFile(compressedFile);
        setImagePreview(dataUrl);
        toast.dismiss();
        toast.success(
          `Image compressed from ${(file.size / (1024 * 1024)).toFixed(2)}MB to ${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB`
        );
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to compress image');
        console.error(error);
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post('/artworks/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!formData.title || !formData.categoryId) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setIsUploading(true);

      let imageUrl = artwork?.imageUrl;
      let width = artwork?.width;
      let height = artwork?.height;

      // Upload new image if selected
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        imageUrl = uploadedUrl;

        // Get new image dimensions
        const img = document.createElement('img');
        await new Promise<void>((resolve) => {
          img.onload = () => {
            width = img.naturalWidth;
            height = img.naturalHeight;
            resolve();
          };
          img.src = imagePreview || '';
        });
      }

      const artworkData = {
        title: formData.title,
        description: formData.description || undefined,
        imageUrl: imageUrl!,
        width: width!,
        height: height!,
        categoryId: formData.categoryId,
        medium: formData.medium || undefined,
        dimensions: formData.dimensions || undefined,
        year: formData.year,
        price: formData.price ? Number(formData.price) : undefined,
        tags: formData.tags,
        status: isDraft ? ('DRAFT' as const) : ('PUBLISHED' as const),
        ...(formData.organizationId ? { organizationId: formData.organizationId } : {})
      };

      await updateMutation.mutateAsync({ id: artworkId, data: artworkData });
      toast.success(isDraft ? 'Artwork saved as draft' : 'Artwork updated successfully');
      router.push('/business/artworks');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update artwork');
    } finally {
      setIsUploading(false);
    }
  };

  if (artworkLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Artwork not found</h2>
          <Link href="/business/artworks">
            <Button color="primary">Back to Artworks</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check permissions
  const canEdit = artwork.creatorId === user?.id ||
    (isOrganization && artwork.organizationId === ownedOrgId);

  if (!canEdit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            You don't have permission to edit this artwork
          </h2>
          <Link href="/business/artworks">
            <Button color="primary">Back to Artworks</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/business/artworks">
            <Button
              isIconOnly
              variant="light"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Artwork
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your artwork details
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Upload */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h3 className="text-lg font-semibold">Artwork Image</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Current/Preview Image */}
            {imagePreview && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                  {selectedFile ? 'New Image:' : 'Current Image:'}
                </h4>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary dark:hover:border-primary-400 transition-colors bg-gray-50/50 dark:bg-gray-800/20">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload size={32} className="text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to upload new image
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </label>
            </div>
          </CardBody>
        </Card>

        {/* Artwork Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold">Artwork Details</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Title"
                placeholder="Enter artwork title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                isRequired
              />
              <Select
                label="Category"
                placeholder="Select category"
                selectedKeys={formData.categoryId ? [formData.categoryId] : []}
                onSelectionChange={(keys) => handleInputChange('categoryId', Array.from(keys)[0])}
                isRequired
                isLoading={categoriesLoading}
              >
                {(categories || []).map(category => (
                  <SelectItem key={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Organization Selector for Artists */}
            {isArtist && userOrganizations.length > 0 && (
              <Select
                label="Post to Organization (Optional)"
                placeholder="Select organization or leave empty for personal"
                selectedKeys={formData.organizationId ? [formData.organizationId] : []}
                onSelectionChange={(keys) => handleInputChange('organizationId', Array.from(keys)[0] || '')}
                description="Choose an organization to post this artwork on their behalf"
              >
                {[{ id: '', name: 'Personal Artwork' }, ...userOrganizations].map(org => (
                  <SelectItem key={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </Select>
            )}

            {/* Organization Info for Organization Users */}
            {isOrganization && ownedOrgId && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  ℹ️ This artwork belongs to your organization: <strong>{user?.ownedOrganizations?.[0]?.name}</strong>
                </p>
              </div>
            )}

            <Textarea
              label="Description"
              placeholder="Describe your artwork..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              minRows={3}
            />

            {/* Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Medium"
                placeholder="Select medium"
                selectedKeys={formData.medium ? [formData.medium] : []}
                onSelectionChange={(keys) => handleInputChange('medium', Array.from(keys)[0])}
              >
                {mediums.map(medium => (
                  <SelectItem key={medium}>
                    {medium}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Dimensions"
                placeholder="e.g., 60x40 cm"
                value={formData.dimensions}
                onChange={(e) => handleInputChange('dimensions', e.target.value)}
              />
              <Input
                label="Year"
                type="number"
                value={formData.year.toString()}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
              />
            </div>

            {/* Pricing */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-blue-50/30 dark:bg-blue-900/10">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Pricing (Optional)
              </h4>
              <Input
                label="Price (USD)"
                placeholder="0.00"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                startContent={<span className="text-gray-500 dark:text-gray-400">$</span>}
                description="Leave blank if artwork is not for sale"
              />
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1"
                />
                <Button
                  onPress={addTag}
                  color="primary"
                  variant="flat"
                  startContent={<Plus size={16} />}
                >
                  Add
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      onClose={() => removeTag(tag)}
                      variant="flat"
                      color="primary"
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="light"
                onPress={() => router.push('/business/artworks')}
                className="text-gray-600 dark:text-gray-400"
                isDisabled={updateMutation.isPending || isUploading}
              >
                Cancel
              </Button>
              <Button
                variant="flat"
                onPress={() => handleSubmit(true)}
                isLoading={updateMutation.isPending || isUploading}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Save as Draft
              </Button>
              <Button
                color="primary"
                onPress={() => handleSubmit(false)}
                isLoading={updateMutation.isPending || isUploading}
                isDisabled={!formData.title || !formData.categoryId}
              >
                Update & Publish
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}