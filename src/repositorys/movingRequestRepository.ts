import prismaClient from "../utils/prismaClient";
import { MovingRequestData } from "../utils/interfaces/movingRequest/movingRequest";

interface CursorQueryString {
  limit: number;
  cursor: number | null;
  orderBy: { [key: string]: "asc" | "desc" };
}

interface WhereCondition {
  keyword?: string;
  OR?: object[];
  services?: object;
}

interface OffsetQueryString {
  pageSize: number;
  pageNum: number;
}

const getMovingRequestCountByCustomer = (customerId: number) => {
  return prismaClient.movingRequest.count({
    where: {
      customerId,
    },
  });
};

//이사요청 목록 조회
const getMovingRequestList = (
  customerId: number,
  query: CursorQueryString,
  where: WhereCondition
) => {
  const { limit, cursor, orderBy } = query;

  return prismaClient.movingRequest.findMany({
    where: {
      customerId,
      ...where,
    },
    orderBy,
    take: limit,
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    select: {
      id: true,
      service: true,
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

//이사요청 목록 조회 (고객)
const getMovingRequestListByCustomer = (
  customerId: number,
  query: OffsetQueryString
) => {
  const { pageSize, pageNum } = query;

  return prismaClient.movingRequest.findMany({
    where: {
      customerId,
    },
    orderBy: { createAt: "desc" },
    take: pageSize,
    skip: (pageNum - 1) * pageSize, //페이지 번호 계산 2가 오면 기존의 1페이지의 수를 스킵
    select: {
      id: true,
      service: true,
      movingDate: true,
      pickupAddress: true,
      dropOffAddress: true,
      createAt: true,
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

const getMovingRequestById = (movingRequestId: number) => {
  return prismaClient.movingRequest.findUnique({
    where: { id: movingRequestId },
    select: {
      id: true,
      service: true,
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
      service: true,
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
      mover: {
        where: {
          id: moverId,
        },
        select: {
          id: true,
          nickname: true,
          user: {
            select: {
              id: true,
            },
          },
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
  getMovingRequestById,
  getMovingRequestListByCustomer,
  getMovingRequestCountByCustomer,
};
