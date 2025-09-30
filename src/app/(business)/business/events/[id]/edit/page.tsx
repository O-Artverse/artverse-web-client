'use client';

import { use, useState, useEffect } from 'react';
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
  Spinner,
} from '@heroui/react';
import { parseDate } from '@internationalized/date';
import {
  ArrowLeft,
  Upload,
  MapPin,
  Users,
  Ticket
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { useEvent, useUpdateEvent } from '@/hooks/queries/useEvents';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { toast } from 'react-hot-toast';
import eventService from '@/services/event.service';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: event, isLoading: isLoadingEvent } = useEvent(id);
  const updateEventMutation = useUpdateEvent();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'EXHIBITION',
    format: 'OFFLINE',
    startDate: null as any,
    endDate: null as any,
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
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Load event data when available
  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      setFormData({
        title: event.title,
        description: event.description || '',
        type: event.type,
        format: event.format,
        startDate: parseDate(startDate.toISOString().split('T')[0]),
        endDate: parseDate(endDate.toISOString().split('T')[0]),
        location: event.location || '',
        address: event.address || '',
        onlineLink: event.onlineLink || '',
        maxAttendees: event.maxAttendees || 100,
        ticketPrice: event.ticketPrice ? Number(event.ticketPrice) : 0,
        hasTickets: !!event.ticketPrice && event.ticketPrice > 0,
        tags: event.tags || [],
        status: event.status
      });

      setBannerUrl(event.bannerImage || '');
    }
  }, [event]);

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

  const eventStatuses = [
    { key: 'DRAFT', label: 'Draft' },
    { key: 'UPCOMING', label: 'Upcoming' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' }
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

          const maxDimension = 2000;
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

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingBanner(true);

      try {
        toast.loading('Compressing image...', { id: 'upload-banner' });
        const originalSize = (file.size / (1024 * 1024)).toFixed(2);
        const compressedFile = await compressImage(file, 5);
        const compressedSize = (compressedFile.size / (1024 * 1024)).toFixed(2);

        setBannerFile(compressedFile);

        toast.loading(`Uploading banner (${compressedSize}MB)...`, { id: 'upload-banner' });
        const response = await eventService.uploadBanner(compressedFile);

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const fullUrl = `${apiBaseUrl}${response.url}`;
        setBannerUrl(fullUrl);
        toast.success(`Banner uploaded! (${originalSize}MB → ${compressedSize}MB)`, { id: 'upload-banner' });
      } catch (error: any) {
        console.error('Error uploading banner:', error);
        toast.error('Failed to upload banner', { id: 'upload-banner' });
        setBannerFile(null);
      } finally {
        setIsUploadingBanner(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title) {
        toast.error('Event title is required');
        return;
      }

      if (!formData.startDate || !formData.endDate) {
        toast.error('Start and end dates are required');
        return;
      }

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

      const eventData = {
        title: formData.title,
        description: formData.description || undefined,
        type: formData.type,
        format: formData.format,
        status: formData.status,
        startDate,
        endDate,
        location: formData.location || undefined,
        address: formData.address || undefined,
        onlineLink: formData.onlineLink || undefined,
        ticketPrice: formData.hasTickets ? formData.ticketPrice : undefined,
        maxAttendees: formData.maxAttendees || undefined,
        bannerImage: bannerUrl || undefined,
        tags: formData.tags,
      };

      await updateEventMutation.mutateAsync({ id, data: eventData });
      router.push(`/business/events/${id}`);
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error(error?.response?.data?.message || 'Failed to update event');
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

  if (isLoadingEvent) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Event not found</p>
        <Link href="/business/events">
          <Button color="primary" className="mt-4">Back to Events</Button>
        </Link>
      </div>
    );
  }

  // Check permissions
  const isCreator = event && user && event.creator.id === user.id;
  const isOrganizationOwner = event && user?.ownedOrganizations?.some(org => org.id === event.organization.id);

  if (!isCreator && !isOrganizationOwner) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">You don't have permission to edit this event</p>
        <Link href="/business/events">
          <Button color="primary" className="mt-4">Back to Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/business/events/${id}`}>
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
            Edit Event
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update event information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banner Upload */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h3 className="text-lg font-semibold">Event Banner</h3>
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
                disabled={isUploadingBanner}
              />
              <label
                htmlFor="banner-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload size={32} className="text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isUploadingBanner ? 'Uploading...' : 'Click to upload banner'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </label>
            </div>

            {/* Preview Banner */}
            {(bannerFile || bannerUrl) && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">Banner Preview:</h4>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <Image
                    src={bannerFile ? URL.createObjectURL(bannerFile) : bannerUrl}
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold">Event Details</h3>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <Select
                  label="Status"
                  placeholder="Select status"
                  selectedKeys={[formData.status]}
                  onSelectionChange={(keys) => handleInputChange('status', Array.from(keys)[0])}
                  isRequired
                >
                  {eventStatuses.map(status => (
                    <SelectItem key={status.key}>
                      {status.label}
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
                  value={formData.startDate}
                  onChange={(date) => handleInputChange('startDate', date)}
                  isRequired
                />
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
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
                    label="Ticket Price (USD)"
                    type="number"
                    value={formData.ticketPrice.toString()}
                    onChange={(e) => handleInputChange('ticketPrice', parseFloat(e.target.value) || 0)}
                    startContent={<span className="text-gray-500">$</span>}
                    endContent={<Ticket size={16} className="text-gray-400" />}
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href={`/business/events/${id}`}>
                <Button
                  variant="light"
                  className="text-gray-600 dark:text-gray-400"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={updateEventMutation.isPending}
                isDisabled={!formData.title || !formData.type || !formData.startDate || !formData.endDate}
              >
                Save Changes
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}