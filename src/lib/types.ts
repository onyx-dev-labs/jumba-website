export interface SiteSettings {
  id: number;
  company_name: string;
  logo_url: string | null;
  owner_name: string;
  owner_role: string;
  owner_bio: string;
  owner_image_url: string | null;
  primary_color: string;
  phone_primary: string;
  email_primary: string;
  address: string;
  hero_bg_type?: 'image' | 'color';
  hero_bg_value?: string;
  hero_blur?: number;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
}
