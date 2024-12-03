// createQuoteService.ts

// 필요한 모듈들을 가져옵니다.
import createQuoteRepository from "../repositorys/createQuoteRepository"; // 견적서 관련 데이터베이스 함수들
import CustomError from "../utils/interfaces/customError"; // 에러 처리를 위한 커스텀 에러 클래스

// 견적서를 생성하는 함수입니다.(유효성 검사 등 비즈니스 로직)
const createQuote = async (
  movingRequestId: number, // 이사 요청 아이디
  moverId: number, // 기사님 아이디
  cost: number, // 견적가
  comment: string // 코멘트
) => {
  // 견적가가 0 이상인지 확인합니다.
  if (cost < 0) {
    const error: CustomError = new Error("Invalid Cost");
    error.status = 400;
    error.data = {
      message: "견적가는 0 이상이어야 합니다.",
    };
    throw error;
  }

  // 코멘트가 있는지 확인합니다.
  if (!comment || comment.trim() === "") {
    // 공백만 있는 문자열도 내용이 없는 것으로 처리(trim() 사용)
    const error: CustomError = new Error("Invalid Comment");
    error.status = 400;
    error.data = {
      message: "코멘트는 필수 입력 사항입니다.",
    };
    throw error;
  }

  // 견적서를 생성하기 위해 레포지토리 함수를 호출합니다.
  const quote = await createQuoteRepository.createQuoteByMovingRequestId(
    movingRequestId,
    moverId,
    cost,
    comment
  );

  // 생성된 견적서를 반환합니다.
  return quote;
};

// 서비스 함수를 내보냅니다.
export default {
  createQuote,
};
