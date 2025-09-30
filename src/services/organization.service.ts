import axiosClient from '@/configs/axios-client';

export interface Organization {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  _count: {
    members: number;
    artworks: number;
  };
  memberRole?: string;
  joinedAt?: string;
}

export interface OrganizationMember {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'ARTIST';
  joinedAt: string;
  updatedAt: string;
  organizationId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
    description?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    artworkCount?: number;
  };
}

export interface CreateOrganizationDto {
  name: string;
  description?: string;
  avatar?: string;
  website?: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
  avatar?: string;
  website?: string;
  isActive?: boolean;
}

export interface InviteMemberDto {
  email: string;
  role?: 'ADMIN' | 'ARTIST';
  message?: string;
}

export interface UpdateMemberRoleDto {
  role: 'ADMIN' | 'ARTIST';
}

export interface OrganizationInvitation {
  id: string;
  type: 'INVITATION' | 'JOIN_REQUEST';
  email: string;
  role: 'OWNER' | 'ADMIN' | 'ARTIST';
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  organization: {
    id: string;
    name: string;
    avatar?: string;
    description?: string;
    owner?: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    _count?: {
      members: number;
      artworks: number;
    };
  };
  invitedById: string;
  invitedBy: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  invitedUserId?: string;
  invitedUser?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
}

const organizationService = {
  // Organization CRUD
  async createOrganization(data: CreateOrganizationDto): Promise<Organization> {
    const response = await axiosClient.post('/organizations', data);
    return response.data;
  },

  async getAllOrganizations(params?: {
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    data: Organization[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const response = await axiosClient.get('/organizations', { params });
    return response.data;
  },

  async getOrganizationById(id: string): Promise<Organization> {
    const response = await axiosClient.get(`/organizations/${id}`);
    return response.data;
  },

  async updateOrganization(
    id: string,
    data: UpdateOrganizationDto,
  ): Promise<Organization> {
    const response = await axiosClient.patch(`/organizations/${id}`, data);
    return response.data;
  },

  async deleteOrganization(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(`/organizations/${id}`);
    return response.data;
  },

  async getMyOrganizations(): Promise<Organization[]> {
    const response = await axiosClient.get('/organizations/my-organizations');
    return response.data;
  },

  // Member Management
  async getOrganizationMembers(
    organizationId: string,
    role?: 'OWNER' | 'ADMIN' | 'ARTIST',
  ): Promise<OrganizationMember[]> {
    const response = await axiosClient.get(
      `/organizations/${organizationId}/members`,
      { params: { role } },
    );
    return response.data;
  },

  async inviteMember(
    organizationId: string,
    data: InviteMemberDto,
  ): Promise<OrganizationMember> {
    const response = await axiosClient.post(
      `/organizations/${organizationId}/members/invite`,
      data,
    );
    return response.data;
  },

  async joinOrganization(organizationId: string): Promise<OrganizationMember> {
    const response = await axiosClient.post(
      `/organizations/${organizationId}/members/join`,
    );
    return response.data;
  },

  async leaveOrganization(organizationId: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(
      `/organizations/${organizationId}/members/leave`,
    );
    return response.data;
  },

  async removeMember(
    organizationId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const response = await axiosClient.delete(
      `/organizations/${organizationId}/members/${userId}`,
    );
    return response.data;
  },

  async updateMemberRole(
    organizationId: string,
    userId: string,
    data: UpdateMemberRoleDto,
  ): Promise<OrganizationMember> {
    const response = await axiosClient.patch(
      `/organizations/${organizationId}/members/${userId}/role`,
      data,
    );
    return response.data;
  },

  // Artworks
  async getOrganizationArtworks(organizationId: string): Promise<any[]> {
    const response = await axiosClient.get(
      `/organizations/${organizationId}/artworks`,
    );
    return response.data;
  },

  // Invitations
  async getUserInvitations(): Promise<OrganizationInvitation[]> {
    const response = await axiosClient.get('/organizations/invitations/my-invitations');
    return response.data;
  },

  async getOrganizationInvitations(
    organizationId: string,
  ): Promise<OrganizationInvitation[]> {
    const response = await axiosClient.get(
      `/organizations/${organizationId}/invitations`,
    );
    return response.data;
  },

  async acceptInvitation(invitationId: string): Promise<OrganizationMember> {
    const response = await axiosClient.post(
      `/organizations/invitations/${invitationId}/accept`,
    );
    return response.data;
  },

  async declineInvitation(invitationId: string): Promise<{ message: string }> {
    const response = await axiosClient.post(
      `/organizations/invitations/${invitationId}/decline`,
    );
    return response.data;
  },

  async cancelInvitation(
    organizationId: string,
    invitationId: string,
  ): Promise<{ message: string }> {
    const response = await axiosClient.delete(
      `/organizations/${organizationId}/invitations/${invitationId}`,
    );
    return response.data;
  },

  // ==================== JOIN REQUEST METHODS ====================

  // Artist requests to join an organization
  async requestToJoin(
    organizationId: string,
    message?: string,
  ): Promise<OrganizationInvitation> {
    const response = await axiosClient.post(
      `/organizations/${organizationId}/join-request`,
      { message },
    );
    return response.data;
  },

  // Get user's own join requests
  async getUserJoinRequests(): Promise<OrganizationInvitation[]> {
    const response = await axiosClient.get('/organizations/join-requests/my-requests');
    return response.data;
  },

  // Get organization's pending join requests (admin)
  async getOrganizationJoinRequests(
    organizationId: string,
  ): Promise<OrganizationInvitation[]> {
    const response = await axiosClient.get(
      `/organizations/${organizationId}/join-requests`,
    );
    return response.data;
  },

  // Admin accepts join request
  async acceptJoinRequest(
    organizationId: string,
    requestId: string,
  ): Promise<OrganizationMember> {
    const response = await axiosClient.post(
      `/organizations/${organizationId}/join-requests/${requestId}/accept`,
    );
    return response.data;
  },

  // Admin declines join request
  async declineJoinRequest(
    organizationId: string,
    requestId: string,
  ): Promise<{ message: string }> {
    const response = await axiosClient.post(
      `/organizations/${organizationId}/join-requests/${requestId}/decline`,
    );
    return response.data;
  },

  // Artist cancels own join request
  async cancelJoinRequest(requestId: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(
      `/organizations/join-requests/${requestId}`,
    );
    return response.data;
  },
};

export default organizationService;