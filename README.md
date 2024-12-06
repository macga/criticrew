# CritiCrew (크리티크루)

콘텐츠 리뷰 및 평가 서비스

## 개발 원칙

1. **UI 컴포넌트 관리**
   - shadcn/ui 컴포넌트의 기본 구조와 코어 영역은 절대 수정하지 않음
   - 버전 업데이트 용이성을 위해 원본 컴포넌트 구조 유지
   - 커스터마이징이 필요한 경우 컴포넌트를 확장하거나 래퍼 컴포넌트 사용

## 기술 스택

- **프레임워크:** Next.js 14 (App Router)
- **언어:** TypeScript
- **스타일링:** Tailwind CSS
- **상태 관리:** React Context
- **데이터베이스:** PostgreSQL (Neon)
- **ORM:** Prisma
- **인증:** JWT
- **UI 컴포넌트:** shadcn/ui

## 폴더 구조

```
src/
├── app/                      # Next.js 앱 라우터
│   ├── (admin-root)/        # 관리자 레이아웃 및 페이지
│   │   ├── admin/          # 관리자 대시보드
│   │   └── layout.tsx      # 관리자 레이아웃
│   ├── (auth)/             # 인증 관련 레이아웃 및 페이지
│   │   ├── login/         # 로그인
│   │   ├── register/      # 회원가입
│   │   └── layout.tsx     # 인증 레이아웃
│   ├── (user-root)/        # 사용자 레이아웃 및 페이지
│   │   ├── page.tsx       # 메인 페이지
│   │   └── layout.tsx     # 사용자 레이아웃
│   ├── api/                # API 라우트
│   │   └── auth/          # 인증 관련 API
│   └── layout.tsx          # 루트 레이아웃
├── components/             # 재사용 가능한 컴포넌트
│   ├── ui/                # UI 기본 컴포넌트
│   └── [feature]/         # 기능별 컴포넌트
├── lib/                    # 유틸리티 및 설정
│   └── prisma.ts          # Prisma 클라이언트
└── styles/                # 전역 스타일

prisma/
├── schema.prisma          # 데이터베이스 스키마
└── migrations/           # 데이터베이스 마이그레이션
```

## 주요 기능

### 1. 인증

- 이메일 회원가입
- 로그인/로그아웃
- JWT 기반 인증

### 2. 사용자 관리

- 프로필 관리
- 팔로우/팔로잉
- 권한 관리

### 3. 콘텐츠

- 영화/TV 프로그램 리뷰
- 평가 및 댓글
- 좋아요

## 시작하기

1. 저장소 클론

```bash
git clone https://github.com/yourusername/criticrew.git
cd criticrew
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정

```bash
cp .env.example .env
```

필요한 환경 변수를 설정해주세요.

4. 데이터베이스 마이그레이션

```bash
npx prisma migrate dev
```

5. 개발 서버 실행

```bash
npm run dev
```

## 환경 변수

- `DATABASE_URL`: PostgreSQL 데이터베이스 URL
- `NEXTAUTH_SECRET`: NextAuth.js 암호화 키
- `NEXTAUTH_URL`: 애플리케이션 URL
- `JWT_SECRET`: JWT 토큰 암호화 키
