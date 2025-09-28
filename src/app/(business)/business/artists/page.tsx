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
  Avatar,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea
} from '@heroui/react';
import {
  MagnifyingGlass,
  Plus,
  DotsThree,
  Eye,
  PaperPlaneRight,
  Crown,
  UserGear,
  Trash
} from '@phosphor-icons/react';

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const {isOpen: isInviteOpen, onOpen: onInviteOpen, onClose: onInviteClose} = useDisclosure();
  const {isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose} = useDisclosure();
  const [selectedArtist, setSelectedArtist] = useState<any>(null);

  // Mock organization members data
  const orgMembers = [
    {
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson",
      username: "sarah_art",
      email: "sarah@example.com",
      role: "ADMIN",
      joinedAt: "2024-01-15",
      artworkCount: 24,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      specialties: ["Digital Art", "Portraits"]
    },
    {
      id: 2,
      firstName: "Michael",
      lastName: "Chen",
      username: "mchen_creative",
      email: "michael@example.com",
      role: "ARTIST",
      joinedAt: "2024-02-20",
      artworkCount: 18,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      specialties: ["Photography", "Street Art"]
    },
    {
      id: 3,
      firstName: "Emma",
      lastName: "Rodriguez",
      username: "emma_painter",
      email: "emma@example.com",
      role: "ARTIST",
      joinedAt: "2024-03-10",
      artworkCount: 31,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      specialties: ["Abstract", "Oil Painting"]
    },
    {
      id: 4,
      firstName: "David",
      lastName: "Kim",
      username: "dkim_sculptor",
      email: "david@example.com",
      role: "ARTIST",
      joinedAt: "2024-04-05",
      artworkCount: 12,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      specialties: ["Sculpture", "Mixed Media"]
    }
  ];

  const filteredMembers = orgMembers.filter(member => {
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInviteArtist = () => {
    console.log('Inviting artist:', { email: inviteEmail, message: inviteMessage });
    setInviteEmail('');
    setInviteMessage('');
    onInviteClose();
  };

  const handleRemoveArtist = (artist: any) => {
    setSelectedArtist(artist);
    onRemoveOpen();
  };

  const confirmRemove = () => {
    console.log('Removing artist:', selectedArtist?.id);
    onRemoveClose();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'secondary';
      case 'ARTIST': return 'primary';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Crown size={14} />;
      case 'ARTIST': return <UserGear size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Artists Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage artists in your organization
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={onInviteOpen}
        >
          Invite Artist
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row gap-4 p-6">
          <Input
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<MagnifyingGlass size={16} />}
            className="flex-1"
          />
          <Select
            placeholder="Filter by role"
            selectedKeys={[roleFilter]}
            onSelectionChange={(keys) => setRoleFilter(Array.from(keys)[0] as string)}
            className="w-full sm:w-48"
          >
            <SelectItem key="all">All Roles</SelectItem>
            <SelectItem key="admin">Admin</SelectItem>
            <SelectItem key="artist">Artist</SelectItem>
          </Select>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">
              {orgMembers.length}
            </div>
            <div className="text-sm text-gray-600">Total Members</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">
              {orgMembers.filter(m => m.role === 'ADMIN').length}
            </div>
            <div className="text-sm text-gray-600">Admins</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">
              {orgMembers.filter(m => m.role === 'ARTIST').length}
            </div>
            <div className="text-sm text-gray-600">Artists</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">
              {orgMembers.reduce((sum, m) => sum + m.artworkCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Artworks</div>
          </CardBody>
        </Card>
      </div>

      {/* Artists List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Organization Members</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="border">
                <CardBody className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={member.avatar}
                        name={`${member.firstName} ${member.lastName}`}
                        size="md"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {member.firstName} {member.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">@{member.username}</p>
                      </div>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                    >
                      <DotsThree size={16} />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Chip
                      size="sm"
                      color={getRoleColor(member.role)}
                      variant="flat"
                      startContent={getRoleIcon(member.role)}
                    >
                      {member.role}
                    </Chip>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-600">
                      <strong>{member.artworkCount}</strong> artworks
                    </div>
                    <div className="text-sm text-gray-500">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Specialties:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map((specialty) => (
                        <Chip key={specialty} size="sm" variant="flat" color="default">
                          {specialty}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      startContent={<Eye size={14} />}
                      className="flex-1"
                    >
                      View Profile
                    </Button>
                    {member.role !== 'ADMIN' && (
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        startContent={<Trash size={14} />}
                        onPress={() => handleRemoveArtist(member)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <MagnifyingGlass size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No artists found matching your search criteria.
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Invite Artist Modal */}
      <Modal isOpen={isInviteOpen} onClose={onInviteClose} size="lg">
        <ModalContent>
          <ModalHeader>Invite Artist to Organization</ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              label="Email Address"
              placeholder="artist@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              isRequired
            />
            <Textarea
              label="Personal Message (Optional)"
              placeholder="We'd love to have you join our organization..."
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              minRows={3}
            />
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                The artist will receive an email invitation to join your organization.
                They can accept or decline the invitation.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onInviteClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              startContent={<PaperPlaneRight size={16} />}
              onPress={handleInviteArtist}
              isDisabled={!inviteEmail.trim()}
            >
              Send Invitation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Remove Artist Modal */}
      <Modal isOpen={isRemoveOpen} onClose={onRemoveClose}>
        <ModalContent>
          <ModalHeader>Remove Artist</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to remove <strong>{selectedArtist?.firstName} {selectedArtist?.lastName}</strong> from the organization?
              This action cannot be undone and they will lose access to organization resources.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onRemoveClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={confirmRemove}>
              Remove Artist
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}