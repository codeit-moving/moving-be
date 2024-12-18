import cron from "node-cron";
import { deleteImages } from "../utils/s3.utils";
import imageRepository from "../repositorys/imageRepository";
import CustomError from "../utils/interfaces/customError";

// 매일 자정에 실행되는 크론 작업
export const imageCleanup = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("이미지 삭제 크론 작업 실행");
    try {
      const inActiveImages = await imageRepository.findInActiveImage(); //비활성화 이미지 조회
      // 각 이미지 삭제 처리
      for (const image of inActiveImages) {
        if (image.imageUrl) {
          try {
            await deleteImages(image.imageUrl); // S3에서 이미지 삭제
            await imageRepository.deleteImage(image.imageUrl); // DB에서 이미지 URL 제거
          } catch (e) {
            const error: CustomError = new Error();
            error.message = "이미지 삭제 실패";
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("Error in cleanup job:", error);
    }
  });
};
