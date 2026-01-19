import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_BUCKET_NAME } from '../config/s3';
import { AppDataSource } from '../config/database';
import { File } from '../entities/File';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const fileRepository = AppDataSource.getRepository(File);

export const uploadFileToS3 = async (
  file: Express.Multer.File
): Promise<File> => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;
  const s3Key = `uploads/${fileName}`;

  const uploadParams = {
    Bucket: S3_BUCKET_NAME,
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));

  const s3Url = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

  const fileEntity = fileRepository.create({
    originalName: file.originalname,
    fileName: fileName,
    s3Key: s3Key,
    s3Url: s3Url,
    mimeType: file.mimetype,
    size: file.size,
  });

  return await fileRepository.save(fileEntity);
};

export const getAllFiles = async (): Promise<File[]> => {
  return await fileRepository.find({
    order: { createdAt: 'DESC' },
  });
};

export const getFileById = async (id: number): Promise<File | null> => {
  return await fileRepository.findOneBy({ id });
};

export const deleteFile = async (id: number): Promise<boolean> => {
  const file = await fileRepository.findOneBy({ id });
  if (!file) return false;

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: file.s3Key,
    })
  );

  await fileRepository.delete(id);
  return true;
};
