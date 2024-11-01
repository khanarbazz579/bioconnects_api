export interface CanCurrentUser {
  user_id: number;
  user_name: string;
  roles: string[];
  permissions: string[];
  status: 'active' | 'inactive';
  email?: string;
}

export interface CanCurrentUserToken {
  token: string;
}
