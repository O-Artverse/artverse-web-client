'use client';

import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
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
  useDisclosure
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
  Ticket
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Mock events data
  const mockEvents = [
    {
      id: 1,
      title: "Modern Art Exhibition 2024",
      description: "Showcasing contemporary artists and their latest works",
      type: "EXHIBITION",
      format: "OFFLINE",
      status: "UPCOMING",
      startDate: "2025-10-15",
      endDate: "2025-10-30",
      location: "Downtown Art Gallery",
      address: "123 Art Street, City Center",
      ticketPrice: 25,
      maxAttendees: 200,
      registeredAttendees: 125,
      bannerImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      tags: ["Modern", "Contemporary", "Exhibition"]
    },
    {
      id: 2,
      title: "Virtual Reality Art Experience",
      description: "Immersive 3D art gallery experience in virtual reality",
      type: "EXHIBITION",
      format: "3D_VIRTUAL",
      status: "ACTIVE",
      startDate: "2025-09-01",
      endDate: "2025-12-31",
      location: "Virtual Space",
      address: "Online Platform",
      ticketPrice: 15,
      maxAttendees: 500,
      registeredAttendees: 342,
      bannerImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
      tags: ["VR", "3D", "Interactive", "Digital"]
    },
    {
      id: 3,
      title: "Artist Workshop: Oil Painting Basics",
      description: "Learn fundamental oil painting techniques from master artists",
      type: "WORKSHOP",
      format: "OFFLINE",
      status: "UPCOMING",
      startDate: "2025-11-10",
      endDate: "2025-11-12",
      location: "Creative Studio",
      address: "456 Workshop Ave, Art District",
      ticketPrice: 150,
      maxAttendees: 20,
      registeredAttendees: 18,
      bannerImage: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
      tags: ["Workshop", "Oil Painting", "Learning"]
    },
    {
      id: 4,
      title: "Digital Art Auction",
      description: "Exclusive auction featuring rare digital artworks and NFTs",
      type: "AUCTION",
      format: "ONLINE",
      status: "DRAFT",
      startDate: "2025-12-05",
      endDate: "2025-12-05",
      location: "Online Platform",
      address: "Virtual Auction House",
      ticketPrice: 0,
      maxAttendees: 1000,
      registeredAttendees: 0,
      bannerImage: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400",
      tags: ["Digital", "NFT", "Auction", "Online"]
    }
  ];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || event.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDeleteEvent = (event: any) => {
    setSelectedEvent(event);
    onOpen();
  };

  const confirmDelete = () => {
    console.log('Deleting event:', selectedEvent?.id);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'UPCOMING': return 'primary';
      case 'DRAFT': return 'warning';
      case 'COMPLETED': return 'default';
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
      case '3D_VIRTUAL': return '🥽';
      case 'ONLINE': return '💻';
      case 'OFFLINE': return '🏛️';
      default: return '📅';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Events Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage exhibitions, workshops, and auctions
          </p>
        </div>
        <Link href="/business/events/create">
          <Button
            color="primary"
            startContent={<Plus size={16} />}
            className="w-full sm:w-auto"
          >
            Create Event
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
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
          </Select>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">
              {mockEvents.length}
            </div>
            <div className="text-sm text-gray-600">Total Events</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">
              {mockEvents.filter(e => e.status === 'ACTIVE').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">
              {mockEvents.filter(e => e.status === 'UPCOMING').length}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">
              {mockEvents.reduce((sum, e) => sum + e.registeredAttendees, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Attendees</div>
          </CardBody>
        </Card>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="group hover:shadow-lg transition-shadow">
            <CardBody className="p-0">
              {/* Banner Image */}
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <Image
                  src={event.bannerImage}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Chip
                    size="sm"
                    color={getStatusColor(event.status)}
                    variant="solid"
                  >
                    {event.status}
                  </Chip>
                  <Chip
                    size="sm"
                    color={getTypeColor(event.type)}
                    variant="flat"
                  >
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
                    {event.description}
                  </p>
                </div>

                {/* Event Details */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{event.registeredAttendees} / {event.maxAttendees} attendees</span>
                  </div>
                  {event.ticketPrice > 0 && (
                    <div className="flex items-center gap-2">
                      <Ticket size={16} />
                      <span>${event.ticketPrice} per ticket</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 3).map((tag) => (
                    <Chip key={tag} size="sm" variant="flat" color="default">
                      {tag}
                    </Chip>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Registration Progress</span>
                    <span>{Math.round((event.registeredAttendees / event.maxAttendees) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((event.registeredAttendees / event.maxAttendees) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<Eye size={14} />}
                    className="flex-1"
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
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card>
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
        <ModalContent>
          <ModalHeader>Delete Event</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone
              and all registered attendees will be notified.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              Delete Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}