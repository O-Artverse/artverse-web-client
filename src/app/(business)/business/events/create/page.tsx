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
  DatePicker,
  DateValue
} from '@heroui/react';
import {
  ArrowLeft,
  Upload,
  MapPin,
  Users,
  Ticket
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { useCreateEvent } from '@/hooks/queries/useEvents';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { toast } from 'react-hot-toast';

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const createEventMutation = useCreateEvent();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'EXHIBITION',
    format: 'OFFLINE',
    startDate: null as DateValue | null,
    endDate: null as DateValue | null,
    location: '',
    address: '',
    onlineLink: '',
    maxAttendees: 100,
    ticketPrice: 0,
    hasTickets: false,
    tags: [] as string[],
    status: 'DRAFT'
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState('');

  const eventTypes = [
    { key: 'EXHIBITION', label: 'Art Exhibition' },
    { key: 'WORKSHOP', label: 'Workshop' },
    { key: 'AUCTION', label: 'Auction' },
    { key: 'CONFERENCE', label: 'Conference' },
    { key: 'MEETUP', label: 'Meetup Event' },
    { key: 'OTHER', label: 'Other' }
  ];

  const eventFormats = [
    { key: 'OFFLINE', label: 'In-Person Event' },
    { key: 'ONLINE', label: 'Online Event' },
    { key: 'THREE_D_VIRTUAL', label: '3D Virtual Gallery' },
    { key: 'HYBRID', label: 'Hybrid Event' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const compressImage = (file: File, maxSizeMB = 5): Promise<File> => {
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
                  resolve(compressedFile);
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

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Step 1: Compress image
        toast.loading('Compressing image...', { id: 'upload-banner' });
        const originalSize = (file.size / (1024 * 1024)).toFixed(2);
        const compressedFile = await compressImage(file, 5);
        const compressedSize = (compressedFile.size / (1024 * 1024)).toFixed(2);

        setBannerFile(compressedFile);

        toast.loading(`Uploading banner (${compressedSize}MB)...`, { id: 'upload-banner' });

        // Step 2: Upload to backend
        const { default: eventService } = await import('@/services/event.service');
        const response = await eventService.uploadBanner(compressedFile);

        // Use the path returned from backend
        setBannerUrl(response.url);

        toast.success(`Banner uploaded! (${originalSize}MB → ${compressedSize}MB)`, { id: 'upload-banner' });
      } catch (error: any) {
        console.error('Error uploading banner:', error);
        toast.error('Failed to upload banner', { id: 'upload-banner' });
        setBannerFile(null);
      }
    }
  };

  const handleSubmit = async (isDraft = false) => {
    try {
      // Validate required fields
      if (!formData.title) {
        toast.error('Event title is required');
        return;
      }

      if (!formData.startDate || !formData.endDate) {
        toast.error('Start and end dates are required');
        return;
      }

      // Get user's organization
      const organizationId = user?.ownedOrganizations?.[0]?.id;

      if (!organizationId) {
        toast.error('You need to create an organization first');
        return;
      }

      // Convert dates to ISO string
      const startDate = new Date(
        formData.startDate.year,
        formData.startDate.month - 1,
        formData.startDate.day
      ).toISOString();

      const endDate = new Date(
        formData.endDate.year,
        formData.endDate.month - 1,
        formData.endDate.day
      ).toISOString();

      // Prepare event data
      const eventData = {
        title: formData.title,
        description: formData.description || undefined,
        type: formData.type,
        format: formData.format,
        status: isDraft ? 'DRAFT' : 'UPCOMING',
        startDate,
        endDate,
        location: formData.location || undefined,
        address: formData.address || undefined,
        onlineLink: formData.onlineLink || undefined,
        ticketPrice: formData.hasTickets ? formData.ticketPrice : undefined,
        maxAttendees: formData.maxAttendees || undefined,
        bannerImage: bannerUrl || undefined,
        tags: formData.tags,
        organizationId
      };

      console.log('Creating event with data:', eventData);

      // Call API
      await createEventMutation.mutateAsync(eventData);

      // Redirect back to events page
      router.push('/business/events');
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error(error?.response?.data?.message || 'Failed to create event');
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'THREE_D_VIRTUAL': return '🥽';
      case 'ONLINE': return '💻';
      case 'OFFLINE': return '🏛️';
      case 'HYBRID': return '🌐';
      default: return '📅';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/business/events">
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
            Create New Event
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize exhibitions, workshops, and art events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banner Upload */}
        <Card className="bg-white dark:bg-[#1E1B26] lg:col-span-1">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Banner</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary dark:hover:border-primary-400 transition-colors bg-gray-50/50 dark:bg-gray-800/20">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
                id="banner-upload"
              />
              <label
                htmlFor="banner-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload size={32} className="text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to upload banner
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </label>
            </div>

            {/* Preview Banner */}
            {bannerFile && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">Banner Preview:</h4>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <Image
                    src={URL.createObjectURL(bannerFile)}
                    alt="Event banner preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Event Details */}
        <Card className="bg-white dark:bg-[#1E1B26] lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Details</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <Input
                label="Event Title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                isRequired
              />

              <Textarea
                label="Description"
                placeholder="Describe your event..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                minRows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Event Type"
                  placeholder="Select event type"
                  selectedKeys={[formData.type]}
                  onSelectionChange={(keys) => handleInputChange('type', Array.from(keys)[0])}
                  isRequired
                >
                  {eventTypes.map(type => (
                    <SelectItem key={type.key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Event Format"
                  placeholder="Select format"
                  selectedKeys={[formData.format]}
                  onSelectionChange={(keys) => handleInputChange('format', Array.from(keys)[0])}
                  isRequired
                >
                  {eventFormats.map(format => (
                    <SelectItem key={format.key}>
                      {getFormatIcon(format.key)} {format.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Date & Time</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePicker
                  label="Start Date"
                  value={formData.startDate as any}
                  onChange={(date) => handleInputChange('startDate', date)}
                  isRequired
                />
                <DatePicker
                  label="End Date"
                  value={formData.endDate as any}
                  onChange={(date) => handleInputChange('endDate', date)}
                  isRequired
                />
              </div>
            </div>

            {/* Location */}
            {(formData.format === 'OFFLINE' || formData.format === 'HYBRID') && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Location</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Venue Name"
                    placeholder="e.g., Downtown Art Gallery"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    startContent={<MapPin size={16} />}
                  />
                  <Input
                    label="Full Address"
                    placeholder="e.g., 123 Art Street, City Center"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Online Link */}
            {(formData.format === 'ONLINE' || formData.format === 'HYBRID' || formData.format === 'THREE_D_VIRTUAL') && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Online Access</h4>
                <Input
                  label="Online Link"
                  placeholder="e.g., https://meet.google.com/abc-def-ghi"
                  value={formData.onlineLink}
                  onChange={(e) => handleInputChange('onlineLink', e.target.value)}
                />
              </div>
            )}

            {/* Capacity & Ticketing */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Capacity & Ticketing</h4>

              <Input
                label="Maximum Attendees"
                type="number"
                value={formData.maxAttendees.toString()}
                onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value) || 0)}
                startContent={<Users size={16} />}
              />

              <div className="space-y-4">
                <Switch
                  isSelected={formData.hasTickets}
                  onValueChange={(checked) => handleInputChange('hasTickets', checked)}
                >
                  Paid Event (Requires Tickets)
                </Switch>

                {formData.hasTickets && (
                  <Input
                    label="Ticket Price (VND)"
                    type="number"
                    value={formData.ticketPrice.toString()}
                    onChange={(e) => handleInputChange('ticketPrice', parseFloat(e.target.value) || 0)}
                    endContent={<span className="text-gray-500">VND</span>}
                    startContent={<Ticket size={16} className="text-gray-400" />}
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="light"
                onPress={() => router.push('/business/events')}
                className="text-gray-600 dark:text-gray-400"
              >
                Cancel
              </Button>
              <Button
                variant="flat"
                onPress={() => handleSubmit(true)}
                isLoading={createEventMutation.isPending}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Save as Draft
              </Button>
              <Button
                color="primary"
                onPress={() => handleSubmit(false)}
                isLoading={createEventMutation.isPending}
                isDisabled={!formData.title || !formData.type || !formData.startDate || !formData.endDate}
              >
                Create Event
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}