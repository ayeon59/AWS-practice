# TypeScript 빌드가 필요한 이유

## JavaScript vs TypeScript

| 언어 | 확장자 | 실행 | 빌드 필요 |
|------|--------|------|-----------|
| JavaScript | `.js` | Node.js가 바로 실행 | X |
| TypeScript | `.ts` | Node.js가 직접 실행 불가 | O |

## 왜 빌드가 필요한가?

TypeScript는 브라우저나 Node.js가 **직접 이해하지 못함**.
→ JavaScript로 **변환(컴파일)** 해야 실행 가능.

```
index.ts  →  (빌드)  →  index.js  →  Node.js 실행
```

## 빌드 명령어

```bash
npm run build    # TypeScript → JavaScript 변환
                 # src/*.ts → dist/*.js 생성
```

## 실행 비교

```bash
# JavaScript 프로젝트
pm2 start app.js

# TypeScript 프로젝트
npm run build              # 먼저 빌드
pm2 start dist/index.js    # 빌드된 JS 실행
```

## 폴더 구조

```
backend/
├── src/           # TypeScript 소스 코드
│   └── index.ts
├── dist/          # 빌드 결과물 (JS)
│   └── index.js
└── tsconfig.json  # TypeScript 설정
```

## EC2 배포 순서

```bash
git pull
npm install
npm run build      # 빌드 필수!
pm2 restart backend
```
