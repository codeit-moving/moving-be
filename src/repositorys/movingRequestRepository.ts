import prismaClient from "../utils/prismaClient";
import { MovingRequestData } from "../utils/interfaces/movingRequest/movingRequest";

interface queryString {
  limit: number;
  isCompleted: boolean;
  cursor: number | null;
}

//이사요청 목록 조회
const getMovingRequestList = (customerId: number, query: queryString) => {
  const { limit, isCompleted, cursor } = query;

  return prismaClient.movingRequest.findMany({
    where: {
      customerId,
      ...(isCompleted
        ? {
            confirmedQuote: {
              isNot: null, //환정견적과의 관계가 null이 아닌 경우
            },
          }
        : {}),
    },
    orderBy: { createAt: "desc" },
    take: limit,
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    select: {
      id: true,
      serviceType: true,
      movingDate: true,
      pickupAddress: true,
      dropOffAddress: true,
      createAt: true,
      _count: {
        select: {
          mover: true,
        },
      },
      confirmedQuote: {
        select: {
          id: true,
        },
      },
      customer: {
        select: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

//이사요청 생성
const createMovingRequest = (
  customerId: number,
  movingRequest: MovingRequestData
) => {
  return prismaClient.movingRequest.create({
    data: {
      ...movingRequest,
      customerId,
    },
    select: {
      id: true,
      serviceType: true,
      movingDate: true,
      pickupAddress: true,
      dropOffAddress: true,
    },
  });
};

//이사요청 지정
const updateDesignated = (movingRequestId: number, moverId: number) => {
  return prismaClient.movingRequest.update({
    where: { id: movingRequestId },
    data: {
      isDesignated: true,
      designateCount: {
        increment: 1,
      },
      mover: {
        connect: {
          id: moverId,
        },
      },
    },
    select: {
      _count: {
        select: {
          mover: true,
        },
      },
    },
  });
};

//이사요청 지정 취소
const updateDesignatedCancel = (movingRequestId: number, moverId: number) => {
  return prismaClient.movingRequest.update({
    where: { id: movingRequestId },
    data: {
      designateCount: {
        decrement: 1,
      },
      mover: {
        disconnect: {
          id: moverId,
        },
      },
    },
    select: {
      _count: {
        select: {
          mover: true,
        },
      },
    },
  });
};

//이사요청 지정 개수 조회
const getDesignateCount = (movingRequestId: number) => {
  return prismaClient.movingRequest.findUnique({
    where: { id: movingRequestId },
    select: {
      _count: {
        select: {
          mover: true,
        },
      },
    },
  });
};

//활성중인 이사요청 조회
const getActiveRequest = (customerId: number) => {
  return prismaClient.movingRequest.findFirst({
    where: {
      customerId,
      confirmedQuote: {
        is: null,
      },
    },
    select: {
      id: true,
      mover: {
        select: {
          id: true,
        },
      },
    },
  });
};

export default {
  getMovingRequestList,
  createMovingRequest,
  updateDesignated,
  updateDesignatedCancel,
  getDesignateCount,
  getActiveRequest,
};
