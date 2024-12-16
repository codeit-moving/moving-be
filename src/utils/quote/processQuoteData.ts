import getRatingsByMoverIds from "../mover/getRatingsByMover";
import processMoverData from "../mover/processMoverData";

interface Quote {
  id: number;
  comment: string;
  cost: number;
  mover: Mover;
  movingRequest: {
    service: number;
    createAt?: Date;
    movingDate?: Date;
    pickupAddress?: string;
    dropOffAddress?: string;
    confirmedQuote?: { id: number } | null;
  };
  confirmedQuote: { id: number } | null;
}

interface Mover {
  id: number;
  nickname: string;
  imageUrl: { imageUrl: string }[];
  introduction?: string;
  services: number[];
  career: number;
  _count: {
    review: number;
    favorite: number;
    confirmedQuote: number;
  };
  user: {
    name: string;
  };
  favorite: { id: number }[];
}

const processQuotes = async (customerId: number, quote: Quote[] | Quote) => {
  const quotes = Array.isArray(quote) ? quote : [quote];
  // moverIds와 movers를 한 번의 순회로 처리
  const moverIds: number[] = [];
  const movers = quotes.reduce((acc: Mover[], quote) => {
    moverIds.push(quote.mover.id);
    acc.push(quote.mover);
    return acc;
  }, []);

  const ratingsByMover = await getRatingsByMoverIds(moverIds);
  const processMovers = await processMoverData(
    customerId,
    movers,
    ratingsByMover
  );

  // Map을 사용하여 mover 검색 최적화
  const moverMap = new Map(processMovers.map((mover) => [mover.id, mover]));

  const processQuotes = quotes.map((quote) => {
    const { mover, movingRequest, ...rest } = quote;
    const { createAt, confirmedQuote, ...restMovingRequest } = movingRequest;
    return {
      ...rest,

      movingRequest: {
        ...restMovingRequest,
        requestDate: createAt,
        isConfirmed: Boolean(confirmedQuote),
      },
      mover: moverMap.get(mover.id), // O(1) 검색
    };
  });

  if (Array.isArray(quote)) {
    return processQuotes;
  }
  return processQuotes[0];
};

export default processQuotes;
