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

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: "ap-northeast-2",
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET!,
    key: function (req, file, cb) {
      cb(null, file.originalname);
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

app.post("/upload", upload.array("photos"), (req, res) => {
  res.send(req.files);
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
