import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { S3Client } from "@aws-sdk/client-s3";
import cors from "cors";
import multer from "multer";
import multerS3 from "multer-s3";

dotenv.config();

const app = express();
const PORT = 80;

app.use(cors());
app.use(express.json());

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET!,
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),
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

// 파일 업로드
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file as Express.MulterS3.File;
  res.json({
    message: "업로드 성공",
    file: {
      key: file.key,
      location: file.location,
      originalName: file.originalname,
      size: file.size,
    },
  });
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
