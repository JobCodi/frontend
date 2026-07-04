# JobCodi Onboarding Save API Draft

This document defines the draft API contract for saving and restoring the JobCodi onboarding diagnostic flow.

It is intentionally backend-agnostic: the frontend can use this contract when a server API is introduced, and the backend can use it as a DTO/validation checklist.

## Related docs

- [Onboarding IA](./onboarding-ia.md)
- Current implementation: `src/features/jobcodi-flow/JobCodiFlow.tsx`

## Goals

The onboarding save API should let JobCodi:

1. Persist a user's in-progress diagnostic flow.
2. Restore the draft on another device/session after authentication exists.
3. Save enough context to generate or revisit a recommendation report.
4. Keep browser-only storage as a temporary MVP fallback, not the long-term source of truth.

## Non-goals for MVP API design

- No raw AI provider keys in browser requests.
- No server-side model orchestration details in the frontend DTO.
- No direct upload of binary resume files in this endpoint. Resume file upload should use a separate upload flow and reference an uploaded asset ID or URL.
- No final job application submission. Candidate application status can be a separate endpoint later.

## Endpoint summary

| Use case | Method | Path | Auth | Notes |
| --- | --- | --- | --- | --- |
| Create draft | `POST` | `/api/onboarding-drafts` | Required when auth exists | Creates a new diagnostic draft. |
| Update draft | `PATCH` | `/api/onboarding-drafts/{draftId}` | Required | Saves partial progress for an existing draft. |
| Read draft | `GET` | `/api/onboarding-drafts/{draftId}` | Required | Restores a user's draft. |
| Complete draft | `POST` | `/api/onboarding-drafts/{draftId}/complete` | Required | Marks draft complete and returns report reference. |

For the current frontend-only MVP, these are documentation targets rather than implemented routes.

## Core DTOs

### BasicInfoDto

```ts
interface BasicInfoDto {
  status: "대학생" | "취준생" | "인턴 경험" | "주니어" | "이직 준비";
  fields: Array<"기획/전략" | "마케팅/광고" | "데이터/분석" | "IT/개발" | "디자인" | "영업/CS">;
  tasks: Array<
    | "문제 발견"
    | "데이터 분석"
    | "서비스 개선"
    | "사람 설득"
    | "콘텐츠 제작"
    | "프로세스 설계"
    | "요구사항 정의"
    | "스토리보드 작성"
  >;
  workType: "전체" | "정규직" | "계약직" | "인턴";
  region: "전체" | "서울" | "경기" | "인천" | "원격" | "부산";
  salary: "회사 내규 따름" | "3,000만원 이상" | "4,000만원 이상" | "5,000만원 이상";
  timeline: "즉시" | "3개월 이내" | "6개월 이내" | "상황에 따라";
}
```

### ChatMessageDto

```ts
interface ChatMessageDto {
  id: string;
  role: "assistant" | "user";
  content: string;
  createdAt?: string;
}
```

### ParsedResumeDto

```ts
interface ParsedResumeDto {
  experiences: string[];
  skills: string[];
  strengths: string[];
  jobKeywords: string[];
  summary: string;
  source?: {
    fileName?: string;
    textLength?: number;
    uploadedAssetId?: string;
  };
}
```

### WeightsDto

```ts
interface WeightsDto {
  fitScore: number;
  jobInterest: number;
  growth: number;
  employability: number;
  workLife: number;
}
```

### JobMatchDto

```ts
interface JobMatchDto {
  jobName: string;
  score: number;
  badge: string;
  fitDetail: number;
  interestDetail: number;
  growthDetail: number;
  difficulty: "낮음" | "보통" | "높음";
  expectedPostCount: string;
}
```

### ApplicationStatusDto

```ts
type ApplicationStatusDto = "saved" | "planned" | "applied";

interface ApplicationLeadStatusDto {
  leadId: string;
  status: ApplicationStatusDto;
  updatedAt: string;
}
```

## Create / update request

```ts
interface UpsertOnboardingDraftRequest {
  currentStep: "landing" | "basic" | "interview" | "resume" | "analysis" | "weights" | "compare" | "report";
  profile: BasicInfoDto;
  interview: {
    messages: ChatMessageDto[];
    personalityTags: string[];
  };
  resume: ParsedResumeDto;
  weights: WeightsDto;
  recommendations: JobMatchDto[];
  reportState?: {
    savedReportId?: string;
    completedActions?: string[];
    applicationStatuses?: ApplicationLeadStatusDto[];
  };
  clientMeta?: {
    appVersion?: string;
    locale?: "ko-KR";
    timezone?: string;
  };
}
```

## Create / update response

```ts
interface OnboardingDraftResponse {
  draftId: string;
  userId: string;
  currentStep: UpsertOnboardingDraftRequest["currentStep"];
  status: "draft" | "completed" | "archived";
  savedAt: string;
  nextRecommendedStep: "basic" | "interview" | "resume" | "analysis" | "weights" | "compare" | "report";
  warnings?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
}
```

## Complete response

```ts
interface CompleteOnboardingDraftResponse {
  draftId: string;
  reportId: string;
  completedAt: string;
  topRecommendation: JobMatchDto;
  reportUrl: string;
}
```

## Validation rules

### Request-level rules

| Rule | Error code |
| --- | --- |
| `currentStep` must be one of the known wizard step IDs. | `INVALID_STEP` |
| `profile.status` is required. | `PROFILE_STATUS_REQUIRED` |
| `profile.fields` must contain at least one item. | `PROFILE_FIELDS_REQUIRED` |
| `profile.tasks` must contain at least one item. | `PROFILE_TASKS_REQUIRED` |
| `interview.messages` must preserve assistant/user roles only. | `INVALID_INTERVIEW_ROLE` |
| `resume.summary` must be present once `currentStep` is `analysis` or later. | `RESUME_SUMMARY_REQUIRED` |
| Every weight must be between 0 and 100. | `WEIGHT_OUT_OF_RANGE` |
| Recommendation `score`, `fitDetail`, `interestDetail`, and `growthDetail` must be between 0 and 100. | `RECOMMENDATION_SCORE_OUT_OF_RANGE` |
| `recommendations` must contain at least one item once `currentStep` is `compare` or `report`. | `RECOMMENDATIONS_REQUIRED` |

### Recommended soft warnings

| Condition | Warning code | Why |
| --- | --- | --- |
| `resume.experiences` has no numeric or metric-bearing line. | `RESUME_METRIC_WEAK` | Helps prompt better resume evidence. |
| Total weights do not sum to 100. | `WEIGHT_SUM_NOT_100` | Current UI sliders are independent, but backend ranking may normalize later. |
| `interview.messages` is empty and current step is after interview. | `INTERVIEW_CONTEXT_EMPTY` | The user may have skipped interview via resume-first flow; warn, do not block. |

## Error response shape

```ts
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    fields?: Array<{
      path: string;
      code: string;
      message: string;
    }>;
    requestId: string;
  };
}
```

Example:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The onboarding draft payload is invalid.",
    "fields": [
      {
        "path": "profile.fields",
        "code": "PROFILE_FIELDS_REQUIRED",
        "message": "Select at least one interest field."
      }
    ],
    "requestId": "req_01hxyz"
  }
}
```

## Frontend mapping

| Frontend state | API path | Notes |
| --- | --- | --- |
| `step` | `currentStep` | Wizard progress. |
| `basicInfo` | `profile` | Direct mapping. |
| `chatHistory` | `interview.messages` | Add `createdAt` when backend persistence exists. |
| `personalityTags` | `interview.personalityTags` | Direct mapping. |
| `parsedResume` | `resume` | Add resume source metadata when upload flow exists. |
| `weights` | `weights` | Direct mapping. |
| `jobs` | `recommendations` | Direct mapping. |
| `completedActions` | `reportState.completedActions` | Currently browser localStorage. |
| `applicationStatuses` | `reportState.applicationStatuses` | Convert object map to array for stable API shape. |

## Security / privacy notes

- Resume text and interview answers may contain personal data; persist only for authenticated users.
- Do not store AI provider credentials in frontend-visible state.
- Return opaque `draftId` and `reportId`; do not expose database primary keys if avoidable.
- Add deletion/export support before production launch if user data is stored server-side.

## Future endpoint split

As the MVP matures, consider splitting this draft endpoint into narrower resources:

- `/api/onboarding-drafts/{draftId}/profile`
- `/api/onboarding-drafts/{draftId}/interview`
- `/api/resumes/{resumeId}/analysis`
- `/api/reports/{reportId}`
- `/api/application-leads/{leadId}/status`

The single upsert endpoint is simpler for the first backend integration, while the split endpoints are easier to validate and audit at scale.
