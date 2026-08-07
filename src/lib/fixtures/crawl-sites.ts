export interface PrebuiltCrawlSite {
  id: string;
  displayName: string;
  description: string;
  logoUrl?: string;
  termsUrl: string;
  entryUrls: string[];
  minIntervalMs: number;
  enabled: boolean;
}

/** 사전 정의된 4개 크롤링 사이트 (실제 외부 호출은 mock 처리) */
export const PREBUILT_CRAWL_SITES: PrebuiltCrawlSite[] = [
  {
    id: "saramin",
    displayName: "사람인",
    description: "대한민국 대표 취업 플랫폼",
    termsUrl: "https://www.saramin.co.kr/w/saramin/terms",
    entryUrls: ["https://www.saramin.co.kr/zf_user/search/recruit"],
    minIntervalMs: 2000,
    enabled: true,
  },
  {
    id: "jobkorea",
    displayName: "잡코리아",
    description: "국내 최대 채용정보 사이트",
    termsUrl: "https://www.jobkorea.co.kr/about/terms",
    entryUrls: ["https://www.jobkorea.co.kr/recruit/joblist"],
    minIntervalMs: 2000,
    enabled: true,
  },
  {
    id: "jasoseol",
    displayName: "자소설",
    description: "신입·인턴·대외활동 전문",
    termsUrl: "https://jasoseol.com/terms",
    entryUrls: ["https://jasoseol.com/"],
    minIntervalMs: 2000,
    enabled: true,
  },
  {
    id: "catch",
    displayName: "캐치",
    description: "IT·스타트업 채용 전문",
    termsUrl: "https://catch.co.kr/terms",
    entryUrls: ["https://catch.co.kr/"],
    minIntervalMs: 2000,
    enabled: true,
  },
];
