# ModelFit

프롬프트를 분석하여 가장 적합한 AI 모델을 추천하는 웹 서비스입니다.

## 핵심 기능 (Phase 1 MVP)

- 프롬프트 입력 → 작업 유형·복잡도·필요 기능 자동 분석
- 13개 모델 카탈로그에서 최대 3개 추천 (가장 적합 / 무료 대안 / 빠른 경제형)
- 추천 이유 및 한계 표시
- 모델 목록 조회 (공급자·무료 여부·오픈 가중치 필터)
- 추천 결과 평가 (도움 됨 / 적합하지 않음)
- **외부 API 키 없이 로컬 실행 가능**
- 비로그인 사용 가능

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 App Router |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| Client State | Zustand 5 |
| Server State | TanStack Query 5 |
| Validation | Zod 4 |
| Testing | Vitest 4 |
| Package Manager | pnpm 11 |

## 로컬 실행 방법

```bash
# 의존성 설치
pnpm install --ignore-scripts

# 개발 서버 시작
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속

## 환경 변수

Phase 1에서는 환경 변수가 없어도 실행됩니다.

```bash
cp .env.example .env.local
```

필요한 경우에만 설정하세요:

```env
# Phase 1: 분석기 모드 (기본값: rule-based)
PROMPT_ANALYZER_MODE=rule-based

# Phase 2 이후 필요한 키 (현재 불필요)
GEMINI_API_KEY=
OPENROUTER_API_KEY=
```

## 테스트 실행

```bash
pnpm test              # 전체 테스트
pnpm test:watch        # 감시 모드
pnpm test:coverage     # 커버리지 포함
```

## 빌드

```bash
pnpm build    # 프로덕션 빌드
pnpm typecheck # 타입 검사
pnpm lint     # ESLint
```

## 현재 구현 범위 (Phase 1)

- [x] 프롬프트 분석 (규칙 기반)
- [x] 모델 카탈로그 (13개 모델)
- [x] 모델 필터링
- [x] 모델 적합도 점수 계산
- [x] 최대 3개 추천 (best / free_alternative / fast_economy)
- [x] 추천 이유 및 한계 표시
- [x] 피드백 저장 (메모리)
- [x] REST API (analyze / recommend / models / feedback)
- [x] 웹 UI (홈 / 추천결과 / 모델목록)

## 이후 개발 단계 (Phase 2)

- [ ] 실제 무료 모델 채팅 (Gemini / OpenRouter via Provider Adapter)
- [ ] Supabase Auth 연동
- [ ] PostgreSQL 카탈로그 DB
- [ ] LLM 기반 프롬프트 분석기
- [ ] Rate limiting (Upstash Redis)
- [ ] 민감정보 마스킹

## 주요 디렉터리 구조

```
src/
├─ features/
│  ├─ prompt-analysis/      # 프롬프트 분석 도메인
│  ├─ model-recommendation/ # 모델 추천 도메인
│  ├─ model-catalog/        # 모델 카탈로그
│  └─ feedback/             # 사용자 피드백
├─ server/
│  ├─ container/            # DI 컨테이너
│  └─ providers/            # Phase 2 Provider Adapter 골격
├─ shared/
│  ├─ validation/           # Zod 스키마 (타입 포함)
│  ├─ errors/               # AppError
│  └─ lib/                  # 공유 유틸리티
└─ test/
   └─ unit/                 # 단위 테스트
app/
├─ api/                     # API Routes
├─ models/                  # 모델 목록 페이지
└─ recommend/               # 추천 결과 페이지
```
