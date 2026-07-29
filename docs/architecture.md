# ModelFit 아키텍처

## 시스템 구성

```
Browser
  └─ Next.js App Router (app/)
       ├─ Pages: /, /models, /recommend
       └─ API Routes: /api/prompts/analyze, /api/models/recommend, /api/models, /api/feedback

서버 레이어 (src/)
  ├─ features/           # 도메인별 기능 모듈
  ├─ server/             # 인프라 (DI, Provider Adapter)
  └─ shared/             # 공유 타입·검증·유틸
```

## 요청 처리 흐름

```
사용자 입력 (브라우저)
  → POST /api/models/recommend
  → Zod 입력 검증
  → InputPreprocessor (현재: pass-through)
  → PromptAnalyzer (RuleBasedPromptAnalyzer)
  → ModelCatalogRepository.findActive()
  → filterModels()
  → scoreModel() × 모델 수
  → rankModels()
  → buildRecommendations()
  → JSON 응답 반환
  → RecommendationCard UI 렌더링
```

## 프롬프트 분석 구조

```
PromptAnalyzer (인터페이스)
  ├─ RuleBasedPromptAnalyzer  ← Phase 1 기본 사용
  │    ├─ 작업 유형 감지 (키워드 매칭)
  │    ├─ 복잡도 분석 (길이·조건수·단계수)
  │    ├─ 필요 기능 추출 (vision/coding/multilingual 등)
  │    └─ 토큰 수 추정
  └─ LlmPromptAnalyzer        ← Phase 2 구현 예정 (API 키 필요)
```

## 모델 추천 구조

```
filterModels()
  - 상태 필터 (active/preview만 허용)
  - 입력 모달리티 필터
  - 컨텍스트 한도 필터
  - 구조화 출력 필터
  - 코딩 점수 최소 기준
  - 무료 전용 모드 필터

scoreModel()
  총점 = 작업적합성(40%) + 기능적합성(20%) + 품질(15%) + 비용(15%) + 속도(10%)
  PromptAnalysis.priorities로 가중치 제한적 조정 (±15%p)

rankModels()
  동점 처리: 안정성 → 속도 → 컨텍스트 → 비용 → ID

buildRecommendations()
  - best: 전체 점수 1위
  - free_alternative: 무료/오픈 후보 중 상위
  - fast_economy: 속도≥3·비용≤2 후보 중 상위
  중복 방지: usedIds Set
```

## Provider Adapter 구조 (Phase 2 준비)

```
ModelProviderAdapter (인터페이스)
  - provider: string
  - supports(modelId): boolean
  - generateText(input): Promise<output>

구현체 (Phase 2)
  ├─ GeminiAdapter     (google/gemini-*)
  └─ OpenRouterAdapter (모든 모델)
```

Provider Adapter는 추천 로직에 직접 의존하지 않습니다.
추천 → 사용자 선택 → Provider Adapter → 실행의 순서로 분리됩니다.

## 데이터 저장 구조

```
Phase 1 (메모리/시드)
  ModelCatalogRepository → SeedModelCatalogRepository
  FeedbackRepository     → InMemoryFeedbackRepository

Phase 2 (예정)
  ModelCatalogRepository → SupabaseModelCatalogRepository
  FeedbackRepository     → SupabaseFeedbackRepository
```

## 향후 Phase 2 확장 방식

1. `SeedModelCatalogRepository` → `SupabaseModelCatalogRepository`로 교체 (인터페이스 동일)
2. `InMemoryFeedbackRepository` → DB 구현체로 교체
3. `RuleBasedPromptAnalyzer` → API 키 있을 때 `LlmPromptAnalyzer` 자동 선택 (팩토리 패턴)
4. `GeminiAdapter`, `OpenRouterAdapter` 실제 구현
5. Provider Adapter 앞에 Rate Limiter (Upstash Redis) 추가
6. Supabase Auth 연동 (선택적 로그인)
