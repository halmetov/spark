export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  content: string | null;
  cover_image: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  created_at: string;
  updated_at: string;
}

export type AppRole = 'admin' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}
