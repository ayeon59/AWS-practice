import express from "express";

const app = express();
const PORT = 80;

app.get("/", (_req, res) => {
  res.send("Hello! 백엔드 서버가 정상 작동 중입니다 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).send("Success Heatlth Check");
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
