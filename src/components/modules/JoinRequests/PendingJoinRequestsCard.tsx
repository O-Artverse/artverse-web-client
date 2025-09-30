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
  Check,
  X,
  UserPlus,
} from '@phosphor-icons/react';
import { useOrganizationJoinRequests } from '@/hooks/queries/organization.query';
import { useAcceptJoinRequest, useDeclineJoinRequest } from '@/hooks/mutations/organization.mutation';
import { toast } from 'react-hot-toast';
import type { OrganizationInvitation } from '@/services/organization.service';

interface PendingJoinRequestsCardProps {
  organizationId: string;
}

export default function PendingJoinRequestsCard({
  organizationId,
}: PendingJoinRequestsCardProps) {
  const {
    data: joinRequests,
    isLoading,
  } = useOrganizationJoinRequests(organizationId);

  const acceptMutation = useAcceptJoinRequest();
  const declineMutation = useDeclineJoinRequest();

  const handleAccept = async (request: OrganizationInvitation) => {
    try {
      await acceptMutation.mutateAsync({
        organizationId,
        requestId: request.id,
      });
      toast.success(`${request.invitedBy.firstName} ${request.invitedBy.lastName} has been added to the organization`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to accept join request'
      );
    }
  };

  const handleDecline = async (request: OrganizationInvitation) => {
    try {
      await declineMutation.mutateAsync({
        organizationId,
        requestId: request.id,
      });
      toast.success('Join request declined');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to decline join request'
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

  if (!joinRequests || joinRequests.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <UserPlus size={20} />
        <h3 className="text-lg font-semibold">Pending Join Requests</h3>
        <Chip size="sm" color="warning" variant="flat">
          {joinRequests.length}
        </Chip>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {joinRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-start justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Avatar
                  src={request.invitedBy?.avatar}
                  name={`${request.invitedBy?.firstName} ${request.invitedBy?.lastName}`}
                  size="md"
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {request.invitedBy?.firstName} {request.invitedBy?.lastName}
                    </p>
                    <Chip size="sm" variant="flat" color="primary">
                      Artist
                    </Chip>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    @{request.invitedBy?.username || request.email}
                  </p>
                  {request.message && (
                    <div className="mb-2 p-2 bg-white dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                      &quot;{request.message}&quot;
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Expires in {formatTimeRemaining(request.expiresAt)}
                    </span>
                    <span>
                      • Requested {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  color="success"
                  variant="flat"
                  startContent={<Check size={16} />}
                  onPress={() => handleAccept(request)}
                  isLoading={acceptMutation.isPending}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  startContent={<X size={16} />}
                  onPress={() => handleDecline(request)}
                  isLoading={declineMutation.isPending}
                >
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}