import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { Partner } from '@/types/database';

export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const data = await apiGet<Partner[] | { results?: Partner[] }>('/api/partners/');
      const items = Array.isArray(data) ? data : data.results ?? [];
      return items.map((partner) => ({
        ...partner,
        logo: partner.logo_url ?? partner.logo ?? null,
      }));
    },
  });
}
