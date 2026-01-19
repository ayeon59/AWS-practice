import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { File } from '../entities/File';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // 개발 환경에서만 사용, 프로덕션에서는 false로 설정
  logging: true,
  entities: [File],
  migrations: [],
  subscribers: [],
});
