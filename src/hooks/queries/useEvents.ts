import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import eventService, { EventQueryParams, CreateEventDto, UpdateEventDto } from '@/services/event.service';
import { toast } from 'react-hot-toast';

// Query keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params?: EventQueryParams) => [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  myEvents: () => [...eventKeys.all, 'my-events'] as const,
};

// Get all events with filters
export const useEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventService.getEvents(params),
  });
};

// Get single event by ID
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
  });
};

// Get my registered events
export const useMyEvents = () => {
  return useQuery({
    queryKey: eventKeys.myEvents(),
    queryFn: () => eventService.getMyEvents(),
  });
};

// Create event mutation
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventDto) => eventService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      toast.success('Event created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create event');
    },
  });
};

// Update event mutation
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventDto }) =>
      eventService.updateEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.id) });
      toast.success('Event updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update event');
    },
  });
};

// Delete event mutation
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      toast.success('Event deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete event');
    },
  });
};

// Register for event mutation
export const useRegisterEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.registerEvent(id),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.myEvents() });
      toast.success('Registered for event successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to register for event');
    },
  });
};

// Unregister from event mutation
export const useUnregisterEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.unregisterEvent(id),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.myEvents() });
      toast.success('Unregistered from event successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to unregister from event');
    },
  });
};