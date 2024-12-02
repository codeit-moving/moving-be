import dotenv from "dotenv";
dotenv.config();

//.env 파일의 환경변수값을 가져와 전역변수로 사용

export const POSTGRES_DATABASE_URL = process.env.POSTGRES_DATABASE_URL;
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const REFRESH_SECRET = process.env.REFRESH_SECRET || "secret";
export const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
export const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
export const NAVER_REDIRECT_URI = process.env.NAVER_REDIRECT_URI;
