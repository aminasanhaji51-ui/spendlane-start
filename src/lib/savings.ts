export const MINUTES_PER_REPORT_BY_HAND = 12;
export const MINUTES_PER_REPORT_WITH_SPENDLANE = 2;
export const MAX_EMPLOYEES = 5000;
export const MAX_REPORTS_PER_EMPLOYEE = 30;

export function parseCount(value: string, max: number): number | null {
  if (!/^\d+$/.test(value.trim())) {
    return null;
  }
  const count = Number(value);
  return count >= 1 && count <= max ? count : null;
}

export function hoursSavedPerMonth(employees: number, reportsPerEmployee: number): number {
  const minutesSaved =
    employees * reportsPerEmployee * (MINUTES_PER_REPORT_BY_HAND - MINUTES_PER_REPORT_WITH_SPENDLANE);
  return Math.round((minutesSaved / 60) * 10) / 10;
}
