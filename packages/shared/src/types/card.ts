export interface Card {
  commentCount: number;
  id: string;
  listId: string;
  boardId: string;
  title: string;
  description: string | null;
  descriptionHtml: string | null;
  position: number;
  coverImage: string | null;
  dueDate: string | null;
  startDate: string | null;
  priority: 'low' | 'medium' | 'high' | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CardAssignee {
  cardId: string;
  userId: string;
  user?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export interface CardLabel {
  cardId: string;
  labelId: string;
  label?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface CardComment {
  id: string;
  cardId: string;
  userId: string;
  content: string;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export interface CardAttachment {
  id: string;
  cardId: string;
  name: string;
  url: string;
  type: 'file' | 'image' | 'link';
  size: number | null;
  createdAt: string;
  createdBy: string;
}

export interface Checklist {
  id: string;
  cardId: string;
  title: string;
  position: number;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  checklistId: string;
  content: string;
  completed: boolean;
  position: number;
  assignedTo: string | null;
  dueDate: string | null;
  completedAt: string | null;
}



export interface CardWithDetails extends Card {
  assignees: CardAssignee[];
  labels: CardLabel[];
  comments: CardComment[];
  attachments: CardAttachment[];
  checklists: ChecklistWithItems[];
}

export interface ChecklistWithItems extends Checklist {
  items: ChecklistItem[];
}
