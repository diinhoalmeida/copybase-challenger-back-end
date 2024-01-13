export function getYearFromSerialDate(serialDate: number): string {
  const dateObject = new Date((serialDate - 25569) * 86400 * 1000);
  const year = dateObject.getUTCFullYear();
  const month = dateObject.getUTCMonth() + 1; // Meses em JavaScript são indexados de 0 a 11

  return `${year}-${month < 10 ? "0" : ""}${month}`;
}

export function fillMissingYearsAndMonths(
  monthlyRevenueMap: Record<string, number>,
  baseYear: number | null
): Record<string, number> {
  if (baseYear === null) {
    // Se não tivermos um ano base, retornamos o mapa como está
    return monthlyRevenueMap;
  }

  const filledMap: Record<string, number> = {};

  // Preencher com valores zero para todos os anos e meses de 1 a 12
  for (let year = baseYear; year <= baseYear; year++) {
    for (let month = 1; month <= 12; month++) {
      const yearMonth = `${year}-${month < 10 ? "0" : ""}${month}`;

      if (monthlyRevenueMap[yearMonth] !== undefined) {
        filledMap[yearMonth] = monthlyRevenueMap[yearMonth];
      } else {
        filledMap[yearMonth] = 0;
      }
    }
  }

  return filledMap;
}
