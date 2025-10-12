'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from '@heroui/react';
import {
  Plus,
  MagnifyingGlass,
  Calendar,
  MapPin,
  Users,
  Eye,
  PencilSimple,
  Trash,
  Ticket,
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { useEvents, useDeleteEvent } from '@/hooks/queries/useEvents';
import { Event } from '@/services/event.service';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { getEventBannerUrl } from '@/utils/imageUtils';

export default function EventsPage() {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Get user's organizations to filter events
  const organizationId = user?.ownedOrganizations?.[0]?.id;

  // Debug: Log user and organizationId
  console.log('User:', user);
  console.log('Organization ID:', organizationId);

  // Fetch events with filters (không filter theo organizationId để test)
  const { data: eventsData, isLoading, error } = useEvents({
    // Tạm thời bỏ filter organizationId để xem tất cả events
    // organizationId,
    ...(searchQuery && { search: searchQuery }),
    ...(statusFilter !== 'all' && { status: statusFilter.toUpperCase() }),
    ...(typeFilter !== 'all' && { type: typeFilter.toUpperCase() }),
  });

  // Debug: Log events data
  console.log('Events Data:', eventsData);
  console.log('Is Loading:', isLoading);
  console.log('Error:', error);

  // Delete mutation
  const deleteEventMutation = useDeleteEvent();

  // Filter events locally (backend already does most filtering)
  const filteredEvents = useMemo(() => {
    if (!eventsData?.data) return [];
    return eventsData.data;
  }, [eventsData]);

  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event);
    onOpen();
  };

  const confirmDelete = async () => {
    if (selectedEvent) {
      await deleteEventMutation.mutateAsync(selectedEvent.id);
      onClose();
      setSelectedEvent(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'UPCOMING':
        return 'primary';
      case 'DRAFT':
        return 'warning';
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EXHIBITION':
        return 'primary';
      case 'WORKSHOP':
        return 'secondary';
      case 'AUCTION':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'THREE_D_VIRTUAL':
        return '🥽';
      case 'ONLINE':
        return '💻';
      case 'OFFLINE':
        return '🏛️';
      case 'HYBRID':
        return '🌐';
      default:
        return '📅';
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    if (!eventsData?.data) return { total: 0, active: 0, upcoming: 0, totalAttendees: 0 };

    return {
      total: eventsData.data.length,
      active: eventsData.data.filter((e) => e.status === 'ACTIVE').length,
      upcoming: eventsData.data.filter((e) => e.status === 'UPCOMING').length,
      totalAttendees: eventsData.data.reduce((sum, e) => sum + (e.registeredCount || 0), 0),
    };
  }, [eventsData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage exhibitions, workshops, and auctions
          </p>
        </div>
        <Link href="/business/events/create">
          <Button color="primary" startContent={<Plus size={16} />} className="w-full sm:w-auto">
            Create Event
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-[#1E1B26]">
        <CardBody className="flex flex-col lg:flex-row gap-4 p-6">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<MagnifyingGlass size={16} />}
            className="flex-1"
          />
          <Select
            placeholder="Filter by status"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
            className="w-full lg:w-48"
          >
            <SelectItem key="all">All Status</SelectItem>
            <SelectItem key="draft">Draft</SelectItem>
            <SelectItem key="upcoming">Upcoming</SelectItem>
            <SelectItem key="active">Active</SelectItem>
            <SelectItem key="completed">Completed</SelectItem>
            <SelectItem key="cancelled">Cancelled</SelectItem>
          </Select>
          <Select
            placeholder="Filter by type"
            selectedKeys={[typeFilter]}
            onSelectionChange={(keys) => setTypeFilter(Array.from(keys)[0] as string)}
            className="w-full lg:w-48"
          >
            <SelectItem key="all">All Types</SelectItem>
            <SelectItem key="exhibition">Exhibition</SelectItem>
            <SelectItem key="workshop">Workshop</SelectItem>
            <SelectItem key="auction">Auction</SelectItem>
            <SelectItem key="conference">Conference</SelectItem>
            <SelectItem key="meetup">Meetup</SelectItem>
          </Select>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
          </CardBody>
        </Card>
        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          </CardBody>
        </Card>
        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.upcoming}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
          </CardBody>
        </Card>
        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.totalAttendees}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Attendees</div>
          </CardBody>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardBody className="text-center py-12">
            <p className="text-red-500">Failed to load events. Please try again.</p>
          </CardBody>
        </Card>
      )}

      {/* Events Grid */}
      {!isLoading && !error && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="bg-white dark:bg-[#1E1B26] group hover:shadow-lg transition-shadow">
              <CardBody className="p-0">
                {/* Banner Image */}
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  {event.bannerImage ? (
                    <Image
                      src={getEventBannerUrl(event.bannerImage) || ''}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                      <Calendar size={48} className="text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-2">
                    <Chip size="sm" color={getStatusColor(event.status)} variant="solid">
                      {event.status}
                    </Chip>
                    <Chip size="sm" color={getTypeColor(event.type)} variant="flat">
                      {event.type}
                    </Chip>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Chip size="sm" variant="solid" className="bg-black/50 text-white">
                      {getFormatIcon(event.format)} {event.format.replace('_', ' ')}
                    </Chip>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {event.description || 'No description provided'}
                    </p>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        {new Date(event.startDate).toLocaleDateString()} -{' '}
                        {new Date(event.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>
                        {event.registeredCount} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''}{' '}
                        attendees
                      </span>
                    </div>
                    {event.ticketPrice && event.ticketPrice > 0 && (
                      <div className="flex items-center gap-2">
                        <Ticket size={16} />
                        <span>{Number(event.ticketPrice).toLocaleString('vi-VN')} VND per ticket</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 3).map((tag) => (
                        <Chip key={tag} size="sm" variant="flat" color="default">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  )}

                  {/* Progress Bar */}
                  {event.maxAttendees && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Registration Progress</span>
                        <span>
                          {Math.round((event.registeredCount / event.maxAttendees) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min((event.registeredCount / event.maxAttendees) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="flat"
                      startContent={<Eye size={14} />}
                      className="flex-1"
                      as={Link}
                      href={`/business/events/${event.id}`}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      startContent={<PencilSimple size={14} />}
                      as={Link}
                      href={`/business/events/${event.id}/edit`}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      startContent={<Trash size={14} />}
                      onPress={() => handleDeleteEvent(event)}
                      isLoading={deleteEventMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredEvents.length === 0 && (
        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardBody className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by creating your first event'}
            </p>
            {!searchQuery && statusFilter === 'all' && typeFilter === 'all' && (
              <Link href="/business/events/create">
                <Button color="primary" startContent={<Plus size={16} />}>
                  Create First Event
                </Button>
              </Link>
            )}
          </CardBody>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent className="bg-white dark:bg-[#1E1B26]">
          <ModalHeader className="text-gray-900 dark:text-white">Delete Event</ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete &quot;{selectedEvent?.title}&quot;? This action
              cannot be undone and all registered attendees will be notified.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={confirmDelete}
              isLoading={deleteEventMutation.isPending}
            >
              Delete Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}