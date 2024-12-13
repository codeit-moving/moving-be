import movingRequestRepository from "../../repositorys/movingRequestRepository";
import RatingResult from "../interfaces/mover/ratingResult";

interface Mover {
  id: number;
  user: {
    name: string;
  };
  imageUrl: { imageUrl: string }[];
  nickname: string;
  career: number;
  introduction?: string;
  description?: string;
  services?: number[];
  regions?: number[];
  favorite: { id: number }[];
  _count: { review: number; favorite: number; confirmedQuote: number };
}

const processMoversData = async (
  customerId: number | null,
  mover: Mover[] | Mover,
  ratingsByMover: Record<number, RatingResult>
) => {
  const movers = Array.isArray(mover) ? mover : [mover];
  let activeRequest: { id: number; mover: { id: number }[] } | null = null;
  if (customerId) {
    activeRequest = await movingRequestRepository.getActiveRequest(customerId);
  }
  return movers.map((mover) => {
    const { _count, favorite, user, ...rest } = mover;

    let isFavorite = false;
    let isDesignated = false;

    if (customerId) {
      isFavorite = favorite.some((favorite) => favorite.id === customerId);
      isDesignated =
        activeRequest?.mover.some(
          (designatedMover) => designatedMover.id === mover.id
        ) ?? false;
    }

    return {
      ...rest,
      imageUrl: rest.imageUrl.length > 0 ? rest.imageUrl[0].imageUrl : null,
      name: user.name,
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
