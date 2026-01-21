import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const app = express();
const PORT = 80;

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

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("DB 연결 성공!");
  } catch (err) {
    console.log("DB 연결 X", err);
  }
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
