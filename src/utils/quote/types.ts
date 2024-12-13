// types.ts 파일에서 한 번만 정의하고 export
export interface QuoteQueryString {
  limit: number;
  cursor: number | null;
}
