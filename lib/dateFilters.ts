import {
  startOfToday,
  endOfToday,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export function getDateRange(filter?: string) {
  const now = new Date();

  switch (filter) {
    case "today":
      return {
        from: startOfToday(),
        to: endOfToday(),
      };

    case "tomorrow":
      const tomorrow = addDays(now, 1);
      return {
        from: new Date(tomorrow.setHours(0, 0, 0, 0)),
        to: new Date(tomorrow.setHours(23, 59, 59, 999)),
      };

    case "week":
      return {
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      };

    case "month":
      return {
        from: startOfMonth(now),
        to: endOfMonth(now),
      };

    default:
      return null;
  }
}