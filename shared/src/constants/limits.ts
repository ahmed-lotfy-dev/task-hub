export const PLAN_LIMITS = {
  free: {
    workspaces: 5,
    membersPerWorkspace: 3,
    cardsPerBoard: 100,
    storagePerWorkspace: 100 * 1024 * 1024, // 100MB
    aiRequestsPerMonth: 0,
    automationRules: 0,
  },
  pro: {
    workspaces: Infinity,
    membersPerWorkspace: Infinity,
    cardsPerBoard: Infinity,
    storagePerWorkspace: 10 * 1024 * 1024 * 1024, // 10GB
    aiRequestsPerMonth: 1000,
    automationRules: 50,
  },
  business: {
    workspaces: Infinity,
    membersPerWorkspace: Infinity,
    cardsPerBoard: Infinity,
    storagePerWorkspace: 100 * 1024 * 1024 * 1024, // 100GB
    aiRequestsPerMonth: 10000,
    automationRules: Infinity,
  },
} as const;

export const DEFAULTS = {
  PAGINATION_LIMIT: 20,
  MAX_PAGINATION_LIMIT: 100,
  MAX_WORKSPACE_NAME_LENGTH: 100,
  MAX_BOARD_NAME_LENGTH: 100,
  MAX_LIST_NAME_LENGTH: 100,
  MAX_CARD_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 10000,
  MAX_COMMENT_LENGTH: 5000,
  MAX_LABEL_NAME_LENGTH: 50,
  MAX_CHECKLIST_TITLE_LENGTH: 100,
  MAX_CHECKLIST_ITEM_LENGTH: 500,
  MAX_ATTACHMENTS_PER_CARD: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;
