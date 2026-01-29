export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  timezone: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  dateFormat: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  desktop: boolean;
  digest: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
}

export interface UpdateUserInput {
  fullName?: string;
  avatarUrl?: string | null;
  timezone?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UserWithWorkspaces extends User {
  workspaces: WorkspaceMemberInfo[];
}

export interface WorkspaceMemberInfo {
  workspaceId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
}
