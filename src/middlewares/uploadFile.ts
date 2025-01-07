import { throwHttpError } from "../utils/constructors/httpError";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  AWS_S3_REGION,
  AWS_S3_SECRET_KEY,
} from "../env";
import { asyncHandle } from "../utils/asyncHandler";

declare global {
  namespace Express {
    interface Request {
      fileUrls?: string[];
    }
  }
}

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY!,
    secretAccessKey: AWS_S3_SECRET_KEY!,
  },
});

export const uploadFiles = asyncHandle(async (req, res, next) => {
  const files = req.files as Express.Multer.File[];

  if (files.length === 0) {
    throwHttpError(400, "이미지 파일이 없습니다.");
  }

  try {
    const uploadPromises = files.map(async (file) => {
      const key = `profiles/${Date.now()}-${file.originalname}`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: AWS_S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );
      return `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${key}`;
    });

    req.fileUrls = await Promise.all(uploadPromises);
    next();
  } catch (e) {
    throwHttpError(500, "이미지 업로드 실패");
  }
});

export const uploadOptionalFiles = asyncHandle(async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  const files = req.files as Express.Multer.File[];

  try {
    const uploadPromises = files.map(async (file) => {
      const key = `profiles/${Date.now()}-${file.originalname}`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: AWS_S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );
      return `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${key}`;
    });

    req.fileUrls = await Promise.all(uploadPromises);
    next();
  } catch (e) {
    throwHttpError(500, "이미지 업로드 실패");
  }
});

export default { uploadFiles, uploadOptionalFiles };
