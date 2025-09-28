'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
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

export default function CreateArtworkPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    medium: '',
    dimensions: '',
    year: new Date().getFullYear(),
    digitalPrice: '',
    physicalPrice: '',
    tags: [] as string[],
    isForSale: true,
    hasPhysicalVersion: false,
    shippingInfo: {
      weight: '',
      packagingFee: '',
      internationalShipping: false
    },
    status: 'DRAFT'
  });
  const [newTag, setNewTag] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Abstract', 'Landscape', 'Portrait', 'Still Life', 'Digital Art',
    'Photography', 'Sculpture', 'Mixed Media', 'Street Art', 'Contemporary'
  ];

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
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

  const handleSubmit = async (isDraft = false) => {
    setIsLoading(true);

    try {
      // Here you would normally upload to your API
      const artworkData = {
        ...formData,
        status: isDraft ? 'DRAFT' : 'PUBLISHED',
        images: selectedFiles
      };

      console.log('Creating artwork:', artworkData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect back to artworks page
      router.push('/business/artworks');
    } catch (error) {
      console.error('Error creating artwork:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
              Upload New Artwork
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your creativity with the world
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Upload */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h3 className="text-lg font-semibold">Artwork Images</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary dark:hover:border-primary-400 transition-colors bg-gray-50/50 dark:bg-gray-800/20">
              <input
                type="file"
                multiple
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
                    Click to upload images
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG up to 10MB each
                  </p>
                </div>
              </label>
            </div>

            {/* Preview Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">Selected Images:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                selectedKeys={formData.category ? [formData.category] : []}
                onSelectionChange={(keys) => handleInputChange('category', Array.from(keys)[0])}
                isRequired
              >
                {categories.map(category => (
                  <SelectItem key={category}>
                    {category}
                  </SelectItem>
                ))}
              </Select>
            </div>

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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Pricing Options</label>
                <Switch
                  isSelected={formData.isForSale}
                  onValueChange={(checked) => handleInputChange('isForSale', checked)}
                >
                  Available for sale
                </Switch>
              </div>

              {formData.isForSale && (
                <div className="space-y-4">
                  {/* Digital Price */}
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-blue-50/30 dark:bg-blue-900/10">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      Digital Version (Required)
                    </h4>
                    <Input
                      label="Digital Price (USD)"
                      placeholder="0.00"
                      type="number"
                      value={formData.digitalPrice}
                      onChange={(e) => handleInputChange('digitalPrice', e.target.value)}
                      startContent={<span className="text-gray-500 dark:text-gray-400">$</span>}
                      description="Price for high-resolution digital download"
                    />
                  </div>

                  {/* Physical Version Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">Physical Version</label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Offer physical prints with shipping</p>
                    </div>
                    <Switch
                      isSelected={formData.hasPhysicalVersion}
                      onValueChange={(checked) => handleInputChange('hasPhysicalVersion', checked)}
                    >
                      Available
                    </Switch>
                  </div>

                  {/* Physical Pricing */}
                  {formData.hasPhysicalVersion && (
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-green-50/30 dark:bg-green-900/10">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        Physical Print & Shipping
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Physical Print Price (USD)"
                          placeholder="0.00"
                          type="number"
                          value={formData.physicalPrice}
                          onChange={(e) => handleInputChange('physicalPrice', e.target.value)}
                          startContent={<span className="text-gray-500 dark:text-gray-400">$</span>}
                          description="Base price for physical print"
                        />
                        <Input
                          label="Estimated Weight (kg)"
                          placeholder="0.5"
                          type="number"
                          value={formData.shippingInfo.weight}
                          onChange={(e) => handleInputChange('shippingInfo', { ...formData.shippingInfo, weight: e.target.value })}
                          description="For shipping calculation"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Input
                          label="Packaging Fee (USD)"
                          placeholder="5.00"
                          type="number"
                          value={formData.shippingInfo.packagingFee}
                          onChange={(e) => handleInputChange('shippingInfo', { ...formData.shippingInfo, packagingFee: e.target.value })}
                          startContent={<span className="text-gray-500 dark:text-gray-400">$</span>}
                          description="Protective packaging cost"
                        />
                        <div className="flex items-center justify-between pt-6">
                          <div>
                            <label className="text-sm font-medium text-gray-900 dark:text-white">International Shipping</label>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Ship worldwide</p>
                          </div>
                          <Switch
                            isSelected={formData.shippingInfo.internationalShipping}
                            onValueChange={(checked) => handleInputChange('shippingInfo', { ...formData.shippingInfo, internationalShipping: checked })}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
              >
                Cancel
              </Button>
              <Button
                variant="flat"
                onPress={() => handleSubmit(true)}
                isLoading={isLoading}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Save as Draft
              </Button>
              <Button
                color="primary"
                onPress={() => handleSubmit(false)}
                isLoading={isLoading}
                isDisabled={!formData.title || !formData.category || selectedFiles.length === 0 || (formData.isForSale && !formData.digitalPrice)}
              >
                Publish Artwork
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}