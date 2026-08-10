import { describe, expect, it } from "vitest";
import {
  JOB_DETAIL_FALLBACK_TITLE,
  formatJobDetailDocumentTitle,
} from "./job-detail-document-title";

describe("formatJobDetailDocumentTitle", () => {
  it("불러온 공고의 제목과 회사명을 기존 탭 제목 형식으로 조합한다", () => {
    expect(
      formatJobDetailDocumentTitle({
        title: "프론트엔드 엔지니어",
        companyName: "잡코디",
      }),
    ).toBe("프론트엔드 엔지니어 · 잡코디 | JobCodi");
  });

  it("공고가 아직 없거나 불러오지 못한 상태에는 안전한 제목을 반환한다", () => {
    expect(formatJobDetailDocumentTitle()).toBe(JOB_DETAIL_FALLBACK_TITLE);
  });
});
