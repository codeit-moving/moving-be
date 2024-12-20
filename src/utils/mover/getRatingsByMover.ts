import moverRepository from "../../repositorys/moverRepository";
import RatingResult from "../interfaces/mover/ratingResult";

//평점 조회
const getRatingsByMoverIds = async (moverIds: number | number[]) => {
  const moverIdArray = Array.isArray(moverIds) ? moverIds : [moverIds];

  const ratings = await moverRepository.getRatingsByMoverIds(moverIdArray);

  // moverId별로 그룹화
  const ratingsByMover = moverIdArray.reduce((acc, moverId) => {
    acc[moverId] = {
      totalCount: 0,
      totalSum: 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      average: 0,
    };
    return acc;
  }, {} as Record<number, RatingResult>);

  // 각 rating 데이터 처리
  ratings.forEach((rating) => {
    const moverRating = ratingsByMover[rating.moverId];
    moverRating.totalCount += rating._count.rating;
    moverRating.totalSum += rating.rating * rating._count.rating;
    moverRating[`${rating.rating}`] = rating._count.rating;
  });

  // 평균 계산 및 totalSum 제거
  Object.values(ratingsByMover).forEach((rating) => {
    rating.average =
      rating.totalCount > 0
        ? Math.round((rating.totalSum / rating.totalCount) * 10) / 10
        : 0;
    const { totalSum, ...returnResult } = rating;
    return returnResult;
  });

  return ratingsByMover;
};

export default getRatingsByMoverIds;
