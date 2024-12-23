export interface ReviewCreateData {
  confirmedQuoteId: number;
  moverId: number;
  rating: number;
  content: string;
  imageUrl?: string[];
}

export interface ReviewQuery {
  pageSize?: number;
  pageNum?: number;
}
