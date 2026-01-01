# 📈 Stock Search Application

국내/해외 주식 정보를 검색하고 관리할 수 있는 웹 애플리케이션

## 🚀 프로젝트 개요

이 프로젝트는 Clean Architecture 기반으로 설계된 주식 정보 검색 웹 애플리케이션입니다.
Next.js 16과 TypeScript를 사용하여 개발되었으며, 현재 미국 주식 심볼 검색 기능을 제공합니다.

### 기술 스택

- **프레임워크**: Next.js 16.0.7 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 4
- **패키지 매니저**: Yarn
- **아키텍처**: Clean Architecture

### 현재 구현된 기능

- ✅ 주식 심볼 검색 (Symbol Search)
- ✅ Alpha Vantage API 연동
- ✅ 실시간 검색 결과 표시

### 향후 예정 기능

- 📊 실시간 주가 조회
- 📈 차트 분석
- 💼 포트폴리오 관리
- 🔔 가격 알림
- 🇰🇷 국내 주식 지원 (한국투자증권 API)

## 📦 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd stock
```

### 2. 의존성 설치

```bash
yarn install
```

### 3. 환경 변수 설정

`.env.local.example` 파일을 참고하여 `.env.local` 파일을 생성합니다.

```bash
cp .env.local.example .env.local
```

필수 환경 변수:

```env
# Alpha Vantage API Key (무료 API 키: https://www.alphavantage.co/support/#api-key)
ALPHA_VANTAGE_API_KEY=your_api_key_here
```

### 4. 개발 서버 실행

```bash
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 📁 프로젝트 구조

```
stock/
├── docs/                           # 문서
│   └── coding-convention.md        # 코딩 컨벤션
├── src/
│   ├── app/                        # Next.js App Router
│   │   └── search/                 # 검색 페이지
│   │       ├── page.tsx            # 검색 UI
│   │       └── actions.ts          # Server Actions
│   ├── domain/                     # Domain Layer
│   │   └── stock/
│   │       ├── stock.ts            # Stock Entity
│   │       └── stock-search-response.ts
│   ├── use-cases/                  # Application Layer
│   │   └── stock-use-case.ts       # 주식 검색 Use Case
│   ├── repository/                 # Infrastructure Layer
│   │   └── stock/
│   │       ├── stock-repository.ts # Repository Interface
│   │       └── us-stock-implement.ts # Alpha Vantage 구현체
│   ├── service/                    # API Clients
│   │   └── api-client/
│   │       ├── api-client.ts       # Base API Client
│   │       └── us-api-client.ts    # US Stock API Client
│   └── config/                     # 설정 파일
│       └── api-config.ts           # API 설정
└── README.md
```

## 🏗️ 아키텍처

본 프로젝트는 **Clean Architecture** 원칙을 따릅니다.

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (React Components, Pages)            │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        Application Layer                │
│    (Use Cases, Business Logic)          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│          Domain Layer                   │
│    (Entities, Interfaces)               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│       Infrastructure Layer              │
│  (Repositories, API Clients, Services)  │
└─────────────────────────────────────────┘
```

### 의존성 규칙

- 외부 → 내부 방향으로만 의존 (Dependency Rule)
- Domain Layer는 어떤 레이어에도 의존하지 않음
- 각 레이어는 자신보다 내부 레이어만 참조 가능

## 🎯 사용 방법

### 주식 검색

1. [http://localhost:3000/search](http://localhost:3000/search) 페이지로 이동
2. 검색창에 주식 심볼 또는 회사명 입력 (예: Apple, TSLA, MSFT)
3. "검색" 버튼 클릭
4. 검색 결과에서 주식 정보 확인:
   - 심볼 (Symbol)
   - 회사명 (Name)
   - 주식 유형 (Type)
   - 지역 (Region)
   - 통화 (Currency)
   - 거래시간 (Market Hours)
   - 매칭도 (Match Score)

## 📝 개발 가이드

### 코딩 컨벤션

자세한 코딩 컨벤션은 [docs/coding-convention.md](docs/coding-convention.md)를 참고하세요.

#### 주요 규칙

- **파일/폴더명**: kebab-case (예: `stock-use-case.ts`)
- **클래스명**: PascalCase (예: `StockUseCase`)
- **변수/함수명**: camelCase (예: `searchStocks`)
- **상수명**: UPPER_SNAKE_CASE (예: `API_BASE_URL`)

### 새로운 기능 추가

1. **Domain Layer**: Entity 및 Interface 정의
2. **Use Case Layer**: 비즈니스 로직 구현
3. **Infrastructure Layer**: Repository 구현체 작성
4. **Presentation Layer**: UI 컴포넌트 및 페이지 작성

### 커밋 컨벤션

```bash
feat(search): 검색 기능 추가
fix(api): API 오류 처리 개선
docs(readme): 문서 업데이트
refactor(use-case): 코드 구조 개선
```

## 🔧 빌드 및 배포

### 프로덕션 빌드

```bash
yarn build
```

### 프로덕션 서버 실행

```bash
yarn start
```

### Vercel 배포

이 프로젝트는 Vercel에서 쉽게 배포할 수 있습니다.

1. [Vercel](https://vercel.com)에 프로젝트 연결
2. 환경 변수 설정 (ALPHA_VANTAGE_API_KEY 등)
3. 자동 배포 완료

## 📚 API 참고

### Alpha Vantage API

- 공식 문서: https://www.alphavantage.co/documentation/
- API 키 발급: https://www.alphavantage.co/support/#api-key
- 무료 플랜: 하루 500회, 분당 5회 제한

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is licensed under the MIT License.

## 📧 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) - React 프레임워크
- [Alpha Vantage](https://www.alphavantage.co/) - 주식 데이터 API
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크