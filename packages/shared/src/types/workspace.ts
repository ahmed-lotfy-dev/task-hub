export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: 'private' | 'team' | 'public';
  ownerId: string;
  settings: WorkspaceSettings;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  role?: 'owner' | 'admin' | 'member' | 'guest';
}

export interface WorkspaceSettings {
  allowGuests: boolean;
  defaultBoardVisibility: 'private' | 'team' | 'public';
  enableTimeTracking: boolean;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joinedAt: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: 'admin' | 'member' | 'guest';
  token: string;
  expiresAt: string;
  createdAt: string;
}


