export interface MacroTotals {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  costDh: number;
}

export interface MealOption {
  id: string;
  title: string;
  details: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  costDh: number;
  tag: string;
}

export function calculateBmi(weightKg: number, heightCm = 164): number {
  const heightM = heightCm / 100;
  if (heightM <= 0 || weightKg <= 0) return 0;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export function calculateWeightProgress(
  currentWeight: number,
  startWeight = 76.0,
  goalWeight = 60.0,
): {
  lostKg: number;
  remainingKg: number;
  progressPercent: number;
  currentBmi: number;
  goalBmi: number;
} {
  const totalToLose = startWeight - goalWeight;
  const rawLost = startWeight - currentWeight;
  const lostKg = Number(Math.max(0, rawLost).toFixed(1));
  const remainingKg = Number(Math.max(0, currentWeight - goalWeight).toFixed(1));
  const rawPct = totalToLose > 0 ? ((startWeight - currentWeight) / totalToLose) * 100 : 100;
  const progressPercent = Math.min(100, Math.max(0, Math.round(rawPct)));
  return {
    lostKg,
    remainingKg,
    progressPercent,
    currentBmi: calculateBmi(currentWeight, 164),
    goalBmi: calculateBmi(goalWeight, 164),
  };
}

export function calculateDailyMacros(selectedOptions: MealOption[]): MacroTotals {
  return selectedOptions.reduce(
    (acc, opt) => ({
      protein: acc.protein + opt.protein,
      carbs: acc.carbs + opt.carbs,
      fats: acc.fats + opt.fats,
      calories: acc.calories + opt.calories,
      costDh: Number((acc.costDh + opt.costDh).toFixed(1)),
    }),
    { protein: 0, carbs: 0, fats: 0, calories: 0, costDh: 0 },
  );
}

export function calculateWhr(waistCm: number, hipsCm: number): {
  ratio: number;
  status: string;
} {
  if (waistCm <= 0 || hipsCm <= 0) {
    return { ratio: 0, status: 'غير محدد' };
  }
  const ratio = Number((waistCm / hipsCm).toFixed(2));
  let status = 'تناسق الساعة الرملية ممتاز (Athletic Hourglass)';
  if (ratio > 0.8) {
    status = 'في طور النحت — كملي تمارين Vacuum واللاتس';
  } else if (ratio <= 0.72) {
    status = 'خصر منحوت وتناسق مثالي جداً';
  }
  return { ratio, status };
}

export function projectTimeline(
  currentWeight: number,
  goalWeight: number,
  weeklyRateKg: number,
): {
  totalWeeks: number;
  week4Weight: number;
  week8Weight: number;
  week14Weight: number;
  goalWeight: number;
} {
  const safeRate = Math.max(0.3, Math.min(1.2, weeklyRateKg));
  const diff = Math.max(0, currentWeight - goalWeight);
  const totalWeeks = Math.max(1, Math.ceil(diff / safeRate));
  const atWeek = (w: number) =>
    Number(Math.max(goalWeight, currentWeight - safeRate * w).toFixed(1));
  return {
    totalWeeks,
    week4Weight: atWeek(4),
    week8Weight: atWeek(8),
    week14Weight: atWeek(14),
    goalWeight: Number(goalWeight.toFixed(1)),
  };
}
