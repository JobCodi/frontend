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

/** 선택 가능한 운영 수집 소스. 활성화 상태는 서버의 API 키/운영 opt-in에 따라 달라진다. */
export const PREBUILT_CRAWL_SITES: PrebuiltCrawlSite[] = [
  {
    id: "saramin",
    displayName: "사람인",
    description: "공식 채용 Open API · API 키 연결 후 수집",
    termsUrl: "https://www.saramin.co.kr/w/saramin/terms",
    entryUrls: ["https://www.saramin.co.kr/zf_user/search/recruit"],
    minIntervalMs: 2000,
    enabled: true,
  },
  {
    id: "jobkorea",
    displayName: "잡코리아",
    description: "공개 채용 목록 · robots.txt 준수 opt-in 수집",
    termsUrl: "https://www.jobkorea.co.kr/about/terms",
    entryUrls: ["https://www.jobkorea.co.kr/recruit/joblist"],
    minIntervalMs: 2000,
    enabled: true,
  },
  {
    id: "jasoseol",
    displayName: "자소설닷컴",
    description: "신입·인턴 채용 목록 · robots.txt 준수 opt-in 수집",
    termsUrl: "https://jasoseol.com/terms",
    entryUrls: ["https://jasoseol.com/recruit"],
    minIntervalMs: 2000,
    enabled: true,
  },
];
