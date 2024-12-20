interface RatingResult {
  totalCount: number;
  totalSum: number;
  average: number;
  [key: string]: number | undefined;
}

export default RatingResult;
