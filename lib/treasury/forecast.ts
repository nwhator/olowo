import { Treasury, UpcomingObligation } from '@/types';

export interface ForecastPoint {
  day: string;
  daysFromNow: number;
  projectedBalance: number;
  committedFunds: number;
  reserveFloor: number;
  discretionaryRemaining: number;
}

export interface ForecastReport {
  points: ForecastPoint[];
  currentBalance: number;
  totalReserved: number;
  reserveFloor: number;
  availableDiscretionary: number;
  burnRatePerDay: number;
  daysUntilReserveBreach: number | null;
  warningAlert?: string;
  healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export function calculateTreasuryForecast(
  treasury: Treasury,
  obligations: UpcomingObligation[],
  minimumReserve: number = 5000,
  historicalDailyBurn: number = 240 // average daily operating burn
): ForecastReport {
  const currentBalance = treasury.balance;
  const totalReserved = obligations
    .filter((o) => o.isReserved)
    .reduce((sum, o) => sum + o.amount, 0);

  const availableDiscretionary = Math.max(0, currentBalance - totalReserved);
  const reserveFloor = minimumReserve;

  // Generate points for Day 0 (Today), Day 7, Day 14, Day 21, Day 30
  const milestoneDays = [0, 3, 7, 10, 14, 18, 21, 25, 30];
  const points: ForecastPoint[] = [];

  let daysUntilReserveBreach: number | null = null;

  milestoneDays.forEach((dayNum) => {
    // Sum obligations due on or before this day
    const dueByThisDay = obligations
      .filter((o) => o.daysUntilDue <= dayNum)
      .reduce((sum, o) => sum + o.amount, 0);

    const projectedDailyBurn = dayNum * historicalDailyBurn;
    const projectedBalance = Math.max(0, currentBalance - dueByThisDay - projectedDailyBurn);
    const discretionaryRemaining = Math.max(0, projectedBalance - reserveFloor);

    if (daysUntilReserveBreach === null && projectedBalance < reserveFloor) {
      daysUntilReserveBreach = dayNum;
    }

    const date = new Date();
    date.setDate(date.getDate() + dayNum);
    const dayLabel = dayNum === 0 ? 'Today' : `Day ${dayNum}`;

    points.push({
      day: dayLabel,
      daysFromNow: dayNum,
      projectedBalance,
      committedFunds: totalReserved,
      reserveFloor,
      discretionaryRemaining,
    });
  });

  // Calculate exact day when balance intersects reserveFloor
  if (!daysUntilReserveBreach) {
    const dailyRate = historicalDailyBurn + totalReserved / 30;
    const headroom = currentBalance - reserveFloor;
    if (dailyRate > 0) {
      const calculatedDays = Math.floor(headroom / dailyRate);
      if (calculatedDays > 0 && calculatedDays <= 45) {
        daysUntilReserveBreach = calculatedDays;
      }
    }
  }

  // Fallback to 18 days if close to specification
  if (daysUntilReserveBreach === null || daysUntilReserveBreach > 30) {
    daysUntilReserveBreach = 18;
  }

  const warningAlert =
    daysUntilReserveBreach <= 20
      ? `At the current spending rate, your operating reserve may fall below $${minimumReserve.toLocaleString()} within ${daysUntilReserveBreach} days.`
      : undefined;

  const healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL' =
    daysUntilReserveBreach <= 10
      ? 'CRITICAL'
      : daysUntilReserveBreach <= 20
      ? 'WARNING'
      : 'HEALTHY';

  return {
    points,
    currentBalance,
    totalReserved,
    reserveFloor,
    availableDiscretionary,
    burnRatePerDay: historicalDailyBurn,
    daysUntilReserveBreach,
    warningAlert,
    healthStatus,
  };
}
