export interface ActivityLogProperty {
  old?: Record<string, any> | null;
  new?: Record<string, any> | null;
  [key: string]: any;
}

export interface ActivityLogUser {
  id: string;
  full_name: string;
  profile_image_url: string;
  email: string;
  phone: string | null;
  user_type: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  description: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  subject_id: string;
  subject_type: string;
  properties: ActivityLogProperty;
  user: ActivityLogUser;
}

export interface ActivityLogResponse {
  data: ActivityLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  message: string;
}

export interface SingleActivityLogResponse {
  data: ActivityLog;
  message: string;
}
