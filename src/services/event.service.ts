import axiosClient from '@/configs/axios-client';

export interface Event {
  id: string;
  title: string;
  description?: string;
  type: 'EXHIBITION' | 'WORKSHOP' | 'AUCTION' | 'CONFERENCE' | 'MEETUP' | 'OTHER';
  format: 'OFFLINE' | 'ONLINE' | 'HYBRID' | 'THREE_D_VIRTUAL';
  status: 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  location?: string;
  address?: string;
  onlineLink?: string;
  ticketPrice?: number;
  maxAttendees?: number;
  registeredCount: number;
  bannerImage?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  organization: {
    id: string;
    name: string;
    avatar?: string;
  };
  creator: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  _count?: {
    attendees: number;
    artworks?: number;
  };
}

export interface CreateEventDto {
  title: string;
  description?: string;
  type: string;
  format: string;
  status?: string;
  startDate: string;
  endDate: string;
  location?: string;
  address?: string;
  onlineLink?: string;
  ticketPrice?: number;
  maxAttendees?: number;
  bannerImage?: string;
  tags?: string[];
  organizationId: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  format?: string;
  status?: string;
  organizationId?: string;
  search?: string;
  startDateFrom?: string;
  endDateTo?: string;
}

export interface EventsResponse {
  data: Event[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const eventService = {
  // Get all events with filters
  getEvents: async (params?: EventQueryParams): Promise<EventsResponse> => {
    const response = await axiosClient.get('/events', { params });
    return response.data;
  },

  // Get single event by ID
  getEventById: async (id: string): Promise<Event> => {
    const response = await axiosClient.get(`/events/${id}`);
    return response.data;
  },

  // Create new event
  createEvent: async (data: CreateEventDto): Promise<Event> => {
    const response = await axiosClient.post('/events', data);
    return response.data;
  },

  // Update event
  updateEvent: async (id: string, data: UpdateEventDto): Promise<Event> => {
    const response = await axiosClient.patch(`/events/${id}`, data);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: string): Promise<void> => {
    await axiosClient.delete(`/events/${id}`);
  },

  // Register for event
  registerEvent: async (id: string): Promise<any> => {
    const response = await axiosClient.post(`/events/${id}/register`);
    return response.data;
  },

  // Unregister from event
  unregisterEvent: async (id: string): Promise<void> => {
    await axiosClient.delete(`/events/${id}/register`);
  },

  // Get my registered events
  getMyEvents: async (): Promise<any[]> => {
    const response = await axiosClient.get('/events/my-events');
    return response.data;
  },

  // Upload event banner
  uploadBanner: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post('/events/upload-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default eventService;