# JobCodi Onboarding IA

This document defines the current MVP onboarding questions, choices, and frontend state fields for the JobCodi diagnostic flow.

## Scope

The onboarding IA covers the user journey before the final recommendation report:

1. Landing entry point
2. Basic profile questions
3. AI job interview prompt flow
4. Resume upload / text input
5. Resume analysis review
6. Recommendation priority weighting
7. Final report and 30/90 day action plan

The goal is to make the question list, choice sets, and browser state contract explicit before the flow is connected to a backend API.

## Entry points

| Entry point | UI label | Target step | Intent |
| --- | --- | --- | --- |
| Interview-first | `내 숨은 직무 찾기` / `AI 인터뷰 시작하기` | `basic` | User has no ready resume and wants guided discovery. |
| Resume-first | `이력서로 추천받기` / `이력서 즉시 업로드` | `resume` | User already has resume material and wants quick analysis. |

## Step 1. Basic profile

### Question list

| Order | Question | Input type | Required | State field | Current options |
| --- | --- | --- | --- | --- | --- |
| 1 | 현재 상태 | Single-select chip | Yes | `basicInfo.status` | 대학생, 취준생, 인턴 경험, 주니어, 이직 준비 |
| 2 | 관심 분야 | Multi-select chips | Yes | `basicInfo.fields` | 기획/전략, 마케팅/광고, 데이터/분석, IT/개발, 디자인, 영업/CS |
| 3 | 선호 업무 | Multi-select chips | Yes | `basicInfo.tasks` | 문제 발견, 데이터 분석, 서비스 개선, 사람 설득, 콘텐츠 제작, 프로세스 설계, 요구사항 정의, 스토리보드 작성 |
| 4 | 근무 형태 | Select | No | `basicInfo.workType` | 전체, 정규직, 계약직, 인턴 |
| 5 | 희망 지역 | Select | No | `basicInfo.region` | 전체, 서울, 경기, 인천, 원격, 부산 |
| 6 | 연봉 수준 | Select | No | `basicInfo.salary` | 회사 내규 따름, 3,000만원 이상, 4,000만원 이상, 5,000만원 이상 |
| 7 | 구직 시점 | Select | No | `basicInfo.timeline` | 즉시, 3개월 이내, 6개월 이내, 상황에 따라 |

### Validation

The user can proceed from the basic profile step when:

- `status` is non-empty
- `fields.length > 0`
- `tasks.length > 0`

Optional preference fields have defaults and should not block progression.

### Preview card

The side preview summarizes:

- Selected interest fields
- Current status
- Region
- Timeline
- Selected task tags

## Step 2. AI job interview

### Initial assistant prompt

```text
안녕하세요! 저는 JobCodi AI입니다. 지금까지 프로젝트나 업무를 하며 가장 성취감을 느낀 경험을 편하게 들려주세요.
```

### Suggested quick answers

| Suggestion | Expected signals |
| --- | --- |
| GA4 데이터를 보고 유입이 떨어진 페이지를 분석해 이탈률을 낮췄던 일입니다. | Data analysis, funnel diagnosis, service planning |
| 개발자, 디자이너와 소통하며 화면 설계 와이어프레임을 만든 일이에요. | Collaboration, wireframing, product planning |
| 고객 캠페인 이메일 메시지를 작성해 구매 전환율을 5% 올린 일입니다. | CRM marketing, copywriting, conversion improvement |
| 엑셀 데이터를 모아 비즈니스 성과 차트를 간결하게 만든 적이 있습니다. | Data organization, reporting, analytical communication |

### State fields

| Field | Type | Purpose |
| --- | --- | --- |
| `chatHistory` | `ChatMessage[]` | Stores assistant/user message bubbles in the current browser session. |
| `personalityTags` | `string[]` | Derived visible trait tags such as `기획성향`, `데이터기반`, `문제해결`. |
| `jobs` | `JobMatch[]` | Recommendation ranking updated by interview responses. |

### MVP response behavior

For the current client-side MVP, each user answer:

1. Appends a user message.
2. Appends a simulated assistant response.
3. Adds derived personality tags.
4. Slightly boosts top recommendation scores.

Backend integration should later replace this deterministic simulation while preserving the same UI state shape.

## Step 3. Resume upload / text input

### Inputs

| Input | State field | Notes |
| --- | --- | --- |
| Resume file name | `fileName` | Text, Markdown, PDF, DOC, and DOCX can be selected. Text-like files can be read in browser; binary documents are simulated from file name plus pasted text. |
| Core experience text | `resumeText` | Free-form textarea. Minimum 20 trimmed characters for analysis. |
| Reading state | `isReadingFile` | Disables analysis while a text file is loading. |

### Validation

The user can analyze when:

```ts
fileName.trim().length > 0 || resumeText.trim().length >= 20
```

and `isReadingFile` is false.

### Extracted fields

The resume parser returns `ParsedResume`:

| Field | Type | Purpose |
| --- | --- | --- |
| `experiences` | `string[]` | Metric-bearing or representative experience lines. |
| `skills` | `string[]` | Detected tools/skills such as GA4, SQL, Python, Figma, Notion, Excel, Jira. |
| `strengths` | `string[]` | Hashtag strengths such as `#데이터분석`, `#문제발견`, `#기획성향`, `#협업강점`. |
| `jobKeywords` | `string[]` | Matched job directions such as `#서비스기획`, `#CRM마케팅`, `#데이터분석`, `#그로스마케팅`. |
| `summary` | `string` | Human-readable analysis summary for the report. |

## Step 4. Resume analysis review

### Review cards

| Card | Source field | User action |
| --- | --- | --- |
| 주요 경험 | `parsedResume.experiences` | Read-only in MVP. |
| 보유 스킬 | `parsedResume.skills` | `SQL 추가` action appends `SQL 기초`. |
| 강점 키워드 | `parsedResume.strengths` | Read-only in MVP. |
| 직무 연결 | `parsedResume.jobKeywords` | Read-only in MVP. |

### Future edit contract

When inline editing is added, edits should update `parsedResume` directly and preserve the same field names so report generation and saved reports remain compatible.

## Step 5. Recommendation priority weighting

### Weight fields

| Label | State field | Current default | Current range |
| --- | --- | --- | --- |
| 이력 적합도 | `weights.fitScore` | 30 | 5–45 |
| 직무 흥미도 | `weights.jobInterest` | 25 | 5–45 |
| 성장 가능성 | `weights.growth` | 20 | 5–45 |
| 취업 가능성 | `weights.employability` | 15 | 5–45 |
| 워라밸 | `weights.workLife` | 10 | 5–45 |

Changing a range input recalculates `jobs` and re-sorts recommendations.

## Step 6. Final report and 30/90 day action plan

### Report sections

| Section | Source | Purpose |
| --- | --- | --- |
| Fit score hero | `jobs[0]`, `parsedResume.summary` | Shows the top recommended role and why it fits. |
| Recommendation Top 3 roadmap | `jobs.slice(0, 3)` | Keeps alternate role options visible. |
| 30/90 day action plan | `createActionPlan(jobs[0], parsedResume)` | Converts the recommendation into short-term and mid-term execution steps. |
| Action checklist | `createActionItems(jobs[0], parsedResume)` | Tracks immediate preparation actions in browser storage. |
| Application board | `createApplicationLeads(jobs[0], parsedResume)` | Simulates target application leads and status movement. |
| Resume feedback | `createFeedback(parsedResume, jobs)` | Separates strengths and improvement areas. |
| Share text | `buildReportText(...)` | Produces copyable report text including the 30/90 day plan. |

### Action plan contract

The 30/90 day action plan returns two phases:

```ts
interface ActionPlanPhase {
  phase: "30일" | "90일";
  title: string;
  focus: string;
  actions: string[];
  outcome: string;
}
```

The 30-day phase should focus on portfolio evidence and first application readiness. The 90-day phase should focus on repeated applications, feedback loops, and deeper proof of the gap skills for the top recommended role.

## Stored / persisted browser state

| Storage key | Value shape | Owner UI | Notes |
| --- | --- | --- | --- |
| `jobcodi.reports` | `SavedReport[]` | Final report save/load panel | Stores the five most recent reports. |
| `jobcodi.actions.${topJob.jobName}` | `string[]` | Recommendation action checklist | Stores completed checklist item labels per top job. |
| `jobcodi.applications.${topJob.jobName}` | `Record<ApplicationLead['id'], ApplicationStatus>` | Application candidate board | Stores each candidate status per top job. |

Client-only state such as `basicInfo`, `chatHistory`, `parsedResume`, `weights`, and `jobs` currently lives in React state for the active session. Backend persistence should serialize these fields through explicit DTOs rather than reading browser internals.

## Backend DTO draft

When backend APIs are introduced, the onboarding save endpoint can start with this shape:

```ts
interface SaveOnboardingDraftRequest {
  profile: BasicInfo;
  interview: {
    messages: ChatMessage[];
    personalityTags: string[];
  };
  resume: ParsedResume;
  weights: Weights;
  recommendations: JobMatch[];
}
```

Recommended response:

```ts
interface SaveOnboardingDraftResponse {
  draftId: string;
  savedAt: string;
  nextStep: "resume" | "analysis" | "weights" | "compare" | "report";
}
```

## Current implementation references

- `src/features/jobcodi-flow/JobCodiFlow.tsx`
- `src/features/jobcodi-flow/jobcodi-flow.module.css`

## Open follow-ups

- Replace simulated AI interview scoring with a backend analysis API.
- Add inline editing for detected resume experiences and strengths.
- Add schema validation once server persistence exists.
- Decide whether saved reports should move from browser storage to authenticated user storage.
