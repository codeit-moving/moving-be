interface Mover {
  id: number;
  imageUrl: string | null;
  nickname: string;
  career: number;
  introduction: string;
  description: string;
  services: number[];
  regions: number[];
  movingRequest: { id: number }[];
  favorite: { id: number }[];
  _count: { review: number; favorite: number; confirmedQuote: number };
}

interface RatingResult {
  totalCount: number;
  totalSum: number;
  average?: number;
  [key: string]: number | undefined;
}

const processMoversData = (
  movers: Mover[],
  ratingsByMover: Record<number, RatingResult>
) => {
  return movers.map((mover) => {
    const { _count, favorite, ...rest } = mover;

    const isFavorite = favorite.some(
      (favorite) => favorite.id === 1 //나중에 토큰의 검사가 가능할때 업데이트 필요
    );

    const isDesignated = mover.movingRequest.some(
      (request) => request.id === mover.id
    );
    return {
      ...rest,
      isDesignated,
      isFavorite,
      reviewCount: _count.review,
      favoriteCount: _count.favorite,
      confirmCount: _count.confirmedQuote,
      rating: ratingsByMover[mover.id],
    };
  });
};

export default processMoversData;
