'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Spinner,
  Divider,
  User,
} from '@heroui/react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Ticket,
  PencilSimple,
  Trash,
  UserPlus,
  UserMinus,
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { useEvent, useDeleteEvent, useRegisterEvent, useUnregisterEvent } from '@/hooks/queries/useEvents';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const { data: event, isLoading, error } = useEvent(id);
  const deleteEventMutation = useDeleteEvent();
  const registerMutation = useRegisterEvent();
  const unregisterMutation = useUnregisterEvent();

  const isCreator = event && user && event.creator.id === user.id;
  const isOrganizationOwner = event && user?.ownedOrganizations?.some(org => org.id === event.organization.id);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${event?.title}"?`)) {
      await deleteEventMutation.mutateAsync(id);
      router.push('/business/events');
    }
  };

  const handleRegister = async () => {
    await registerMutation.mutateAsync(id);
  };

  const handleUnregister = async () => {
    await unregisterMutation.mutateAsync(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'UPCOMING': return 'primary';
      case 'DRAFT': return 'warning';
      case 'COMPLETED': return 'default';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EXHIBITION': return 'primary';
      case 'WORKSHOP': return 'secondary';
      case 'AUCTION': return 'warning';
      default: return 'default';
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load event details.</p>
        <Link href="/business/events">
          <Button color="primary" className="mt-4">Back to Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/business/events">
            <Button isIconOnly variant="light" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Event Details
            </h1>
          </div>
        </div>

        {(isCreator || isOrganizationOwner) && (
          <div className="flex gap-2">
            <Link href={`/business/events/${id}/edit`}>
              <Button color="primary" startContent={<PencilSimple size={16} />}>
                Edit Event
              </Button>
            </Link>
            <Button
              color="danger"
              variant="light"
              startContent={<Trash size={16} />}
              onPress={handleDelete}
              isLoading={deleteEventMutation.isPending}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner */}
          <Card>
            <CardBody className="p-0">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                {event.bannerImage ? (
                  <Image
                    src={event.bannerImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                    <Calendar size={64} className="text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Chip size="sm" color={getStatusColor(event.status)} variant="solid">
                    {event.status}
                  </Chip>
                  <Chip size="sm" color={getTypeColor(event.type)} variant="flat">
                    {event.type}
                  </Chip>
                </div>
                <div className="absolute top-4 right-4">
                  <Chip size="sm" variant="solid" className="bg-black/50 text-white">
                    {getFormatIcon(event.format)} {event.format.replace('_', ' ')}
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Event Info */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">{event.title}</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {event.description || 'No description provided'}
              </p>

              <Divider />

              {/* Event Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Calendar size={20} className="text-primary" />
                  <div>
                    <div className="font-medium">Date & Time</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}
                    </div>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <MapPin size={20} className="text-primary" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {event.location}
                        {event.address && <><br />{event.address}</>}
                      </div>
                    </div>
                  </div>
                )}

                {event.onlineLink && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="text-xl">💻</div>
                    <div>
                      <div className="font-medium">Online Link</div>
                      <a
                        href={event.onlineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Join Online Event
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Users size={20} className="text-primary" />
                  <div>
                    <div className="font-medium">Attendees</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {event.registeredCount} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} registered
                    </div>
                  </div>
                </div>

                {event.ticketPrice && event.ticketPrice > 0 && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Ticket size={20} className="text-primary" />
                    <div>
                      <div className="font-medium">Ticket Price</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ${event.ticketPrice}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <div className="font-medium mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <Chip key={tag} size="sm" variant="flat" color="default">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organization Info */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Organized By</h3>
            </CardHeader>
            <CardBody>
              <User
                name={event.organization.name}
                avatarProps={{
                  src: event.organization.avatar || undefined,
                  name: event.organization.name,
                }}
              />
            </CardBody>
          </Card>

          {/* Creator Info */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Created By</h3>
            </CardHeader>
            <CardBody>
              <User
                name={`${event.creator.firstName} ${event.creator.lastName}`}
                description={`@${event.creator.username}`}
                avatarProps={{
                  src: event.creator.avatar || undefined,
                  name: event.creator.firstName,
                }}
              />
            </CardBody>
          </Card>

          {/* Registration Progress */}
          {event.maxAttendees && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Registration Status</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Capacity</span>
                  <span>{Math.round((event.registeredCount / event.maxAttendees) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{
                      width: `${Math.min((event.registeredCount / event.maxAttendees) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {event.registeredCount} / {event.maxAttendees} spots filled
                </div>
              </CardBody>
            </Card>
          )}

          {/* Action Buttons (if not creator) */}
          {!isCreator && !isOrganizationOwner && (
            <Card>
              <CardBody>
                <Button
                  color="primary"
                  className="w-full"
                  startContent={<UserPlus size={16} />}
                  onPress={handleRegister}
                  isLoading={registerMutation.isPending}
                >
                  Register for Event
                </Button>
                <Button
                  variant="light"
                  className="w-full mt-2"
                  startContent={<UserMinus size={16} />}
                  onPress={handleUnregister}
                  isLoading={unregisterMutation.isPending}
                >
                  Unregister
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}