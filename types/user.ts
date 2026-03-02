export interface User {
  id: string;
  full_name: string;
  profile_image_url: string;
  email: string;
  phone: string | null;
  user_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserResponse {
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  message: string;
}
