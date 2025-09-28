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
  Calendar,
  MapPin,
  Users,
  Ticket
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { parseDate } from '@internationalized/date';

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'EXHIBITION',
    format: 'OFFLINE',
    startDate: null as DateValue | null,
    endDate: null as DateValue | null,
    location: '',
    address: '',
    maxAttendees: 100,
    ticketPrice: 0,
    hasTickets: true,
    requiresRegistration: true,
    isPublic: true,
    status: 'DRAFT'
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const eventTypes = [
    { key: 'EXHIBITION', label: 'Art Exhibition' },
    { key: 'WORKSHOP', label: 'Workshop' },
    { key: 'AUCTION', label: 'Auction' },
    { key: 'CONFERENCE', label: 'Conference' },
    { key: 'NETWORKING', label: 'Networking Event' }
  ];

  const eventFormats = [
    { key: 'OFFLINE', label: 'In-Person Event' },
    { key: 'ONLINE', label: 'Online Event' },
    { key: '3D_VIRTUAL', label: '3D Virtual Gallery' },
    { key: 'HYBRID', label: 'Hybrid Event' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBannerFile(file);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    setIsLoading(true);

    try {
      const eventData = {
        ...formData,
        status: isDraft ? 'DRAFT' : 'UPCOMING',
        bannerImage: bannerFile
      };

      console.log('Creating event:', eventData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect back to events page
      router.push('/business/events');
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case '3D_VIRTUAL': return '🥽';
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

                <Switch
                  isSelected={formData.requiresRegistration}
                  onValueChange={(checked) => handleInputChange('requiresRegistration', checked)}
                >
                  Require Registration
                </Switch>

                <Switch
                  isSelected={formData.isPublic}
                  onValueChange={(checked) => handleInputChange('isPublic', checked)}
                >
                  Public Event (Visible to everyone)
                </Switch>
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
                isLoading={isLoading}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Save as Draft
              </Button>
              <Button
                color="primary"
                onPress={() => handleSubmit(false)}
                isLoading={isLoading}
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