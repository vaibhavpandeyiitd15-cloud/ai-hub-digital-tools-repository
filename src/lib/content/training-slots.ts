export type TrainingSlot = {
  id: string;
  date: string;
  time: string;
  label: string;
  weekdayLabel: string;
  durationMinutes: 30 | 60;
};

const SLOT_TIMES: { time: string; durationMinutes: 30 | 60 }[] = [
  { time: "10:00", durationMinutes: 60 },
  { time: "14:00", durationMinutes: 60 },
  { time: "16:00", durationMinutes: 30 },
];

/** Weekdays when training sessions are offered (Mon–Fri) */
const OFFERED_WEEKDAYS = [1, 2, 3, 4, 5];

const WEEKS_AHEAD = 4;

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildSlotId(date: string, time: string): string {
  return `${date}T${time}`;
}

export function generateTrainingSlots(fromDate = new Date()): TrainingSlot[] {
  const slots: TrainingSlot[] = [];
  const start = new Date(fromDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + WEEKS_AHEAD * 7);

  const cursor = new Date(start);
  cursor.setDate(cursor.getDate() + 1);

  while (cursor <= end) {
    if (OFFERED_WEEKDAYS.includes(cursor.getDay())) {
      const date = formatDateKey(cursor);
      const weekdayLabel = cursor.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
      });

      for (const { time, durationMinutes } of SLOT_TIMES) {
        slots.push({
          id: buildSlotId(date, time),
          date,
          time,
          weekdayLabel,
          label: `${weekdayLabel} · ${time}`,
          durationMinutes,
        });
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return slots;
}

export function getAvailableTrainingSlots(fromDate = new Date()): TrainingSlot[] {
  return generateTrainingSlots(fromDate);
}

export function findTrainingSlot(date: string, time: string): TrainingSlot | undefined {
  const id = buildSlotId(date, time);
  return getAvailableTrainingSlots().find((slot) => slot.id === id);
}

export function isValidTrainingSlot(date: string, time: string): boolean {
  return Boolean(findTrainingSlot(date, time));
}

export function groupTrainingSlotsByDate(
  slots: TrainingSlot[],
): { date: string; weekdayLabel: string; slots: TrainingSlot[] }[] {
  const map = new Map<string, { date: string; weekdayLabel: string; slots: TrainingSlot[] }>();

  for (const slot of slots) {
    if (!map.has(slot.date)) {
      map.set(slot.date, { date: slot.date, weekdayLabel: slot.weekdayLabel, slots: [] });
    }
    map.get(slot.date)!.slots.push(slot);
  }

  return [...map.values()];
}
