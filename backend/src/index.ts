import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import fileRoutes from './routes/fileRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/files', fileRoutes);

// Hello 페이지 (루트)
app.get('/', (_req, res) => {
  res.send('Hello! 백엔드 서버가 정상 작동 중입니다 🚀');
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database connection and server start
AppDataSource.initialize()
  .then(() => {
    console.log('데이터베이스 연결 성공!');
    app.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
  })
  .catch((error) => {
    console.error('데이터베이스 연결 실패:', error);
  });
