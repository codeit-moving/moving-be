import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB 제한
  },
});

//이미지 파일 용량 및 형식 에러 처리는 추후 전역 에러 핸들러로 처리예정

export default upload;
