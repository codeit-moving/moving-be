import RatingResult from "./interfaces/mover/ratingResult";

interface Mover {
  id: number;
  imageUrl: string | null;
  nickname: string;
  career: number;
  introduction?: string;
  description?: string;
  services?: number[];
  regions?: number[];
  movingRequest: { id: number }[];
  favorite: { id: number }[];
  _count: { review: number; favorite: number; confirmedQuote: number };
}

const processMoversData = (
  customerId: number | null,
  movers: Mover[] | Mover,
  ratingsByMover: Record<number, RatingResult>
) => {
  const moverIdArray = Array.isArray(movers) ? movers : [movers];
  return moverIdArray.map((mover) => {
    const { _count, favorite, movingRequest, ...rest } = mover;

    const isFavorite = favorite.some(
      (favorite) => (favorite.id === customerId ? customerId : null) //나중에 토큰의 검사가 가능할때 업데이트 필요
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
