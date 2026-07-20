import { format } from 'date-fns';

/** 'YYYY-MM-DD' in device-local time. Streaks/correlations key off this,
 *  never UTC, so evening loggers don't roll into the next day. */
export function toLogDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function todayLogDate(): string {
  return toLogDate(new Date());
}

export function nowISO(): string {
  return new Date().toISOString();
}
