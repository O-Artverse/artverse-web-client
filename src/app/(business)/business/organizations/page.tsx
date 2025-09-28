'use client';

import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Chip,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import {
  MagnifyingGlass,
  Users,
  Plus,
  Eye,
  SignOut,
  Buildings
} from '@phosphor-icons/react';
import Image from 'next/image';

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const {isOpen: isJoinOpen, onOpen: onJoinOpen, onClose: onJoinClose} = useDisclosure();
  const {isOpen: isLeaveOpen, onOpen: onLeaveOpen, onClose: onLeaveClose} = useDisclosure();
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  // Mock data for joined organizations
  const joinedOrgs = [
    {
      id: 1,
      name: "Modern Art Collective",
      description: "Contemporary artists creating cutting-edge digital and traditional art",
      memberCount: 24,
      artworkCount: 156,
      role: "ARTIST",
      joinedAt: "2024-01-15",
      avatar: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100"
    },
    {
      id: 2,
      name: "Street Art Society",
      description: "Urban artists expressing creativity through street art and murals",
      memberCount: 18,
      artworkCount: 89,
      role: "ARTIST",
      joinedAt: "2024-03-20",
      avatar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100"
    }
  ];

  // Mock data for available organizations
  const availableOrgs = [
    {
      id: 3,
      name: "Nature Photography Guild",
      description: "Capturing the beauty of nature through photography",
      memberCount: 32,
      artworkCount: 245,
      tags: ["Photography", "Nature", "Landscape"],
      avatar: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100"
    },
    {
      id: 4,
      name: "Abstract Expression Group",
      description: "Exploring abstract art in all its forms and mediums",
      memberCount: 15,
      artworkCount: 67,
      tags: ["Abstract", "Painting", "Mixed Media"],
      avatar: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=100"
    },
    {
      id: 5,
      name: "Digital Art Pioneers",
      description: "Leading the future of digital art and NFT creation",
      memberCount: 28,
      artworkCount: 134,
      tags: ["Digital", "NFT", "Technology"],
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"
    }
  ];

  const filteredAvailableOrgs = availableOrgs.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinOrganization = (org: any) => {
    setSelectedOrg(org);
    onJoinOpen();
  };

  const handleLeaveOrganization = (org: any) => {
    setSelectedOrg(org);
    onLeaveOpen();
  };

  const confirmJoin = () => {
    console.log('Joining organization:', selectedOrg?.id);
    onJoinClose();
  };

  const confirmLeave = () => {
    console.log('Leaving organization:', selectedOrg?.id);
    onLeaveClose();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Organizations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join organizations to collaborate with other artists and showcase your work
        </p>
      </div>

      {/* My Organizations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Buildings size={20} />
            <h2 className="text-xl font-semibold">My Organizations</h2>
          </div>
        </CardHeader>
        <CardBody>
          {joinedOrgs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {joinedOrgs.map((org) => (
                <Card key={org.id} className="border">
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={org.avatar}
                          name={org.name}
                          size="md"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {org.name}
                          </h3>
                          <Chip size="sm" color="primary" variant="flat">
                            {org.role}
                          </Chip>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {org.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{org.memberCount} members</span>
                      <span>{org.artworkCount} artworks</span>
                      <span>Joined {new Date(org.joinedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
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
                        color="danger"
                        variant="light"
                        startContent={<SignOut size={14} />}
                        onPress={() => handleLeaveOrganization(org)}
                      >
                        Leave
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Buildings size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                You haven't joined any organizations yet. Explore available organizations below.
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Available Organizations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <h2 className="text-xl font-semibold">Discover Organizations</h2>
            </div>
            <Input
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<MagnifyingGlass size={16} />}
              className="w-72"
            />
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAvailableOrgs.map((org) => (
              <Card key={org.id} className="border hover:shadow-md transition-shadow">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar
                      src={org.avatar}
                      name={org.name}
                      size="lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {org.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users size={14} />
                        <span>{org.memberCount} members</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {org.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {org.tags.map((tag) => (
                      <Chip key={tag} size="sm" variant="flat" color="default">
                        {tag}
                      </Chip>
                    ))}
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    {org.artworkCount} artworks published
                  </div>

                  <div className="flex gap-2">
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
                      color="primary"
                      startContent={<Plus size={14} />}
                      onPress={() => handleJoinOrganization(org)}
                    >
                      Join
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {filteredAvailableOrgs.length === 0 && (
            <div className="text-center py-8">
              <MagnifyingGlass size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No organizations found matching your search.
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Join Organization Modal */}
      <Modal isOpen={isJoinOpen} onClose={onJoinClose}>
        <ModalContent>
          <ModalHeader>Join Organization</ModalHeader>
          <ModalBody>
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                src={selectedOrg?.avatar}
                name={selectedOrg?.name}
                size="lg"
              />
              <div>
                <h3 className="font-semibold">{selectedOrg?.name}</h3>
                <p className="text-sm text-gray-600">{selectedOrg?.memberCount} members</p>
              </div>
            </div>
            <p className="text-sm">
              Are you sure you want to join "{selectedOrg?.name}"? You'll be able to participate in their activities and showcase your artwork within this organization.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onJoinClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={confirmJoin}>
              Join Organization
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Leave Organization Modal */}
      <Modal isOpen={isLeaveOpen} onClose={onLeaveClose}>
        <ModalContent>
          <ModalHeader>Leave Organization</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to leave "{selectedOrg?.name}"? You'll lose access to organization activities and your artworks may be removed from their showcase.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onLeaveClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={confirmLeave}>
              Leave Organization
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}