import { useMutation, useQueryClient } from '@tanstack/react-query';
import organizationService, {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  InviteMemberDto,
  UpdateMemberRoleDto,
} from '@/services/organization.service';
import { organizationKeys } from '../queries/organization.query';

// Create organization
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationDto) =>
      organizationService.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.myOrganizations() });
    },
  });
};

// Update organization
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrganizationDto }) =>
      organizationService.updateOrganization(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.myOrganizations() });
    },
  });
};

// Delete organization
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationService.deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.myOrganizations() });
    },
  });
};

// Invite member
export const useInviteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }: {
      organizationId: string;
      data: InviteMemberDto;
    }) => organizationService.inviteMember(organizationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.members(variables.organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.organizationId),
      });
    },
  });
};

// Join organization
export const useJoinOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: string) =>
      organizationService.joinOrganization(organizationId),
    onSuccess: (_, organizationId) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.members(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(organizationId),
      });
      queryClient.invalidateQueries({ queryKey: organizationKeys.myOrganizations() });
    },
  });
};

// Leave organization
export const useLeaveOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: string) =>
      organizationService.leaveOrganization(organizationId),
    onSuccess: (_, organizationId) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.members(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(organizationId),
      });
      queryClient.invalidateQueries({ queryKey: organizationKeys.myOrganizations() });
    },
  });
};

// Remove member
export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      userId,
    }: {
      organizationId: string;
      userId: string;
    }) => organizationService.removeMember(organizationId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.members(variables.organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.organizationId),
      });
    },
  });
};

// Update member role
export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      userId,
      data,
    }: {
      organizationId: string;
      userId: string;
      data: UpdateMemberRoleDto;
    }) => organizationService.updateMemberRole(organizationId, userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.members(variables.organizationId),
      });
    },
  });
};

// Accept invitation
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      organizationService.acceptInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.myInvitations() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.myOrganizations() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
};

// Decline invitation
export const useDeclineInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      organizationService.declineInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.myInvitations() });
    },
  });
};

// Cancel invitation (by admin)
export const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      invitationId,
    }: {
      organizationId: string;
      invitationId: string;
    }) => organizationService.cancelInvitation(organizationId, invitationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.orgInvitations(variables.organizationId),
      });
    },
  });
};

// ==================== JOIN REQUEST MUTATIONS ====================

// Artist requests to join organization
export const useRequestToJoin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      message,
    }: {
      organizationId: string;
      message?: string;
    }) => organizationService.requestToJoin(organizationId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.myJoinRequests() });
    },
  });
};

// Admin accepts join request
export const useAcceptJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      requestId,
    }: {
      organizationId: string;
      requestId: string;
    }) => organizationService.acceptJoinRequest(organizationId, requestId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.orgJoinRequests(variables.organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: organizationKeys.members(variables.organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.organizationId),
      });
    },
  });
};

// Admin declines join request
export const useDeclineJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      requestId,
    }: {
      organizationId: string;
      requestId: string;
    }) => organizationService.declineJoinRequest(organizationId, requestId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.orgJoinRequests(variables.organizationId),
      });
    },
  });
};

// Artist cancels own join request
export const useCancelJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      organizationService.cancelJoinRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.myJoinRequests() });
    },
  });
};