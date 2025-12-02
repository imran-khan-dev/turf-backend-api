// src/modules/bookings/slotUtils.ts
export type Slot = { start: string; end: string; startISO: string; endISO: string; status?: "AVAILABLE" | "BOOKED" | "PAST" };

import { addMinutes, format, startOfDay, parseISO, isBefore, isAfter } from "date-fns";

/**
 * generateSlotsForDate
 * - startHour and endHour are strings like "08:00", "23:00"
 * - slotDuration in minutes (e.g. 90)
 */
export function generateSlotsForDate(dateISO: string, startHour: string, endHour: string, slotDuration = 90): Slot[] {
  const date = parseISO(dateISO); // dateISO should be "YYYY-MM-DDT00:00:00Z" or "YYYY-MM-DD"
  const dayStart = startOfDay(date);
  const [startH, startM] = startHour.split(":").map(Number);
  const [endH, endM] = endHour.split(":").map(Number);

  const startDate = new Date(dayStart);
  startDate.setHours(startH, startM, 0, 0);

  const endDate = new Date(dayStart);
  endDate.setHours(endH, endM, 0, 0);

  const slots: Slot[] = [];
  let cursor = new Date(startDate);

  while (isBefore(addMinutes(cursor, slotDuration - 0.001), addMinutes(endDate, 0))) {
    const s = new Date(cursor);
    const e = addMinutes(new Date(cursor), slotDuration);
    slots.push({
      start: format(s, "HH:mm"),
      end: format(e, "HH:mm"),
      startISO: s.toISOString(),
      endISO: e.toISOString(),
      status: "AVAILABLE",
    });
    cursor = e;
  }

  // mark past slots based on now
  const now = new Date();
  return slots.map(slot => {
    if (isBefore(parseISO(slot.endISO), now)) return { ...slot, status: "PAST" };
    return slot;
  });
}
