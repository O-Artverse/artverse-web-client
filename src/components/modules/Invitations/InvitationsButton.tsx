'use client';

import { Button, Badge, useDisclosure } from '@heroui/react';
import { Envelope } from '@phosphor-icons/react';
import { useMyInvitations } from '@/hooks/queries/organization.query';
import InvitationsModal from './InvitationsModal';

export default function InvitationsButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: invitations } = useMyInvitations({
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const invitationCount = invitations?.length || 0;

  return (
    <>
      <Badge
        content={invitationCount}
        color="danger"
        isInvisible={invitationCount === 0}
        shape="circle"
      >
        <Button
          isIconOnly
          variant="light"
          onPress={onOpen}
          aria-label="Organization Invitations"
        >
          <Envelope size={24} weight={invitationCount > 0 ? 'fill' : 'regular'} />
        </Button>
      </Badge>

      <InvitationsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}