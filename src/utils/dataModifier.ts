import {
  convertToEnglish,
  extractAmount,
  extractQuantity,
} from "./elementConverter";

export function countSubscribersByStatus(data: any[]) {
  const statusCounts: { [status: string]: number } = {};

  data.forEach((subscriber: { status: string }) => {
    const status = convertToEnglish(subscriber.status);
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  return statusCounts;
}

export function stackedBarChartFrequency(data: any[]) {
  if (!data || !Array.isArray(data)) {
    throw new Error("Formato de dados inválido");
  }

  const amounts = extractAmount(data);
  const quantities = extractQuantity(data);

  return { amounts, quantities };
}
