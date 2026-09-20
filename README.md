# ModelFit

프롬프트를 분석해 현재 작업과 사용자 선호도에 가장 적합한 AI 모델을 추천하는 웹 서비스입니다.

## 핵심 기능

- 프롬프트 입력 → 작업 유형·복잡도·필요 기능 자동 분석
- 2026-09-20 기준 10개 최신 모델 카탈로그에서 최대 3개 추천
  - 가장 적합
  - 무료/오픈 대안
  - 빠른 경제형
- 추천 이유, 한계, 정보 확인일 표시
- AI 사용 유형 테스트로 품질·비용·속도 선호도 반영
  - 현재 브라우저에만 저장
  - 로그인 계정 학습이나 사용 이력 기반 자동 학습은 아직 미지원
- 프롬프트를 클립보드에 복사한 뒤 추천 AI 서비스 페이지로 이동
  - 공급사 웹 페이지를 여는 기능이며 프롬프트 자동 입력이나 특정 모델 자동 선택은 하지 않음
- 모델 목록 조회 및 공급자·무료 여부·오픈 가중치 필터
- 추천 결과 평가 (도움 됨 / 적합하지 않음)
- 최신 모델 업데이트를 읽을 수 있는 모델 뉴스/브리프 페이지
- 비로그인 사용 가능

## 추천 분석 방식

ModelFit은 환경 설정에 따라 LLM 분석을 우선 사용하고, 실패하거나 API 키가 없으면 결정적인 규칙 기반 분석기로 자동 전환합니다.

```
LLM analyzer (Gemini 또는 OpenRouter)
        ↓ 실패/키 없음
Rule-based analyzer fallback
        ↓
작업 유형·복잡도·필요 기능·우선순위
        ↓
모델 적합도 점수 계산 및 최대 3개 추천
```

기본 모드는 `auto`입니다.

```env
PROMPT_ANALYZER_MODE=auto

# 둘 중 하나 이상 설정하면 LLM 분석을 우선 사용합니다.
GEMINI_API_KEY=
GEMINI_ANALYZER_MODEL=gemini-3.8-flash

OPENROUTER_API_KEY=
OPENROUTER_ANALYZER_MODEL=google/gemini-3.8-flash
```

`PROMPT_ANALYZER_MODE=rule-based`로 지정하면 외부 API 없이 규칙 기반 분석만 사용할 수 있습니다.

## 모델 추천 점수

추천 점수는 공급사 마케팅 문구나 단일 벤치마크 순위를 그대로 사용하지 않습니다.

- 작업 적합성
- 필요한 기능 지원 여부
- 품질
- 비용 효율
- 속도
- AI 사용 유형 테스트에서 선택한 개인 선호도

를 함께 반영하는 휴리스틱 점수입니다.

모델 카탈로그의 `lastVerifiedAt`은 공식 모델 페이지/공식 발표를 확인한 날짜이며, 추천 결과에서도 데이터 기준일과 모델별 확인일을 표시합니다.

## 기술 스택

| 영역 | 기술 |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Client State | Zustand 5 |
| Server State | TanStack Query 5 |
| Validation | Zod 4 |
| AI analysis | Gemini API / OpenRouter + rule-based fallback |
| Testing | Vitest 4 |
| Package Manager | pnpm 11 |

## 로컬 실행

```bash
pnpm install --ignore-scripts
pnpm dev
```

환경 변수 없이도 규칙 기반 fallback으로 실행할 수 있습니다.

## 테스트 / 검증

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## 현재 구현 범위

- [x] 프롬프트 분석 (LLM 우선 + rule-based fallback)
- [x] 2026-09-20 기준 10개 최신 모델 카탈로그
- [x] 모델 필터링 및 적합도 점수 계산
- [x] 최대 3개 추천
- [x] 추천 이유·한계·검증일 표시
- [x] AI 사용 유형 테스트 기반 브라우저 로컬 개인화
- [x] 프롬프트 복사 후 공급사 웹 페이지 이동
- [x] 추천 피드백 입력
- [x] 모델 뉴스/브리프
- [x] REST API (analyze / recommend / models / feedback)
- [x] 웹 UI (홈 / 추천 결과 / 모델 목록 / 모델 뉴스)

## 아직 포함하지 않은 기능

- [ ] 로그인/계정 기반 프로필 저장
- [ ] 사용 이력 기반 자동 개인화 학습
- [ ] 프롬프트의 타사 서비스 자동 입력
- [ ] 추천한 특정 모델의 자동 선택/실행
- [ ] 실제 무료 모델 채팅
- [ ] PostgreSQL/Supabase 영구 저장
- [ ] 민감정보 마스킹
