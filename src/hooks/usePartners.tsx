import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { Partner } from '@/types/database';

export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      return apiGet<Partner[]>('/api/partners/');
    },
  });
}
