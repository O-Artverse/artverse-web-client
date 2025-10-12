'use client';

import { useState, useMemo } from 'react';
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
  Textarea,
  Spinner,
} from '@heroui/react';
import {
  MagnifyingGlass,
  Plus,
  DotsThree,
  Eye,
  PaperPlaneRight,
  Crown,
  UserGear,
  Trash,
} from '@phosphor-icons/react';
import { useMyOrganizations, useOrganizationMembers } from '@/hooks/queries/organization.query';
import { useInviteMember, useRemoveMember } from '@/hooks/mutations/organization.mutation';
import { toast } from 'react-hot-toast';
import PendingInvitationsCard from '@/components/modules/Invitations/PendingInvitationsCard';
import PendingJoinRequestsCard from '@/components/modules/JoinRequests/PendingJoinRequestsCard';

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const {isOpen: isInviteOpen, onOpen: onInviteOpen, onClose: onInviteClose} = useDisclosure();
  const {isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose} = useDisclosure();
  const [selectedArtist, setSelectedArtist] = useState<any>(null);

  // Fetch user's organizations
  const { data: myOrgs, isLoading: isLoadingOrgs } = useMyOrganizations();

  // Get first organization (assuming user manages one organization for now)
  const currentOrg = myOrgs?.[0];
  const organizationId = currentOrg?.id;

  // Fetch organization members
  const {
    data: members,
    isLoading: isLoadingMembers,
    error: membersError
  } = useOrganizationMembers(
    organizationId || '',
    undefined
  );

  // Mutations
  const inviteMutation = useInviteMember();
  const removeMutation = useRemoveMember();

  // Filter members
  const filteredMembers = useMemo(() => {
    if (!members) return [];

    return members.filter(member => {
      const user = member.user;
      const matchesSearch =
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || member.role.toLowerCase() === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  // Stats
  const stats = useMemo(() => {
    if (!members) return { total: 0, admins: 0, artists: 0, totalArtworks: 0 };

    return {
      total: members.length,
      admins: members.filter(m => m.role === 'ADMIN').length,
      artists: members.filter(m => m.role === 'ARTIST').length,
      totalArtworks: members.reduce((sum, m) => sum + (m.user.artworkCount || 0), 0),
    };
  }, [members]);

  const handleInviteArtist = async () => {
    if (!organizationId) {
      toast.error('No organization found');
      return;
    }

    try {
      await inviteMutation.mutateAsync({
        organizationId,
        data: {
          email: inviteEmail,
          message: inviteMessage || undefined,
        },
      });

      toast.success('Artist invited successfully!');
      setInviteEmail('');
      setInviteMessage('');
      onInviteClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to invite artist');
    }
  };

  const handleRemoveArtist = (member: any) => {
    setSelectedArtist(member);
    onRemoveOpen();
  };

  const confirmRemove = async () => {
    if (!organizationId || !selectedArtist) return;

    try {
      await removeMutation.mutateAsync({
        organizationId,
        userId: selectedArtist.user.id,
      });

      toast.success('Artist removed successfully');
      onRemoveClose();
      setSelectedArtist(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to remove artist');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'secondary';
      case 'ARTIST': return 'primary';
      case 'OWNER': return 'warning';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Crown size={14} />;
      case 'ARTIST': return <UserGear size={14} />;
      case 'OWNER': return <Crown size={14} weight="fill" />;
      default: return null;
    }
  };

  // Loading state
  if (isLoadingOrgs || isLoadingMembers) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  // No organization state
  if (!currentOrg) {
    return (
      <div className="space-y-6">
        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardBody className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Organization Found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need to create or join an organization to manage artists.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Artists Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage artists in {currentOrg.name}
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={onInviteOpen}
          isDisabled={currentOrg.memberRole === 'ARTIST'}
        >
          Invite Artist
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-[#1E1B26]">
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

      {/* Pending Invitations */}
      {organizationId && currentOrg.memberRole !== 'ARTIST' && (
        <PendingInvitationsCard organizationId={organizationId} />
      )}

      {/* Pending Join Requests */}
      {organizationId && currentOrg.memberRole !== 'ARTIST' && (
        <PendingJoinRequestsCard organizationId={organizationId} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Members</div>
          </CardBody>
        </Card>
        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">
              {stats.admins}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Admins</div>
          </CardBody>
        </Card>
        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.artists}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Artists</div>
          </CardBody>
        </Card>
        <Card className="bg-white dark:bg-[#1E1B26]">
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalArtworks}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Artworks</div>
          </CardBody>
        </Card>
      </div>

      {/* Artists List */}
      <Card className="bg-white dark:bg-[#1E1B26]">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Organization Members</h3>
        </CardHeader>
        <CardBody>
          {isLoadingMembers ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : membersError ? (
            <div className="text-center py-8 text-red-500">
              Error loading members. Please try again.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="bg-white dark:bg-[#1E1B26] border">
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={member.user.avatar}
                          name={`${member.user.firstName} ${member.user.lastName}`}
                          size="md"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {member.user.firstName} {member.user.lastName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">@{member.user.username}</p>
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
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>{member.user.artworkCount || 0}</strong> artworks
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {member.user.description && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {member.user.description}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<Eye size={14} />}
                        className="flex-1"
                      >
                        View Profile
                      </Button>
                      {member.role !== 'OWNER' && currentOrg.memberRole !== 'ARTIST' && (
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          startContent={<Trash size={14} />}
                          onPress={() => handleRemoveArtist(member)}
                          isLoading={removeMutation.isPending}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {filteredMembers.length === 0 && !isLoadingMembers && (
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
        <ModalContent className="bg-white dark:bg-[#1E1B26]">
          <ModalHeader className="text-gray-900 dark:text-white">Invite Artist to Organization</ModalHeader>
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
              isLoading={inviteMutation.isPending}
            >
              Send Invitation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Remove Artist Modal */}
      <Modal isOpen={isRemoveOpen} onClose={onRemoveClose}>
        <ModalContent className="bg-white dark:bg-[#1E1B26]">
          <ModalHeader className="text-gray-900 dark:text-white">Remove Artist</ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to remove <strong>{selectedArtist?.user?.firstName} {selectedArtist?.user?.lastName}</strong> from the organization?
              This action cannot be undone and they will lose access to organization resources.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onRemoveClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={confirmRemove}
              isLoading={removeMutation.isPending}
            >
              Remove Artist
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}