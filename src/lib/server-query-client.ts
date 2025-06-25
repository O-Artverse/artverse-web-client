import { cache } from 'react';
import { QueryClient } from '@tanstack/react-query';

export const serverQueryClient = cache(() => new QueryClient());
