import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { Category } from '@/types/database';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await apiGet<Category[] | { results?: Category[] }>('/api/categories/');
      return Array.isArray(data) ? data : data.results ?? [];
    },
  });
}
