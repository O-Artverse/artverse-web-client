'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Avatar,
  Chip,
  Spinner,
} from '@heroui/react';
import {
  Check,
  X,
  Buildings,
  Users,
  Clock,
  Envelope,
} from '@phosphor-icons/react';
import { useMyInvitations } from '@/hooks/queries/organization.query';
import {
  useAcceptInvitation,
  useDeclineInvitation,
} from '@/hooks/mutations/organization.mutation';
import { toast } from 'react-hot-toast';
import type { OrganizationInvitation } from '@/services/organization.service';

interface InvitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InvitationsModal({
  isOpen,
  onClose,
}: InvitationsModalProps) {
  const { data: invitations, isLoading } = useMyInvitations({
    enabled: isOpen,
  });

  const acceptMutation = useAcceptInvitation();
  const declineMutation = useDeclineInvitation();

  const handleAccept = async (invitation: OrganizationInvitation) => {
    try {
      await acceptMutation.mutateAsync(invitation.id);
      toast.success(`Joined ${invitation.organization.name} successfully!`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to accept invitation'
      );
    }
  };

  const handleDecline = async (invitation: OrganizationInvitation) => {
    try {
      await declineMutation.mutateAsync(invitation.id);
      toast.success('Invitation declined');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to decline invitation'
      );
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 1) return `${days} days remaining`;
    if (days === 1) return '1 day remaining';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 1) return `${hours} hours remaining`;
    return 'Expires soon';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Envelope size={24} />
          Organization Invitations
          {invitations && invitations.length > 0 && (
            <Chip size="sm" color="primary" variant="flat">
              {invitations.length}
            </Chip>
          )}
        </ModalHeader>
        <ModalBody className="py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : invitations && invitations.length > 0 ? (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <Card key={invitation.id} className="border">
                  <CardBody className="p-4">
                    {/* Organization Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar
                        src={invitation.organization.avatar}
                        name={invitation.organization.name}
                        size="lg"
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {invitation.organization.name}
                          </h3>
                          <Chip
                            size="sm"
                            color="primary"
                            variant="flat"
                            startContent={
                              invitation.role === 'ADMIN' ? (
                                <Buildings size={14} />
                              ) : (
                                <Users size={14} />
                              )
                            }
                          >
                            {invitation.role}
                          </Chip>
                        </div>

                        {invitation.organization.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {invitation.organization.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {invitation.organization._count?.members || 0}{' '}
                            members
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatTimeRemaining(invitation.expiresAt)}
                          </span>
                        </div>

                        {/* Invited By */}
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar
                            src={invitation.invitedBy.avatar}
                            name={`${invitation.invitedBy.firstName} ${invitation.invitedBy.lastName}`}
                            size="sm"
                          />
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Invited by{' '}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {invitation.invitedBy.firstName}{' '}
                              {invitation.invitedBy.lastName}
                            </span>
                          </div>
                        </div>

                        {/* Personal Message */}
                        {invitation.message && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                            <p className="text-sm text-blue-900 dark:text-blue-100 italic">
                              "{invitation.message}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        color="primary"
                        startContent={<Check size={16} weight="bold" />}
                        onPress={() => handleAccept(invitation)}
                        isLoading={acceptMutation.isPending}
                        className="flex-1"
                      >
                        Accept
                      </Button>
                      <Button
                        color="danger"
                        variant="flat"
                        startContent={<X size={16} weight="bold" />}
                        onPress={() => handleDecline(invitation)}
                        isLoading={declineMutation.isPending}
                        className="flex-1"
                      >
                        Decline
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Envelope size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Invitations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have any pending organization invitations.
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}