import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 80;

app.use(cors());
app.use(express.json());

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const sequelize = new Sequelize(
  process.env.DATABASE_NAME!,
  process.env.DATABASE_USERNAME!,
  process.env.DATABASE_PASSWORD!,
  {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
  }
);

app.get("/", (_req, res) => {
  res.send("Hello! 백엔드 서버가 정상 작동 중입니다 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).send("Success Heatlth Check");
});

// 업로드용 Presigned URL 생성
app.post("/api/files/presigned-url", async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    res.json({
      presignedUrl,
      key,
      fileUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    });
  } catch (error) {
    console.error("Presigned URL 생성 실패:", error);
    res.status(500).json({ error: "Presigned URL 생성 실패" });
  }
});

// 다운로드용 Presigned URL 생성
app.get("/api/files/download/:key(*)", async (req, res) => {
  try {
    const { key } = req.params;

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    res.json({ presignedUrl });
  } catch (error) {
    console.error("다운로드 URL 생성 실패:", error);
    res.status(500).json({ error: "다운로드 URL 생성 실패" });
  }
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("DB 연결 성공!");
  } catch (err) {
    console.log("DB 연결 X", err);
  }
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
