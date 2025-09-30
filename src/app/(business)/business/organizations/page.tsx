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
  useDisclosure,
  Spinner,
  Textarea,
} from '@heroui/react';
import {
  MagnifyingGlass,
  Users,
  Eye,
  SignOut,
  Buildings,
  Plus,
} from '@phosphor-icons/react';
import {
  useMyOrganizations,
  useOrganizations,
} from '@/hooks/queries/organization.query';
import {
  useLeaveOrganization,
  useRequestToJoin,
} from '@/hooks/mutations/organization.mutation';
import { useMyJoinRequests } from '@/hooks/queries/organization.query';
import { toast } from 'react-hot-toast';
import type { Organization } from '@/services/organization.service';

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const {isOpen: isJoinOpen, onOpen: onJoinOpen, onClose: onJoinClose} = useDisclosure();
  const {isOpen: isLeaveOpen, onOpen: onLeaveOpen, onClose: onLeaveClose} = useDisclosure();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  // Fetch user's organizations
  const {
    data: joinedOrgs,
    isLoading: isLoadingJoined,
  } = useMyOrganizations();

  // Fetch user's join requests
  const { data: myJoinRequests } = useMyJoinRequests();

  // Fetch all available organizations
  const {
    data: availableOrgsData,
    isLoading: isLoadingAvailable,
  } = useOrganizations({
    search: searchQuery || undefined,
    limit: 50,
  });

  // Mutations
  const leaveMutation = useLeaveOrganization();
  const requestMutation = useRequestToJoin();

  // Filter out organizations user has already joined
  const availableOrgs = availableOrgsData?.data?.filter(
    (org) => !joinedOrgs?.some((joined) => joined.id === org.id)
  ) || [];

  const handleJoinOrganization = (org: Organization) => {
    setSelectedOrg(org);
    onJoinOpen();
  };

  const handleLeaveOrganization = (org: Organization) => {
    setSelectedOrg(org);
    onLeaveOpen();
  };

  const confirmJoin = async () => {
    if (!selectedOrg) return;

    try {
      await requestMutation.mutateAsync({
        organizationId: selectedOrg.id,
        message: requestMessage || undefined,
      });
      toast.success(`Join request sent to ${selectedOrg.name}!`);
      onJoinClose();
      setSelectedOrg(null);
      setRequestMessage('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send join request');
    }
  };

  const confirmLeave = async () => {
    if (!selectedOrg) return;

    try {
      await leaveMutation.mutateAsync(selectedOrg.id);
      toast.success(`Successfully left ${selectedOrg.name}`);
      onLeaveClose();
      setSelectedOrg(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to leave organization');
    }
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
          {isLoadingJoined ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : joinedOrgs && joinedOrgs.length > 0 ? (
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
                            {org.memberRole}
                          </Chip>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {org.description || 'No description available'}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{org._count.members} members</span>
                      <span>{org._count.artworks} artworks</span>
                      {org.joinedAt && (
                        <span>Joined {new Date(org.joinedAt).toLocaleDateString()}</span>
                      )}
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
                      {org.memberRole !== 'OWNER' && (
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          startContent={<SignOut size={14} />}
                          onPress={() => handleLeaveOrganization(org)}
                          isLoading={leaveMutation.isPending}
                        >
                          Leave
                        </Button>
                      )}
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <h2 className="text-xl font-semibold">Discover Organizations</h2>
            </div>
            <Input
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<MagnifyingGlass size={16} />}
              className="w-full sm:w-72"
            />
          </div>
        </CardHeader>
        <CardBody>
          {isLoadingAvailable ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableOrgs.map((org) => (
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
                            <span>{org._count.members} members</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                        {org.description || 'No description available'}
                      </p>

                      <div className="text-sm text-gray-500 mb-4">
                        {org._count.artworks} artworks published
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
                        {(() => {
                          const hasPendingRequest = myJoinRequests?.some(
                            (req) => req.organizationId === org.id
                          );

                          if (hasPendingRequest) {
                            return (
                              <Button
                                size="sm"
                                color="warning"
                                variant="flat"
                                isDisabled
                              >
                                Pending
                              </Button>
                            );
                          }

                          return (
                            <Button
                              size="sm"
                              color="primary"
                              startContent={<Plus size={14} />}
                              onPress={() => handleJoinOrganization(org)}
                              isLoading={requestMutation.isPending}
                            >
                              Request
                            </Button>
                          );
                        })()}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {availableOrgs.length === 0 && !isLoadingAvailable && (
                <div className="text-center py-8">
                  <MagnifyingGlass size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery
                      ? 'No organizations found matching your search.'
                      : 'No new organizations available at the moment.'}
                  </p>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Request to Join Modal */}
      <Modal isOpen={isJoinOpen} onClose={onJoinClose} size="lg">
        <ModalContent>
          <ModalHeader>Request to Join Organization</ModalHeader>
          <ModalBody className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Avatar
                src={selectedOrg?.avatar}
                name={selectedOrg?.name}
                size="lg"
              />
              <div>
                <h3 className="font-semibold">{selectedOrg?.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrg?._count.members} members</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Send a join request to "{selectedOrg?.name}". The organization admins will review your request and decide whether to accept you as a member.
            </p>
            <Textarea
              label="Message (Optional)"
              placeholder="Tell them why you'd like to join..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              minRows={3}
              maxRows={6}
            />
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your join request will be pending until an admin accepts or declines it.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onJoinClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={confirmJoin}
              isLoading={requestMutation.isPending}
            >
              Send Request
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
            <Button
              color="danger"
              onPress={confirmLeave}
              isLoading={leaveMutation.isPending}
            >
              Leave Organization
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}