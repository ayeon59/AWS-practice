# AWS-practice
AWS 인프라 구축 연습

## 프로젝트 구조

```
AWS-practice/
├── backend/                        # Express + TypeScript + TypeORM
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts         # TypeORM + MySQL 연결 설정
│   │   │   └── s3.ts               # AWS S3 클라이언트 설정
│   │   ├── controllers/
│   │   │   └── fileController.ts   # 파일 API 컨트롤러
│   │   ├── entities/
│   │   │   └── File.ts             # 파일 엔티티 (TypeORM)
│   │   ├── routes/
│   │   │   └── fileRoutes.ts       # 파일 관련 라우트
│   │   ├── services/
│   │   │   └── fileService.ts      # S3 업로드/삭제 비즈니스 로직
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── index.ts                # 서버 진입점
│   ├── .env.example                # 환경변수 예시
│   ├── package.json
│   └── tsconfig.json
├── frontend/                       # React + Vite + TypeScript
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── fileApi.ts          # 백엔드 API 통신 함수
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── App.tsx                 # 메인 컴포넌트 (파일 업로드 UI)
│   │   ├── App.css                 # 스타일
│   │   ├── index.css
│   │   └── main.tsx                # React 진입점
│   ├── .env.example                # 환경변수 예시
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── eslint.config.js
├── .gitignore                      # 민감한 파일 제외 설정
└── README.md
```

## 기술 스택

- **Backend**: Express, TypeScript, TypeORM, MySQL
- **Frontend**: React, Vite, TypeScript
- **AWS**: RDS (MySQL), S3

## 시작하기

### 1. 백엔드 설정

```bash
cd backend
npm install

# .env 파일 생성 (.env.example 참고)
cp .env.example .env
# .env 파일에 실제 값 입력

npm run dev
```

### 2. 프론트엔드 설정

```bash
cd frontend
npm install

# .env 파일 생성 (.env.example 참고)
cp .env.example .env
# .env 파일에 실제 값 입력

npm run dev
```

## AWS 설정 필요 사항

### RDS (MySQL)
1. AWS 콘솔에서 RDS MySQL 인스턴스 생성
2. 보안 그룹에서 인바운드 규칙에 3306 포트 열기
3. `.env` 파일에 RDS 엔드포인트, 사용자명, 비밀번호 입력

### S3
1. AWS 콘솔에서 S3 버킷 생성
2. 퍼블릭 액세스 설정 (파일 공개 접근 필요시)
3. CORS 설정 (프론트엔드 도메인 허용)
4. IAM 사용자 생성 및 S3 접근 권한 부여
5. `.env` 파일에 Access Key, Secret Key, 버킷 이름 입력

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/health | 서버 상태 확인 |
| GET | /api/files | 파일 목록 조회 |
| GET | /api/files/:id | 특정 파일 조회 |
| POST | /api/files/upload | 파일 업로드 |
| DELETE | /api/files/:id | 파일 삭제 |
