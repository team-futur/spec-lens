# SpecLens

OpenAPI/Swagger 스펙을 시각화하고 API를 테스트할 수 있는 뷰어

## 주요 기능

- **스펙 로딩**: JSON 파일 업로드 또는 URL 입력으로 OpenAPI 스펙 로드
- **API 시각화**: 엔드포인트 목록, 파라미터, 스키마 등 시각적으로 표시
- **API 테스트**: Try it out 기능으로 실제 API 호출 테스트
- **다크 테마**: 눈이 편한 다크 모드 UI

## 지원 포맷

- OpenAPI 3.0.x JSON

## 기술 스택

- **Framework**: TanStack Start (React meta-framework with SSR)
- **Routing**: TanStack Router (file-based routing)
- **State Management**: Zustand
- **Server State**: TanStack Query
- **Database**: Prisma + SQLite (libsql adapter)
- **Build**: Vite + Nitro

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

### 프로덕션 빌드

```bash
pnpm build
```

### 프로덕션 빌드 미리보기

```bash
pnpm preview
```

## 주요 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm preview` | 프로덕션 빌드 미리보기 |
| `pnpm lint` | ESLint 검사 |
| `pnpm lint:fix` | ESLint 자동 수정 |
| `pnpm db:generate` | Prisma 클라이언트 생성 |
| `pnpm db:migrate` | 마이그레이션 실행 |
| `pnpm db:studio` | Prisma Studio 열기 |

## 프로젝트 구조

```
src/
├── routes/          # TanStack Router 파일 기반 라우트
├── pages/           # 페이지 컴포넌트
├── widgets/         # 복합 UI 블록
│   ├── openapi-viewer/  # API 뷰어 위젯
│   └── spec-loader/     # 스펙 로더 위젯
├── features/        # 비즈니스 기능
│   └── openapi-loader/  # 스펙 로딩 기능
├── entities/        # 비즈니스 엔티티
│   └── openapi/         # OpenAPI 관련 타입, 스토어, 파서
└── shared/          # 공유 코드 (api, hooks, lib, store, ui)
```

## 라이선스

MIT
