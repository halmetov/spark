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
      const data = await apiGet<Book[] | { results?: Book[] }>(path);
      const items = Array.isArray(data) ? data : data.results ?? [];
      return items.map((book) => ({
        ...book,
        cover_image: book.cover_image_url ?? book.cover_image ?? null,
      }));
    },
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      try {
        const book = await apiGet<Book | null>(`/api/books/${id}/`);
        if (!book) return null;
        return {
          ...book,
          cover_image: book.cover_image_url ?? book.cover_image ?? null,
        };
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
