import confirmedQuoteRepository from "../repositorys/confirmedQuoteRepository";
import reviewRepository from "../repositorys/reviewRepository";
import { HttpError, throwHttpError } from "../utils/constructors/httpError";
import {
  ReviewCreateData,
  ReviewQuery,
  ReviewListItem,
  ReviewListResponse,
} from "../utils/review/types";

// 기사의 리뷰 목록 조회 (상세페이지용)
const getMoverReviewsList = async (moverId: number, query: ReviewQuery) => {
  const pageSize = query.pageSize || 5;
  const pageNum = query.pageNum || 1;

  const [totalCount, reviews] = await Promise.all([
    reviewRepository.getMoverReviewCount(moverId),
    reviewRepository.getMoverReviewList(moverId, {
      pageSize,
      pageNum,
    }),
  ]);

  return {
    currentPage: pageNum,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
    totalCount,
    list: reviews.map(
      (review): ReviewListItem => ({
        id: review.id,
        service: review.confirmedQuote.movingRequest.service,
        isDesignated: review.confirmedQuote.movingRequest.isDesignated,
        imageUrl: review.mover.imageUrl[0]?.imageUrl ?? "",
        reviewImageUrl: review.imageUrl ?? [], // string[] -> string
        nickname: review.mover.nickname,
        movingDate: review.confirmedQuote.movingRequest.movingDate,
        cost: review.confirmedQuote.quote.cost,
        rating: review.rating,
        content: review.content,
        createdAt: review.createAt,
      })
    ),
  };
};

// 고객이 작성한 리뷰 목록 조회
const getMyReviewsList = async (customerId: number, query: ReviewQuery) => {
  const pageSize = query.pageSize || 6;
  const pageNum = query.pageNum || 1;

  const [totalCount, reviews] = await Promise.all([
    reviewRepository.getMyReviewCount(customerId),
    reviewRepository.getMyReviewList(customerId, {
      pageSize,
      pageNum,
    }),
  ]);

  return {
    currentPage: pageNum,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
    totalCount,
    list: reviews.map(
      (review): ReviewListItem => ({
        id: review.id,
        service: review.confirmedQuote.movingRequest.service,
        isDesignated: review.confirmedQuote.movingRequest.isDesignated,
        imageUrl: review.mover.imageUrl[0]?.imageUrl ?? "",
        reviewImageUrl: review.imageUrl ?? [],
        nickname: review.mover.nickname,
        movingDate: review.confirmedQuote.movingRequest.movingDate,
        cost: review.confirmedQuote.quote.cost,
        rating: review.rating,
        content: review.content,
        createdAt: review.createAt,
      })
    ),
  };
};

// 리뷰 생성하기
const createNewReview = async (customerId: number, data: ReviewCreateData) => {
  try {
    const confirmedQuote = await reviewRepository.findConfirmedQuote(
      data.confirmedQuoteId,
      customerId
    );

    if (!confirmedQuote) {
      return throwHttpError(400, "리뷰를 작성할 수 있는 견적이 아닙니다.");
    }

    if (confirmedQuote.review.length > 0) {
      return throwHttpError(400, "이미 리뷰를 작성한 견적입니다.");
    }

    // 평점 유효성 검사
    if (data.rating < 1 || data.rating > 5) {
      return throwHttpError(400, "평점은 1-5 사이여야 합니다.");
    }

    // 리뷰 내용 길이 검사
    if (!data.content || data.content.length > 150) {
      return throwHttpError(400, "리뷰 내용은 1-150자 사이여야 합니다.");
    }

    return await reviewRepository.createReview(
      data.confirmedQuoteId,
      customerId,
      data.rating,
      data.content,
      data.imageUrl
    );
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throwHttpError(500, "서버 오류가 발생했습니다.");
  }
};

// 작성 가능한 리뷰 목록 조회
const getAvailableReviewsList = async (
  customerId: number,
  query: ReviewQuery
) => {
  const pageSize = query.pageSize || 6;
  const pageNum = query.pageNum || 1;

  const [totalCount, confirmedQuotes] = await Promise.all([
    // reviewRepository.getAvailableReviewCount(customerId),
    // reviewRepository.getAvailableReviewList(customerId, {
    //   pageSize,
    //   pageNum,
    // }),
    confirmedQuoteRepository.getAvailableReviewCount(customerId),
    confirmedQuoteRepository.getAvailableReviewList(customerId, {
      pageSize,
      pageNum,
    }),
  ]);

  return {
    currentPage: pageNum,
    totalPages: Math.ceil(totalCount / pageSize),
    totalCount,
    list: confirmedQuotes.map((confirmedQuote) => ({
      confirmedQuoteId: confirmedQuote.id,
      moverId: confirmedQuote.mover.id,
      service: confirmedQuote.movingRequest.service,
      isDesignated: confirmedQuote.movingRequest.mover.some(
        (mover) => mover.id === confirmedQuote.mover.id
      ),
      movingDate: confirmedQuote.movingRequest.movingDate,
      nickname: confirmedQuote.mover.nickname,
      cost: confirmedQuote.quote.cost,
      imageUrl: confirmedQuote.mover.imageUrl[0]?.imageUrl ?? "",
      confirmedQuote: undefined,
      movingRequest: undefined,
      mover: undefined,
    })),
  };
};

export default {
  getMoverReviewsList,
  getMyReviewsList,
  createNewReview,
  getAvailableReviewsList,
};
