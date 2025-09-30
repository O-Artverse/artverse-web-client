import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import organizationService, {
  Organization,
  OrganizationMember,
  OrganizationInvitation,
} from '@/services/organization.service';

// Query Keys
export const organizationKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  list: (filters: any) => [...organizationKeys.lists(), filters] as const,
  details: () => [...organizationKeys.all, 'detail'] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,
  myOrganizations: () => [...organizationKeys.all, 'my-organizations'] as const,
  members: (id: string) => [...organizationKeys.detail(id), 'members'] as const,
  artworks: (id: string) => [...organizationKeys.detail(id), 'artworks'] as const,
  invitations: () => [...organizationKeys.all, 'invitations'] as const,
  myInvitations: () => [...organizationKeys.invitations(), 'my'] as const,
  orgInvitations: (id: string) => [...organizationKeys.detail(id), 'invitations'] as const,
  joinRequests: () => [...organizationKeys.all, 'join-requests'] as const,
  myJoinRequests: () => [...organizationKeys.joinRequests(), 'my'] as const,
  orgJoinRequests: (id: string) => [...organizationKeys.detail(id), 'join-requests'] as const,
};

// Get all organizations with search
export const useOrganizations = (
  params?: {
    search?: string;
    limit?: number;
    offset?: number;
  },
  options?: UseQueryOptions<{
    data: Organization[];
    total: number;
    limit: number;
    offset: number;
  }>,
) => {
  return useQuery({
    queryKey: organizationKeys.list(params),
    queryFn: () => organizationService.getAllOrganizations(params),
    ...options,
  });
};

// Get single organization by ID
export const useOrganization = (
  id: string,
  options?: UseQueryOptions<Organization>,
) => {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => organizationService.getOrganizationById(id),
    enabled: !!id,
    ...options,
  });
};

// Get user's organizations
export const useMyOrganizations = (
  options?: UseQueryOptions<Organization[]>,
) => {
  return useQuery({
    queryKey: organizationKeys.myOrganizations(),
    queryFn: () => organizationService.getMyOrganizations(),
    ...options,
  });
};

// Get organization members
export const useOrganizationMembers = (
  organizationId: string,
  role?: 'OWNER' | 'ADMIN' | 'ARTIST',
  options?: UseQueryOptions<OrganizationMember[]>,
) => {
  return useQuery({
    queryKey: [...organizationKeys.members(organizationId), role],
    queryFn: () => organizationService.getOrganizationMembers(organizationId, role),
    enabled: !!organizationId,
    ...options,
  });
};

// Get organization artworks
export const useOrganizationArtworks = (
  organizationId: string,
  options?: UseQueryOptions<any[]>,
) => {
  return useQuery({
    queryKey: organizationKeys.artworks(organizationId),
    queryFn: () => organizationService.getOrganizationArtworks(organizationId),
    enabled: !!organizationId,
    ...options,
  });
};

// Get user's pending invitations
export const useMyInvitations = (
  options?: Omit<UseQueryOptions<OrganizationInvitation[]>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: organizationKeys.myInvitations(),
    queryFn: () => organizationService.getUserInvitations(),
    ...options,
  });
};

// Get organization's pending invitations (for admins)
export const useOrganizationInvitations = (
  organizationId: string,
  options?: UseQueryOptions<OrganizationInvitation[]>,
) => {
  return useQuery({
    queryKey: organizationKeys.orgInvitations(organizationId),
    queryFn: () => organizationService.getOrganizationInvitations(organizationId),
    enabled: !!organizationId,
    ...options,
  });
};

// ==================== JOIN REQUEST HOOKS ====================

// Get user's own join requests
export const useMyJoinRequests = (
  options?: UseQueryOptions<OrganizationInvitation[]>,
) => {
  return useQuery({
    queryKey: organizationKeys.myJoinRequests(),
    queryFn: () => organizationService.getUserJoinRequests(),
    ...options,
  });
};

// Get organization's pending join requests (for admins)
export const useOrganizationJoinRequests = (
  organizationId: string,
  options?: UseQueryOptions<OrganizationInvitation[]>,
) => {
  return useQuery({
    queryKey: organizationKeys.orgJoinRequests(organizationId),
    queryFn: () => organizationService.getOrganizationJoinRequests(organizationId),
    enabled: !!organizationId,
    ...options,
  });
};