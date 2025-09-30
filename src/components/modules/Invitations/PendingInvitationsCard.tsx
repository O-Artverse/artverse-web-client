'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Chip,
  Button,
  Spinner,
} from '@heroui/react';
import {
  Clock,
  Trash,
  Envelope,
} from '@phosphor-icons/react';
import { useOrganizationInvitations } from '@/hooks/queries/organization.query';
import { useCancelInvitation } from '@/hooks/mutations/organization.mutation';
import { toast } from 'react-hot-toast';
import type { OrganizationInvitation } from '@/services/organization.service';

interface PendingInvitationsCardProps {
  organizationId: string;
}

export default function PendingInvitationsCard({
  organizationId,
}: PendingInvitationsCardProps) {
  const {
    data: invitations,
    isLoading,
  } = useOrganizationInvitations(organizationId);

  const cancelMutation = useCancelInvitation();

  const handleCancel = async (invitation: OrganizationInvitation) => {
    try {
      await cancelMutation.mutateAsync({
        organizationId,
        invitationId: invitation.id,
      });
      toast.success('Invitation cancelled');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to cancel invitation'
      );
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 1) return `${days} days`;
    if (days === 1) return '1 day';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardBody className="flex justify-center py-8">
          <Spinner />
        </CardBody>
      </Card>
    );
  }

  if (!invitations || invitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <Envelope size={20} />
        <h3 className="text-lg font-semibold">Pending Invitations</h3>
        <Chip size="sm" color="warning" variant="flat">
          {invitations.length}
        </Chip>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar
                  src={invitation.invitedUser?.avatar}
                  name={
                    invitation.invitedUser
                      ? `${invitation.invitedUser.firstName} ${invitation.invitedUser.lastName}`
                      : invitation.email
                  }
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {invitation.invitedUser
                        ? `${invitation.invitedUser.firstName} ${invitation.invitedUser.lastName}`
                        : invitation.email}
                    </p>
                    <Chip size="sm" variant="flat" color="primary">
                      {invitation.role}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Expires in {formatTimeRemaining(invitation.expiresAt)}
                    </span>
                    {invitation.invitedBy && (
                      <span>
                        • by {invitation.invitedBy.firstName}{' '}
                        {invitation.invitedBy.lastName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                color="danger"
                variant="light"
                isIconOnly
                onPress={() => handleCancel(invitation)}
                isLoading={cancelMutation.isPending}
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}