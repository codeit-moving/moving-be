import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import {
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  AWS_S3_REGION,
  AWS_S3_SECRET_KEY,
} from "../env";
import CustomError from "./interfaces/customError";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY!,
    secretAccessKey: AWS_S3_SECRET_KEY!,
  },
});

export const uploadFile = async (
  file: Express.Multer.File
): Promise<string> => {
  const key = `profiles/${Date.now()}`;

  if (!file) {
    const error: CustomError = new Error("Bad Request");
    error.status = 400;
    error.data = {
      message: "이미지 파일이 없습니다.",
    };
    throw error;
  }

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );
  } catch (e) {
    const error: CustomError = new Error("Internal Server Error");
    error.status = 500;
    error.data = {
      message: "이미지 업로드 실패",
    };
    throw error;
  }

  return `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${key}`;
};

export const deleteImages = async (imageUrl: string) => {
  const key = imageUrl.split(".amazonaws.com/")[1];

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: key,
    })
  );
};
