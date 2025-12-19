import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { Category } from '@/types/database';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return apiGet<Category[]>('/api/categories/');
    },
  });
}
