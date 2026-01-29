export interface List {
  id: string;
  boardId: string;
  name: string;
  position: number;
  wipLimit: number | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListInput {
  name: string;
  wipLimit?: number;
}

export interface UpdateListInput {
  name?: string;
  wipLimit?: number | null;
  archived?: boolean;
}

export interface MoveListInput {
  position: number;
}

export interface ListWithCards extends List {
  cards: CardSummary[];
}

export interface CardSummary {
  id: string;
  title: string;
  description: string | null;
  position: number;
  coverImage: string | null;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high' | null;
  labelIds: string[];
  assigneeIds: string[];
  commentCount: number;
  attachmentCount: number;
  checklistProgress: {
    total: number;
    completed: number;
  } | null;
}
