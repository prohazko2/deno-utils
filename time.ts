export type MaybeDate = Date | number | null;

export const DAY_START = [0, 0, 0, 0] as [hours: number, min: number, sec: number, ms: number];
export const DAY_END = [23, 59, 59, 999] as [hours: number, min: number, sec: number, ms: number];

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const MONTH = 30 * DAY;
export const YEAR = 12 * MONTH;

export function startOfDay(d?: MaybeDate) {
  const date = new Date(d || Date.now());
  date.setHours(...DAY_START);
  return date;
}

export function endOfDay(d?: MaybeDate) {
  const date = new Date(d || Date.now());
  date.setHours(...DAY_END);
  return date;
}
