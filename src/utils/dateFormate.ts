export function getYearFromSerialDate(serialDate: number): string {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const referenceDate = new Date(1899, 11, 30);
  const targetDate = new Date(
    referenceDate.getTime() + serialDate * millisecondsInDay
  );
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  return `${year}-${month}`;
}
