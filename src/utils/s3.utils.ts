import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  AWS_S3_REGION,
  AWS_S3_SECRET_KEY,
} from "../env";

export const uploadFile = async (
  file: Express.Multer.File
): Promise<string> => {
  const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: AWS_S3_ACCESS_KEY!,
      secretAccessKey: AWS_S3_SECRET_KEY!,
    },
  });

  const key = `profiles/${Date.now()}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${key}`;
};
