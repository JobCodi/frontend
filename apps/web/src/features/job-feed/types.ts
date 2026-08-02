export type {
  FeedItem,
  FeedPage,
  FeedReadyPage,
  FeedCollectingPage,
  FeedFailedPage,
  FeedSort,
  MinScore,
  FeedQueryParams,
  SourceSummaryEntry,
  FeedCollectionStatus,
  JobPosting,
} from "@/lib/schemas/feed";
export type { JobView, JobViewContext } from "./lib/to-job-view";

export const DEFAULT_SORT = "score" as const;
export const DEFAULT_MIN_SCORE = 0 as const;

export const SORT_OPTIONS: { value: "score" | "recent" | "deadline"; label: string }[] = [
  { value: "score", label: "매칭순" },
  { value: "recent", label: "최신순" },
  { value: "deadline", label: "마감임박순" },
];

export const MIN_SCORE_OPTIONS: { value: 0 | 60 | 80; label: string }[] = [
  { value: 0, label: "전체" },
  { value: 60, label: "60점 이상" },
  { value: 80, label: "80점 이상" },
];
