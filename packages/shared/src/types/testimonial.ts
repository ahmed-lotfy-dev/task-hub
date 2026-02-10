export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  role?: string | null;
  company?: string | null;
  avatarUrl?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}
