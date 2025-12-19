export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  content: string | null;
  cover_image: string | null;
  cover_image_url?: string | null;
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
  photo_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string | null;
  logo_url?: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}
