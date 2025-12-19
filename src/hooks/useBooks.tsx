import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { Book } from '@/types/database';

export function useBooks(categoryId?: string) {
  return useQuery({
    queryKey: ['books', categoryId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryId) {
        params.append('category_id', categoryId);
      }

      const queryString = params.toString();
      const path = `/api/books/${queryString ? `?${queryString}` : ''}`;
      return apiGet<Book[]>(path);
    },
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      try {
        return await apiGet<Book | null>(`/api/books/${id}/`);
      } catch (error: any) {
        if (error?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!id,
  });
}
