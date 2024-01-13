export interface GroupedData {
  [yearMonth: string]: {
    [status: string]: number;
  };
}
