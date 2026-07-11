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

/** Training slots open from 1 August 2026 */
const TRAINING_SLOTS_START = new Date(2026, 7, 1);

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildSlotId(date: string, time: string): string {
  return `${date}T${time}`;
}

export function getTrainingSlotsAnchorDate(fromDate = new Date()): Date {
  const anchor = new Date(TRAINING_SLOTS_START);
  anchor.setHours(0, 0, 0, 0);
  const today = new Date(fromDate);
  today.setHours(0, 0, 0, 0);
  return today > anchor ? today : anchor;
}

export function generateTrainingSlots(fromDate = new Date()): TrainingSlot[] {
  const slots: TrainingSlot[] = [];
  const start = getTrainingSlotsAnchorDate(fromDate);

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
