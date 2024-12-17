import prismaClient from "../utils/prismaClient";
import { ReviewCreateData } from "../utils/review/types";

// 리뷰 목록 조회 (기사 상세페이지용)
const getMoverReviews = (moverId: number, { pageSize = 5, pageNum = 1 }) => {
  return prismaClient.$transaction([
    // 총 리뷰 수 조회
    prismaClient.review.count({
      where: { moverId },
    }),
    // 리뷰 목록 조회
    prismaClient.review.findMany({
      where: { moverId },
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      select: {
        id: true,
        imageUrl: true,
        rating: true,
        content: true,
        createAt: true,
        customer: {
          select: {
            user: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createAt: "desc" },
    }),
  ]);
};

// (고객이)작성한 리뷰 목록 조회
const getMyReviews = (customerId: number, { pageSize = 6, pageNum = 1 }) => {
  return prismaClient.$transaction([
    prismaClient.review.count({
      where: { customerId },
    }),
    prismaClient.review.findMany({
      where: { customerId },
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      select: {
        id: true,
        rating: true,
        content: true,
        createAt: true,
        confirmedQuote: {
          select: {
            movingRequest: {
              select: {
                service: true,
                isDesignated: true,
                movingDate: true,
              },
            },
            quote: {
              select: {
                cost: true,
              },
            },
          },
        },
        mover: {
          select: {
            imageUrl: true,
            nickname: true,
          },
        },
      },
      orderBy: { createAt: "desc" },
    }),
  ]);
};

// (고객의)리뷰 생성하기
const createReview = (
  confirmedQuoteId: number,
  customerId: number,
  moverId: number,
  rating: number,
  content: string,
  imageUrl?: string[]
) => {
  return prismaClient.review.create({
    data: {
      confirmedQuoteId,
      customerId,
      moverId,
      rating,
      content,
      imageUrl,
    },
    select: {
      id: true,
      rating: true,
      imageUrl: true,
      content: true,
    },
  });
};

// 확정 견적 조회 함수 추가 (핵심 validation: 해당 고객이 이 확정 견적에 대해 리뷰를 쓸 수 있는지 확인)
const findConfirmedQuote = (confirmedQuoteId: number, customerId: number) => {
  return prismaClient.confirmedQuote.findUnique({
    where: {
      id: confirmedQuoteId,
      customerId: customerId,
    },
  });
};

// 작성 가능한 리뷰(기사) 목록 조회
const getAvailableReviews = (
  customerId: number,
  { pageSize = 6, pageNum = 1 }
) => {
  const today = new Date();

  return prismaClient.$transaction([
    // 작성 가능한 총 리뷰 수 조회
    prismaClient.confirmedQuote.count({
      where: {
        customerId,
        movingRequest: {
          movingDate: {
            lt: today, // 이사일이 현재보다 이전인 경우만
          },
        },
        review: {
          none: {}, // 리뷰가 없는 경우만
        },
      },
    }),
    // 작성 가능한 리뷰 목록 조회
    prismaClient.confirmedQuote.findMany({
      where: {
        customerId,
        movingRequest: {
          movingDate: {
            lt: today,
          },
        },
        review: {
          none: {},
        },
      },
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      select: {
        id: true,
        movingRequest: {
          select: {
            service: true,
            isDesignated: true,
            movingDate: true,
          },
        },
        quote: {
          select: {
            cost: true,
          },
        },
        mover: {
          select: {
            imageUrl: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        movingRequest: {
          movingDate: "desc",
        },
      },
    }),
  ]);
};

export default {
  getMoverReviews,
  getMyReviews,
  createReview,
  getAvailableReviews,
  findConfirmedQuote,
};
