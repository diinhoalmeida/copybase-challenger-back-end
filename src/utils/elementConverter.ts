import { GroupedData } from "interfaces/elementsConverterInterfaces";
import { getYearFromSerialDate } from "./dateFormate";

export function convertToSemanticName(parameterName: string): string {
  switch (parameterName) {
    case "periodicidade":
      return "annual";
    case "quantidade cobranças":
      return "billingQuantity";
    case "cobrada a cada X dias":
      return "billingFrequencyInDays";
    case "data início":
      return "startDate";
    case "status":
      return "status";
    case "data status":
      return "statusDate";
    case "valor":
      return "amount";
    case "próximo ciclo":
      return "nextCycle";
    case "ID assinante":
      return "subscriberId";
    default:
      return `${parameterName}`;
  }
}

export function convertToEnglish(status: string) {
  switch (status) {
    case "Ativa":
      return "active";
    case "Atrasada":
      return "delayed";
    case "Cancelada":
      return "canceled";
    case "Trial cancelado":
      return "trialCanceled";
    case "Upgrade":
      return "upgrade";
    default:
      return status;
  }
}

export function obterValoresEspecificosUnicos(data: any[]) {
  if (!data.every(Number.isFinite)) {
    throw new Error('Os valores de "amount" devem ser números válidos');
  }

  const sortedAmounts = data.sort((a, b) => a - b);

  const resultArray = [
    sortedAmounts[0],
    sortedAmounts[sortedAmounts.length - 1],
  ];

  for (let i = 1; i <= 3 && i < sortedAmounts.length - 1; i++) {
    resultArray.push(sortedAmounts[i]);
  }

  return resultArray;
}

export function extractAmount(item: any[]) {
  const uniqueSet = new Set();
  const resultArray = [];

  for (const obj of item) {
    const { amount } = obj;
    const uniqueKey = `${amount}`;

    if (!uniqueSet.has(uniqueKey)) {
      uniqueSet.add(uniqueKey);
      resultArray.push({ amount });
    }
  }

  resultArray.sort((a, b) => a.amount - b.amount);

  if (resultArray.length <= 5) {
    return resultArray;
  }

  const smallest = resultArray[0].amount;
  const largest = resultArray[resultArray.length - 1].amount;
  const step = Math.ceil((largest - smallest) / 4);

  const outputArray = [
    smallest,
    smallest + step,
    smallest + 2 * step,
    smallest + 3 * step,
    largest,
  ];

  const filteredOutputArray = outputArray.filter(
    (num) => num >= smallest && num <= largest
  );

  return filteredOutputArray.map((amount) => ({ amount }));
}

export function extractQuantity(item: any[]) {
  const uniqueSet = new Set();
  const resultArray = [];

  for (const obj of item) {
    const { billingQuantity } = obj;
    const uniqueKey = `${billingQuantity}`;

    if (!uniqueSet.has(uniqueKey)) {
      uniqueSet.add(uniqueKey);
      resultArray.push({ billingQuantity });
    }
  }

  resultArray.sort((a, b) => a.billingQuantity - b.billingQuantity);

  if (resultArray.length <= 5) {
    return resultArray;
  }

  const smallest = resultArray[0].billingQuantity;
  const largest = resultArray[resultArray.length - 1].billingQuantity;
  const step = Math.floor((largest - smallest) / 4);

  const outputArray = [
    smallest,
    smallest + step,
    smallest + 2 * step,
    smallest + 3 * step,
    largest,
  ];

  const filteredOutputArray = outputArray.filter(
    (num) => num >= smallest && num <= largest
  );

  return filteredOutputArray.map((billingQuantity) => ({
    billingQuantity: Math.floor(billingQuantity),
  }));
}

export function groupByMonthYearAndStatus(
  dates: {
    annual: string;
    billingQuantity: number;
    billingFrequencyInDays: number;
    startDate: number;
    status: string;
    statusDate: number;
    amount: number;
    nextCycle: string;
    subscriberId: string;
  }[]
): GroupedData {
  const groups: GroupedData = {};
  const presentYears: number[] = [];
  const presentMonths: number[] = [];

  dates.forEach((obj) => {
    const yearMonth = getYearFromSerialDate(obj.startDate);
    const status = convertToEnglish(obj.status);

    if (!groups[yearMonth]) {
      groups[yearMonth] = {};
    }

    if (!groups[yearMonth][status]) {
      groups[yearMonth][status] = 0;
    }

    groups[yearMonth][status]++;
    const year = parseInt(yearMonth.split("-")[0], 10);
    const month = parseInt(yearMonth.split("-")[1], 10);

    // Adiciona o ano e o mês aos arrays de anos e meses presentes
    if (presentYears.indexOf(year) === -1) {
      presentYears.push(year);
    }
    if (presentMonths.indexOf(month) === -1) {
      presentMonths.push(month);
    }
  });

  // Adiciona meses ausentes com base nos anos e meses presentes
  for (const year of presentYears) {
    for (let month = 1; month <= 12; month++) {
      if (presentMonths.indexOf(month) === -1) {
        const monthKey = `${year}-${month < 10 ? "0" : ""}${month}`;

        if (!groups[monthKey]) {
          groups[monthKey] = {
            active: 0,
            canceled: 0,
            trialCanceled: 0,
            upgrade: 0,
          };
        }
      }
    }
  }

  // Ordena as chaves (datas) em ordem crescente usando objetos Date
  const sortedKeys = Object.keys(groups).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Cria um novo objeto ordenado com base nas chaves
  const sortedGroups: GroupedData = {};
  sortedKeys.forEach((key) => {
    sortedGroups[key] = groups[key];
  });

  return sortedGroups;
}
