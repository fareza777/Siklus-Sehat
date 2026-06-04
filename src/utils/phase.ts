import { CycleDay, Phase, UserProfile } from "@/models";
import { addDays, diffDays, todayISO } from "@/utils/date";

export type CyclePrediction = {
  cycleDay: number;
  phase: Phase;
  nextPeriod: string;
  ovulationDate: string;
  fertileWindow: string[];
  assumptions: string[];
};

export function averageCycleLength(profile: UserProfile, cycleDays: CycleDay[]): number {
  const starts = cycleDays
    .filter((day) => day.period === "start")
    .map((day) => day.date)
    .sort();

  if (starts.length >= 2) {
    const recent = starts.slice(-4);
    const lengths = recent.slice(1).map((date, index) => diffDays(recent[index], date));
    const valid = lengths.filter((length) => length >= 21 && length <= 45);
    if (valid.length > 0) {
      return Math.round(valid.reduce((sum, length) => sum + length, 0) / valid.length);
    }
  }

  return profile.averageCycleLength || 28;
}

export function latestPeriodStart(profile: UserProfile, cycleDays: CycleDay[]): string {
  const logged = cycleDays.filter((day) => day.period === "start").map((day) => day.date).sort();
  return logged.at(-1) || profile.lastPeriodStart;
}

export function phaseForCycleDay(cycleDay: number, cycleLength: number): Phase {
  const ovulationDay = Math.max(11, cycleLength - 14);
  if (cycleDay <= 5) return "menstrual";
  if (cycleDay >= ovulationDay - 1 && cycleDay <= ovulationDay + 1) return "ovulation";
  if (cycleDay < ovulationDay - 1) return "follicular";
  return "luteal";
}

export function getCyclePrediction(profile: UserProfile, cycleDays: CycleDay[], date = todayISO()): CyclePrediction {
  const length = averageCycleLength(profile, cycleDays);
  const lastStart = latestPeriodStart(profile, cycleDays);
  const rawDay = diffDays(lastStart, date) + 1;
  const normalizedDay = ((rawDay - 1) % length + length) % length + 1;
  const cycleStart = addDays(date, -(normalizedDay - 1));
  const nextPeriod = addDays(cycleStart, length);
  const ovulationOffset = Math.max(10, length - 14) - 1;
  const ovulationDate = addDays(cycleStart, ovulationOffset);
  const fertileWindow = Array.from({ length: 6 }, (_, index) => addDays(ovulationDate, index - 5));
  const assumptions = [
    "Prediksi memakai metode kalender sederhana.",
    "Jika riwayat kurang dari 2 start menstruasi, panjang siklus memakai input awal atau asumsi 28 hari.",
    "Ovulasi diasumsikan terjadi sekitar 14 hari sebelum menstruasi berikutnya."
  ];

  return {
    cycleDay: normalizedDay,
    phase: phaseForCycleDay(normalizedDay, length),
    nextPeriod,
    ovulationDate,
    fertileWindow,
    assumptions
  };
}

export function phaseLabel(phase: Phase): string {
  return {
    menstrual: "Menstrual",
    follicular: "Follicular",
    ovulation: "Ovulation",
    luteal: "Luteal"
  }[phase];
}

export function phaseInsight(phase: Phase): string {
  return {
    menstrual: "Fokus zat besi dan Vitamin C untuk bantu energi saat perdarahan.",
    follicular: "Naikkan protein dan karbo kompleks untuk mendukung energi stabil.",
    ovulation: "Pilih antioksidan dan zinc untuk mendukung fase subur.",
    luteal: "Tambahkan magnesium dan karbo kompleks untuk bantu craving dan PMS."
  }[phase];
}
