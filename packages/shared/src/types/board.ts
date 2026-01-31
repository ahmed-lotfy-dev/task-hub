export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  visibility: 'private' | 'team' | 'public';
  background: BoardBackground;
  template: BoardTemplate | null;
  settings: BoardSettings;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BoardTemplate = 'kanban' | 'scrum' | 'simple' | 'bug_tracker' | 'blank';

export interface BoardBackground {
  type: 'color' | 'image' | 'gradient';
  value: string;
}

export interface BoardSettings {
  allowComments: boolean;
  allowReactions: boolean;
  cardCoverImages: boolean;
  showCardId: boolean;
}

export interface BoardLabel {
  id: string;
  boardId: string;
  name: string;
  color: string;
  createdAt: string;
}



export interface BoardWithLists extends Board {
  lists: ListSummary[];
}

export interface ListSummary {
  id: string;
  name: string;
  position: number;
  cardCount: number;
}
