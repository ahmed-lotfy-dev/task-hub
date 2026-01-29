import {
  format,
  formatDistanceToNow,
  isPast,
  isFuture,
  addDays,
  addHours,
  startOfDay,
  endOfDay,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  parseISO,
  isValid,
} from 'date-fns';

// Re-export commonly used date-fns functions
export {
  format,
  formatDistanceToNow,
  isPast,
  isFuture,
  addDays,
  addHours,
  startOfDay,
  endOfDay,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  parseISO,
  isValid,
};

// Common format patterns
export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd',
  ISO_WITH_TIME: 'yyyy-MM-dd HH:mm:ss',
  DISPLAY: 'MMM d, yyyy',
  DISPLAY_WITH_TIME: 'MMM d, yyyy h:mm a',
  SHORT: 'MMM d',
  TIME: 'h:mm a',
  RELATIVE: 'relative',
} as const;

/**
 * Format a date string or Date object to a display format
 */
export function formatDate(
  date: string | Date,
  pattern: string = DATE_FORMATS.DISPLAY
): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 'Invalid date';
  return format(d, pattern);
}

/**
 * Format a date to relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 'Invalid date';
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Format a date for display in the UI with fallback for invalid dates
 */
export function formatDisplayDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  return format(d, DATE_FORMATS.DISPLAY);
}

/**
 * Check if a date is overdue (in the past)
 */
export function isOverdue(date: string | Date): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return false;
  return isPast(d);
}

/**
 * Check if a date is due soon (within specified hours)
 */
export function isDueSoon(date: string | Date, hours: number = 24): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return false;
  const now = new Date();
  const soon = addHours(now, hours);
  return d > now && d <= soon;
}

/**
 * Get the number of days until a date (negative if overdue)
 */
export function daysUntil(date: string | Date): number {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 0;
  return differenceInDays(d, new Date());
}

/**
 * Get due date status for cards/tasks
 */
export type DueDateStatus = 'overdue' | 'due-soon' | 'upcoming' | 'completed';

export function getDueDateStatus(
  dueDate: string | Date | null | undefined,
  completed: boolean = false
): DueDateStatus | null {
  if (!dueDate || completed) return null;

  const d = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  if (!isValid(d)) return null;

  if (isPast(d)) return 'overdue';
  if (isDueSoon(d, 24)) return 'due-soon';
  return 'upcoming';
}

/**
 * Format a date range (start to end)
 */
export function formatDateRange(
  startDate: string | Date,
  endDate: string | Date
): string {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  if (!isValid(start) || !isValid(end)) return 'Invalid date range';

  const sameMonth = format(start, 'yyyy-MM') === format(end, 'yyyy-MM');
  const sameYear = format(start, 'yyyy') === format(end, 'yyyy');

  if (sameMonth) {
    return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
  }
  if (sameYear) {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  }
  return `${format(start, DATE_FORMATS.DISPLAY)} - ${format(end, DATE_FORMATS.DISPLAY)}`;
}

/**
 * Get the start of today
 */
export function today(): Date {
  return startOfDay(new Date());
}

/**
 * Get the end of today
 */
export function endOfToday(): Date {
  return endOfDay(new Date());
}

/**
 * Add days to today
 */
export function fromNow(days: number): Date {
  return addDays(new Date(), days);
}
