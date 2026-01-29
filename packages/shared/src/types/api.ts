export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: ApiMeta;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface BoardQueryParams extends QueryParams {
  archived?: boolean;
  visibility?: 'private' | 'team' | 'public';
}

export interface CardQueryParams extends QueryParams {
  listId?: string;
  assigneeId?: string;
  labelId?: string;
  dueBefore?: string;
  dueAfter?: string;
  priority?: 'low' | 'medium' | 'high';
  archived?: boolean;
}

// Real-time events
export type RealtimeEvent =
  | { type: 'card:created'; payload: { card: import('./card.js').Card; listId: string } }
  | { type: 'card:updated'; payload: { card: import('./card.js').Card; changes: Partial<import('./card.js').Card> } }
  | { type: 'card:moved'; payload: { cardId: string; fromListId: string; toListId: string; position: number } }
  | { type: 'card:deleted'; payload: { cardId: string; listId: string } }
  | { type: 'list:created'; payload: { list: import('./list.js').List } }
  | { type: 'list:updated'; payload: { list: import('./list.js').List } }
  | { type: 'list:moved'; payload: { listId: string; position: number } }
  | { type: 'list:deleted'; payload: { listId: string } }
  | { type: 'user:joined'; payload: { userId: string; boardId: string } }
  | { type: 'user:left'; payload: { userId: string; boardId: string } };
