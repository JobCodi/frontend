
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import styles from "./jobcodi-flow.module.css";

type StepId = "landing" | "basic" | "interview" | "resume" | "analysis" | "weights" | "compare" | "report";
interface BasicInfo {
  status: string;
  fields: string[];
  tasks: string[];
  workType: string;
  region: string;
  salary: string;
  timeline: string;
}

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
}

interface ParsedResume {
  experiences: string[];
  skills: string[];
  strengths: string[];
  jobKeywords: string[];
  summary: string;
}

interface Weights {
  fitScore: number;
  jobInterest: number;
  growth: number;
  employability: number;
  workLife: number;
}

interface JobMatch {
  jobName: string;
  score: number;
  badge: string;
  fitDetail: number;
  interestDetail: number;
  growthDetail: number;
  difficulty: "낮음" | "보통" | "높음";
  expectedPostCount: string;
}

interface SavedReport {
  id: string;
  createdAt: string;
  topJob: string;
  score: number;
  basicInfo: BasicInfo;
  parsedResume: ParsedResume;
  jobs: JobMatch[];
  serverDraftId?: string;
  serverReportId?: string;
}

interface ServerReportSaveResult {
  draftId: string;
  reportId: string;
  reportUrl: string;
}

type ServerSaveState = "idle" | "saving" | "saved" | "fallback" | "unconfigured";
type ApplicationStatus = "saved" | "planned" | "applied";

interface ApplicationLead {
  id: string;
  title: string;
  company: string;
  fit: number;
  due: string;
  matchPoint: string;
  prepAction: string;
}

interface ActionPlanPhase {
  phase: "30일" | "90일";
  title: string;
  focus: string;
  actions: string[];
  outcome: string;
}

const stepOrder: StepId[] = ["landing", "basic", "interview", "resume", "analysis", "weights", "compare", "report"];
const wizardSteps: Array<{ id: StepId; label: string; eyebrow: string }> = [
  { id: "basic", label: "기본 정보", eyebrow: "Profile" },
  { id: "interview", label: "AI 인터뷰", eyebrow: "Interview" },
  { id: "resume", label: "이력서", eyebrow: "Resume" },
  { id: "weights", label: "중요도", eyebrow: "Priority" },
  { id: "compare", label: "직무 비교", eyebrow: "Compare" },
  { id: "report", label: "리포트", eyebrow: "Report" },
];

const statusOptions = ["대학생", "취준생", "인턴 경험", "주니어", "이직 준비"];
const fieldOptions = ["기획/전략", "마케팅/광고", "데이터/분석", "IT/개발", "디자인", "영업/CS"];
const taskOptions = ["문제 발견", "데이터 분석", "서비스 개선", "사람 설득", "콘텐츠 제작", "프로세스 설계", "요구사항 정의", "스토리보드 작성"];
const workTypeOptions = ["전체", "정규직", "계약직", "인턴"];
const regionOptions = ["전체", "서울", "경기", "인천", "원격", "부산"];
const salaryOptions = ["회사 내규 따름", "3,000만원 이상", "4,000만원 이상", "5,000만원 이상"];
const timelineOptions = ["즉시", "3개월 이내", "6개월 이내", "상황에 따라"];

const baselineJobs: JobMatch[] = [
  { jobName: "서비스기획", score: 92, badge: "가장 추천", fitDetail: 90, interestDetail: 88, growthDetail: 85, difficulty: "낮음", expectedPostCount: "1,245개" },
  { jobName: "CRM 마케팅", score: 87, badge: "추천", fitDetail: 85, interestDetail: 82, growthDetail: 80, difficulty: "낮음", expectedPostCount: "1,076개" },
  { jobName: "데이터 분석", score: 84, badge: "준비 후 추천", fitDetail: 68, interestDetail: 85, growthDetail: 90, difficulty: "높음", expectedPostCount: "2,110개" },
  { jobName: "PM", score: 80, badge: "장기 목표", fitDetail: 64, interestDetail: 92, growthDetail: 92, difficulty: "높음", expectedPostCount: "967개" },
  { jobName: "그로스 마케팅", score: 75, badge: "도전 가능", fitDetail: 60, interestDetail: 80, growthDetail: 82, difficulty: "보통", expectedPostCount: "820개" },
];

const initialInfo: BasicInfo = {
  status: "취준생",
  fields: ["기획/전략"],
  tasks: ["서비스 개선", "문제 발견"],
  workType: "전체",
  region: "서울",
  salary: "회사 내규 따름",
  timeline: "3개월 이내",
};

const initialResume: ParsedResume = {
  experiences: ["에듀테크 스타트업 마케팅 인턴 6개월", "프로모션 최적화로 회원가입 전환율 12% → 18% 개선", "IT 동아리 프로덕트 매니저 8개월"],
  skills: ["GA4", "Excel", "Figma", "Notion"],
  strengths: ["#데이터분석", "#문제발견", "#기획성향"],
  jobKeywords: ["#서비스기획", "#CRM마케팅", "#데이터분석"],
  summary: "사용자 분석 경험과 프로덕트 관리 경험을 겸비하고 있어, 정량 지표 분석 능력을 탑재한 서비스 기획자 및 CRM 마케터 직군으로 매칭 확률이 높습니다.",
};

function pickKeywords(source: string, dictionary: Record<string, string[]>) {
  const normalized = source.toLowerCase();
  return Object.entries(dictionary)
    .filter(([, keys]) => keys.some((key) => normalized.includes(key.toLowerCase())))
    .map(([label]) => label);
}

function analyzeResumeInput(source: string, fileName?: string): ParsedResume {
  const text = `${fileName ?? ""}\n${source}`.trim();
  const skills = [
    ...pickKeywords(text, {
      GA4: ["ga4", "google analytics", "구글 애널리틱스"],
      SQL: ["sql", "query", "쿼리"],
      Python: ["python", "파이썬", "pandas"],
      Figma: ["figma", "피그마", "와이어프레임"],
      Notion: ["notion", "노션"],
      Excel: ["excel", "엑셀", "스프레드시트"],
      Jira: ["jira", "지라", "백로그"],
    }),
  ];
  const strengths = [
    ...pickKeywords(text, {
      "#데이터분석": ["데이터", "분석", "지표", "전환율", "코호트", "sql", "ga4"],
      "#문제발견": ["문제", "개선", "이탈", "가설", "실험"],
      "#기획성향": ["기획", "pm", "prd", "요구사항", "스토리보드", "와이어프레임"],
      "#협업강점": ["협업", "커뮤니케이션", "개발자", "디자이너", "이해관계자"],
      "#성장지향": ["학습", "스터디", "개선", "회고", "성장"],
    }),
  ];
  const jobKeywords = [
    ...pickKeywords(text, {
      "#서비스기획": ["서비스기획", "서비스 기획", "pm", "prd", "요구사항", "와이어프레임", "스토리보드"],
      "#CRM마케팅": ["crm", "마케팅", "캠페인", "리텐션", "이메일", "푸시"],
      "#데이터분석": ["데이터 분석", "sql", "python", "dashboard", "대시보드", "ga4"],
      "#그로스마케팅": ["그로스", "ab", "a/b", "전환율", "퍼널"],
    }),
  ];
  const cleanedLines = source
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•\s]+/, "").trim())
    .filter(Boolean);
  const metricLines = cleanedLines.filter((line) => /\d|%|개선|증가|감소|달성/.test(line));
  const experienceLines = [...new Set([...metricLines, ...cleanedLines])].slice(0, 4);
  const finalSkills = skills.length ? skills : initialResume.skills;
  const finalStrengths = strengths.length ? strengths : initialResume.strengths;
  const finalJobs = jobKeywords.length ? jobKeywords : initialResume.jobKeywords;

  return {
    experiences: experienceLines.length ? experienceLines : initialResume.experiences,
    skills: [...new Set(finalSkills)].slice(0, 8),
    strengths: [...new Set(finalStrengths)].slice(0, 6),
    jobKeywords: [...new Set(finalJobs)].slice(0, 5),
    summary: `${fileName ? `${fileName}에서` : "입력한 이력 내용에서"} ${[...new Set(finalSkills)].slice(0, 3).join(", ")} 역량과 ${[...new Set(finalStrengths)].slice(0, 2).join(" · ")} 신호가 확인되었습니다. JobCodi는 이를 바탕으로 ${[...new Set(finalJobs)].slice(0, 2).join(" / ") || "서비스기획 / CRM마케팅"} 직무와의 연결 가능성을 우선 검토합니다.`,
  };
}

const jobDetails: Record<string, { salary: string; tools: string[]; gapSkills: string[]; project: string; description: string }> = {
  서비스기획: {
    salary: "평균 3,600만 ~ 4,500만원",
    tools: ["Figma", "Notion", "Jira", "GA4"],
    gapSkills: ["PRD 작성", "화면 흐름도 설계", "정량 지표 기반 가설 수립"],
    project: "자주 쓰는 앱의 회원가입 이탈률 분석과 개선 와이어프레임 역기획",
    description: "사용자 문제를 정량/정성 데이터로 해석하고 개발·디자인 사이에서 제품 개선안을 설계합니다.",
  },
  "CRM 마케팅": {
    salary: "평균 3,400만 ~ 4,200만원",
    tools: ["GA4", "Braze", "Excel", "SQL"],
    gapSkills: ["고객 코호트 설계", "A/B 테스트 시나리오", "라이프사이클 메시징"],
    project: "신규 가입자를 첫 구매로 유도하는 이메일/앱 푸시 트리거 시나리오 기획",
    description: "고객 행동 데이터를 기반으로 개인화 메시지와 리텐션 캠페인을 설계합니다.",
  },
  "데이터 분석": {
    salary: "평균 3,800만 ~ 4,800만원",
    tools: ["SQL", "Python", "Tableau", "GA4"],
    gapSkills: ["SQL JOIN/서브쿼리", "대시보드 자동화", "실험 분석"],
    project: "공공 데이터 또는 커머스 데이터를 활용한 코호트 분석 노트북 보고서",
    description: "비즈니스 지표를 쿼리하고 숨겨진 패턴을 찾아 의사결정 가이드를 만듭니다.",
  },
  PM: {
    salary: "평균 3,800만 ~ 4,600만원",
    tools: ["Jira", "Confluence", "Figma", "Amplitude"],
    gapSkills: ["로드맵 설계", "백로그 우선순위", "스프린트 운영"],
    project: "신규 서비스 MVP 스코프 정의서와 릴리즈 백로그 작성",
    description: "프로덕트 목표와 실행 우선순위를 연결하고 릴리즈 흐름을 리딩합니다.",
  },
};

const suggestions = [
  "GA4 데이터를 보고 유입이 떨어진 페이지를 분석해 이탈률을 낮췄던 일입니다.",
  "개발자, 디자이너와 소통하며 화면 설계 와이어프레임을 만든 일이에요.",
  "고객 캠페인 이메일 메시지를 작성해 구매 전환율을 5% 올린 일입니다.",
  "엑셀 데이터를 모아 비즈니스 성과 차트를 간결하게 만든 적이 있습니다.",
];

export function JobCodiFlow() {
  const [step, setStep] = useState<StepId>("landing");
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(initialInfo);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: "ai-start", role: "assistant", content: "안녕하세요! 저는 JobCodi AI입니다. 지금까지 프로젝트나 업무를 하며 가장 성취감을 느낀 경험을 편하게 들려주세요." },
  ]);
  const [personalityTags, setPersonalityTags] = useState(["기획성향", "실무지능", "협업추구"]);
  const [parsedResume, setParsedResume] = useState<ParsedResume>(initialResume);
  const [weights, setWeights] = useState<Weights>({ fitScore: 30, jobInterest: 25, growth: 20, employability: 15, workLife: 10 });
  const [jobs, setJobs] = useState<JobMatch[]>(baselineJobs);
  const [expandedJob, setExpandedJob] = useState<string | null>("서비스기획");
  const [resumeFeedback, setResumeFeedback] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const reports = JSON.parse(window.localStorage.getItem("jobcodi.reports") ?? "[]") as SavedReport[];
      return Array.isArray(reports) ? reports : [];
    } catch {
      return [];
    }
  });

  const stepIndex = stepOrder.indexOf(step);
  const activeWizardIndex = Math.max(0, wizardSteps.findIndex((item) => item.id === step));
  const progress = Math.round((Math.max(1, stepIndex) / (stepOrder.length - 1)) * 100);

  const reset = () => {
    setStep("landing");
    setBasicInfo(initialInfo);
    setChatHistory([{ id: "ai-start", role: "assistant", content: "안녕하세요! 저는 JobCodi AI입니다. 지금까지 프로젝트나 업무를 하며 가장 성취감을 느낀 경험을 편하게 들려주세요." }]);
    setPersonalityTags(["기획성향", "실무지능", "협업추구"]);
    setParsedResume(initialResume);
    setWeights({ fitScore: 30, jobInterest: 25, growth: 20, employability: 15, workLife: 10 });
    setJobs(baselineJobs);
    setResumeFeedback(false);
  };

  const goPrev = () => setStep(stepOrder[Math.max(stepIndex - 1, 1)]);

  const loadSavedReport = (report: SavedReport) => {
    setBasicInfo(report.basicInfo);
    setParsedResume(report.parsedResume);
    setJobs(report.jobs.length ? report.jobs : baselineJobs);
    setExpandedJob(report.topJob);
    setResumeFeedback(false);
    setStep("report");
  };

  const clearSavedReports = () => {
    localStorage.removeItem("jobcodi.reports");
    setSavedReports([]);
  };

  const rememberSavedReport = (report: SavedReport) => setSavedReports((prev) => [report, ...prev.filter((item) => item.id !== report.id)].slice(0, 5));

  if (step === "landing") {
    return <LandingPage onStartInterview={() => setStep("basic")} onStartResume={() => setStep("resume")} />;
  }

  return (
    <main className={styles.appShell}>
      <AppHeader onReset={reset} />
      <div className={styles.workspace}>
        <aside className={styles.sidebar} aria-label="진단 단계">
          <div className={styles.sidebarTop}>
            <span>Diagnostic Flow</span>
            <strong>{progress}%</strong>
          </div>
          <div className={styles.progressRail}><span style={{ height: `${progress}%` }} /></div>
          <div className={styles.stepList}>
            {wizardSteps.map((item, index) => {
              const isActive = item.id === step || (step === "analysis" && item.id === "resume");
              const isDone = index < activeWizardIndex || step === "report";
              return (
                <button key={item.id} className={isActive ? styles.stepActive : styles.stepButton} onClick={() => setStep(item.id)} type="button">
                  <span className={isDone ? styles.stepDoneDot : styles.stepDot}>{isDone ? "✓" : index + 1}</span>
                  <span><small>{item.eyebrow}</small>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>
        <section className={styles.stage}>
          {step === "basic" && <BasicInfoStep data={basicInfo} onChange={setBasicInfo} onNext={() => setStep("interview")} />}
          {step === "interview" && <InterviewStep basicInfo={basicInfo} chatHistory={chatHistory} personalityTags={personalityTags} jobs={jobs} onChat={setChatHistory} onTags={setPersonalityTags} onJobs={setJobs} onPrev={goPrev} onNext={() => setStep("resume")} />}
          {step === "resume" && <ResumeUploadStep onPrev={() => setStep("interview")} onAnalyze={(nextResume) => { setParsedResume(nextResume); setStep("analysis"); }} />}
          {step === "analysis" && <ResumeAnalysisStep parsedResume={parsedResume} onChange={setParsedResume} onPrev={() => setStep("resume")} onNext={() => setStep("weights")} />}
          {step === "weights" && <WeightsStep weights={weights} jobs={jobs} onWeights={setWeights} onJobs={setJobs} onPrev={() => setStep("analysis")} onNext={() => setStep("compare")} />}
          {step === "compare" && <CompareStep jobs={jobs} expandedJob={expandedJob} onExpand={setExpandedJob} onPrev={() => setStep("weights")} onNext={() => setStep("report")} />}
          {step === "report" && <ReportStep key={jobs[0]?.jobName ?? "report"} basicInfo={basicInfo} chatHistory={chatHistory} personalityTags={personalityTags} parsedResume={parsedResume} weights={weights} jobs={jobs} feedback={resumeFeedback} savedReports={savedReports} onFeedback={() => setResumeFeedback(true)} onRestart={reset} onSave={rememberSavedReport} onLoadSaved={loadSavedReport} onClearSaved={clearSavedReports} />}
        </section>
      </div>
      <footer className={styles.footer}>© 2026 JobCodi AI Career Diagnostics. 모든 이력 데이터는 안전한 진단 환경에서 처리됩니다.</footer>
    </main>
  );
}

function AppHeader({ onReset }: { onReset: () => void }) {
  return (
    <header className={styles.appHeader}>
      <button className={styles.wordmark} onClick={onReset} type="button" aria-label="처음으로 돌아가기">
        <Image src="/brand/05_app_icon_white.png" alt="" width={34} height={34} priority />
        <span>Job<strong>Codi</strong></span>
        <em>AI Coordinator</em>
      </button>
      <div className={styles.headerActions}>
        <span className={styles.liveBadge}>✦ 실시간 AI 엔진 구동 중</span>
        <button onClick={onReset} type="button">진단 초기화</button>
      </div>
    </header>
  );
}

function LandingPage({ onStartInterview, onStartResume }: { onStartInterview: () => void; onStartResume: () => void }) {
  return (
    <main className={styles.landingShell}>
      <AppHeader onReset={() => undefined} />
      <section className={styles.heroSection}>
        <div className={styles.heroBadge}>✨ 성향 진단부터 이력 분석까지 원스톱 커리어 코디</div>
        <h1>AI가 내 커리어를<br /><span>코디해드립니다</span></h1>
        <p>현재 이력과 숨은 업무 성향을 정밀 분석하여, 지금 당장 지원 가능한 현실적인 직무와 한 단계 더 성장할 수 있는 도전 직무를 추천합니다.</p>
        <div className={styles.ctaGrid}>
          <button className={styles.ctaCard} onClick={onStartInterview} type="button">
            <span className={styles.ctaIcon}>🧭</span>
            <strong>내 숨은 직무 찾기</strong>
            <p>이력서가 없어도 괜찮아요. 기본 정보와 AI 대화로 최적 업무 트랙을 찾아냅니다.</p>
            <b>AI 인터뷰 시작하기 →</b>
          </button>
          <button className={styles.ctaCardAlt} onClick={onStartResume} type="button">
            <span className={styles.ctaIcon}>📄</span>
            <strong>이력서로 추천받기</strong>
            <p>기존 이력서가 있다면 한 장으로 즉시 진단하고 경험 키워드를 직무 후보와 매핑합니다.</p>
            <b>이력서 즉시 업로드 →</b>
          </button>
        </div>
        <div className={styles.featureGrid}>
          {[
            ["✨", "AI 맞춤 분석", "이력과 대화를 융합한 심층 분석"],
            ["🧭", "추천 순위 코디", "개인 관심 가중치에 따른 재정렬"],
            ["🏆", "정량 역량 인사이트", "부족 역량과 준비 액션 제시"],
            ["💼", "채용 연계 가이드", "매칭 공고 규모와 난이도 비교"],
          ].map(([icon, title, desc]) => <article key={title}><span>{icon}</span><strong>{title}</strong><p>{desc}</p></article>)}
        </div>
      </section>
      <footer className={styles.landingFooter}>10만+ 취업 준비생과 주니어 기획자들의 선택 · JobCodi AI</footer>
    </main>
  );
}

function BasicInfoStep({ data, onChange, onNext }: { data: BasicInfo; onChange: (data: BasicInfo) => void; onNext: () => void }) {
  const toggle = (key: "fields" | "tasks", value: string) => onChange({ ...data, [key]: data[key].includes(value) ? data[key].filter((item) => item !== value) : [...data[key], value] });
  const setValue = (key: keyof BasicInfo, value: string) => onChange({ ...data, [key]: value });
  const isValid = data.status && data.fields.length > 0 && data.tasks.length > 0;
  return (
    <div className={styles.twoColumnStep}>
      <section className={styles.panel}>
        <StepTitle icon="📋" title="기본 정보를 입력해주세요" desc="정확한 성향 분석과 추천을 위해 현재 상태와 관심 분야를 설정합니다." />
        <Question title="1. 현재 상태" required><ChipGroup options={statusOptions} selected={[data.status]} onSelect={(v) => setValue("status", v)} /></Question>
        <Question title="2. 관심 분야" hint="복수 선택 가능" required><ChipGroup options={fieldOptions} selected={data.fields} onSelect={(v) => toggle("fields", v)} multi /></Question>
        <Question title="3. 선호 업무" hint="복수 선택 가능" required><ChipGroup options={taskOptions} selected={data.tasks} onSelect={(v) => toggle("tasks", v)} multi /></Question>
        <div className={styles.selectGrid}>
          <SelectField label="근무 형태" value={data.workType} options={workTypeOptions} onChange={(v) => setValue("workType", v)} />
          <SelectField label="희망 지역" value={data.region} options={regionOptions} onChange={(v) => setValue("region", v)} />
          <SelectField label="연봉 수준" value={data.salary} options={salaryOptions} onChange={(v) => setValue("salary", v)} />
          <SelectField label="구직 시점" value={data.timeline} options={timelineOptions} onChange={(v) => setValue("timeline", v)} />
        </div>
        <NavActions nextLabel="AI 인터뷰 시작" onNext={onNext} disabled={!isValid} />
      </section>
      <aside className={styles.insightCard}>
        <span>JobCodi Preview</span>
        <strong>{data.fields.join(" · ") || "관심 분야"}</strong>
        <p>{data.status} · {data.region} · {data.timeline}</p>
        <div>{data.tasks.map((task) => <em key={task}>#{task}</em>)}</div>
      </aside>
    </div>
  );
}

function InterviewStep({ basicInfo, chatHistory, personalityTags, jobs, onChat, onTags, onJobs, onPrev, onNext }: { basicInfo: BasicInfo; chatHistory: ChatMessage[]; personalityTags: string[]; jobs: JobMatch[]; onChat: (items: ChatMessage[]) => void; onTags: (items: string[]) => void; onJobs: (items: JobMatch[]) => void; onPrev: () => void; onNext: () => void }) {
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  const nextMessageId = (prefix: string) => {
    messageIdRef.current += 1;
    return `${prefix}-${messageIdRef.current}`;
  };
  const send = (text: string) => {
    if (!text.trim()) return;
    const user: ChatMessage = { id: nextMessageId("user"), role: "user", content: text };
    const ai: ChatMessage = { id: nextMessageId("ai"), role: "assistant", content: `좋아요. ${basicInfo.fields[0]} 관심과 ${basicInfo.tasks[0]} 경험이 연결됩니다. 답변을 바탕으로 서비스기획/CRM/데이터 분석 순으로 매칭 점수를 업데이트했어요.` };
    onChat([...chatHistory, user, ai]);
    onTags([...new Set([...personalityTags, "데이터기반", "문제해결"])]);
    onJobs(jobs.map((job, index) => ({ ...job, score: Math.min(96, job.score + (index < 2 ? 2 : 0)) })).sort((a, b) => b.score - a.score));
    setInput("");
    requestAnimationFrame(() => chatRef.current?.scrollIntoView({ behavior: "smooth" }));
  };
  return (
    <div className={styles.interviewGrid}>
      <section className={styles.panel}>
        <StepTitle icon="💬" title="AI 직무 인터뷰" desc="JobCodi AI가 성취 경험과 선호 업무를 묻고 직무 후보를 좁혀갑니다." />
        <div className={styles.chatBox}>
          {chatHistory.map((msg) => <div key={msg.id} className={msg.role === "assistant" ? styles.aiBubble : styles.userBubble}><p>{msg.content}</p></div>)}
          <div ref={chatRef} />
        </div>
        <div className={styles.suggestionRow}>{suggestions.map((item) => <button key={item} onClick={() => send(item)} type="button">{item}</button>)}</div>
        <div className={styles.chatInput}><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="답변을 입력해주세요..." /><button onClick={() => send(input)} type="button">전송</button></div>
        <NavActions prevLabel="이전 단계" nextLabel="이력서 분석으로" onPrev={onPrev} onNext={onNext} />
      </section>
      <aside className={styles.panelSoft}>
        <h3>실시간 성향 태그</h3>
        <div className={styles.tagCloud}>{personalityTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <h3>현재 추천 순위</h3>
        <MiniJobList jobs={jobs.slice(0, 3)} />
      </aside>
    </div>
  );
}

function ResumeUploadStep({ onPrev, onAnalyze }: { onPrev: () => void; onAnalyze: (resume: ParsedResume) => void }) {
  const [fileName, setFileName] = useState("resume_jobcodi_sample.pdf");
  const [resumeText, setResumeText] = useState("프로모션 랜딩 페이지 전환율을 GA4로 분석하고, Figma 와이어프레임 개선안을 만들어 가입 전환율을 12%에서 18%로 개선했습니다.\n개발자·디자이너와 협업해 요구사항을 정리하고 Notion/Jira로 백로그를 관리했습니다.");
  const [isReadingFile, setIsReadingFile] = useState(false);
  const canAnalyze = fileName.trim().length > 0 || resumeText.trim().length >= 20;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      setIsReadingFile(true);
      const reader = new FileReader();
      reader.onload = () => {
        setResumeText(String(reader.result ?? ""));
        setIsReadingFile(false);
      };
      reader.onerror = () => setIsReadingFile(false);
      reader.readAsText(file);
    }
  };

  const runAnalysis = () => {
    onAnalyze(analyzeResumeInput(resumeText, fileName));
  };

  const preview = analyzeResumeInput(resumeText, fileName);

  return (
    <section className={styles.panel}>
      <StepTitle icon="📤" title="이력서 업로드" desc="파일을 선택하거나 핵심 경험을 붙여넣으면 JobCodi가 경험·스킬·직무 키워드를 추출합니다." />
      <div className={styles.resumeInputGrid}>
        <label className={styles.uploadBox}>
          <input type="file" accept=".txt,.md,.pdf,.doc,.docx" onChange={handleFileChange} />
          <span>📎</span>
          <strong>{fileName || "이력서 파일 선택"}</strong>
          <p>{isReadingFile ? "텍스트 파일을 읽는 중입니다..." : "PDF/DOCX는 파일명과 붙여넣은 텍스트를 기준으로 분석을 시뮬레이션합니다."}</p>
          <b>파일 선택하기</b>
        </label>
        <div className={styles.resumeTextBox}>
          <label htmlFor="resume-text">핵심 경험 붙여넣기</label>
          <textarea
            id="resume-text"
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="예: GA4로 전환율을 분석하고 Figma 와이어프레임을 개선해 가입 전환율을 12%에서 18%로 높였습니다."
          />
          <small>{resumeText.trim().length}자 입력됨 · 20자 이상이면 분석 가능</small>
        </div>
      </div>
      <div className={styles.resumePreview}>
        <h3>실시간 추출 미리보기</h3>
        <div>
          {preview.skills.slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}
          {preview.strengths.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
          {preview.jobKeywords.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <p>{preview.summary}</p>
      </div>
      <NavActions prevLabel="AI 인터뷰로" nextLabel="이력 분석 보기" onPrev={onPrev} onNext={runAnalysis} disabled={!canAnalyze || isReadingFile} />
    </section>
  );
}

function ResumeAnalysisStep({ parsedResume, onChange, onPrev, onNext }: { parsedResume: ParsedResume; onChange: (item: ParsedResume) => void; onPrev: () => void; onNext: () => void }) {
  const addSkill = () => onChange({ ...parsedResume, skills: [...new Set([...parsedResume.skills, "SQL 기초"])] });
  return (
    <section className={styles.panel}>
      <StepTitle icon="🔎" title="이력 분석 결과" desc="이력서에서 추출한 경험, 보유 스킬, 강점 키워드를 검수합니다." />
      <div className={styles.analysisGrid}>
        <InfoCard title="주요 경험" items={parsedResume.experiences} />
        <InfoCard title="보유 스킬" items={parsedResume.skills} action={addSkill} actionLabel="SQL 추가" />
        <InfoCard title="강점 키워드" items={parsedResume.strengths} />
        <InfoCard title="직무 연결" items={parsedResume.jobKeywords} />
      </div>
      <div className={styles.summaryBox}>{parsedResume.summary}</div>
      <NavActions prevLabel="이력서 수정" nextLabel="중요도 설정" onPrev={onPrev} onNext={onNext} />
    </section>
  );
}

function WeightsStep({ weights, jobs, onWeights, onJobs, onPrev, onNext }: { weights: Weights; jobs: JobMatch[]; onWeights: (weights: Weights) => void; onJobs: (jobs: JobMatch[]) => void; onPrev: () => void; onNext: () => void }) {
  const entries: Array<[keyof Weights, string]> = [["fitScore", "이력 적합도"], ["jobInterest", "직무 흥미도"], ["growth", "성장 가능성"], ["employability", "취업 가능성"], ["workLife", "워라밸"]];
  const setWeight = (key: keyof Weights, value: number) => {
    const next = { ...weights, [key]: value };
    onWeights(next);
    onJobs(jobs.map((job) => ({ ...job, score: Math.max(60, Math.min(98, Math.round(job.fitDetail * (next.fitScore / 100) + job.interestDetail * (next.jobInterest / 100) + job.growthDetail * (next.growth / 100) + 35))) })).sort((a, b) => b.score - a.score));
  };
  return (
    <section className={styles.panel}>
      <StepTitle icon="🎚️" title="중요도 설정" desc="당신이 중요하게 보는 기준을 조정하면 직무 추천 순위가 즉시 바뀝니다." />
      <div className={styles.weightGrid}>{entries.map(([key, label]) => <label key={key} className={styles.rangeItem}><span>{label}<b>{weights[key]}%</b></span><input type="range" min="5" max="45" value={weights[key]} onChange={(e) => setWeight(key, Number(e.target.value))} /></label>)}</div>
      <MiniJobList jobs={jobs.slice(0, 4)} large />
      <NavActions prevLabel="분석 결과로" nextLabel="직무 비교" onPrev={onPrev} onNext={onNext} />
    </section>
  );
}

function CompareStep({ jobs, expandedJob, onExpand, onPrev, onNext }: { jobs: JobMatch[]; expandedJob: string | null; onExpand: (job: string | null) => void; onPrev: () => void; onNext: () => void }) {
  return (
    <section className={styles.panel}>
      <StepTitle icon="⚖️" title="후보 직무 비교" desc="AI 분석 결과를 토대로 매칭도, 난이도, 준비 액션을 한눈에 비교합니다." />
      <div className={styles.jobCardGrid}>{jobs.slice(0, 4).map((job, index) => <JobScoreCard key={job.jobName} job={job} rank={index + 1} />)}</div>
      <div className={styles.compareTable}>{jobs.slice(0, 4).map((job) => <article key={job.jobName} className={styles.compareRow}><button onClick={() => onExpand(expandedJob === job.jobName ? null : job.jobName)} type="button"><strong>{job.jobName}</strong><span>{job.fitDetail}% · {job.interestDetail}% · {job.growthDetail}%</span><b>{expandedJob === job.jobName ? "접기" : "상세"}</b></button>{expandedJob === job.jobName && <JobDetail name={job.jobName} />}</article>)}</div>
      <NavActions prevLabel="중요도 수정" nextLabel="종합 리포트 생성" onPrev={onPrev} onNext={onNext} />
    </section>
  );
}

function buildReportText(basicInfo: BasicInfo, parsedResume: ParsedResume, jobs: JobMatch[], actionPlan: ActionPlanPhase[]) {
  const topJob = jobs[0];
  return [
    "[JobCodi 종합 커리어 매칭 리포트]",
    `상태: ${basicInfo.status}`,
    `희망 조건: ${basicInfo.region} · ${basicInfo.workType} · ${basicInfo.salary}`,
    `1순위 추천 직무: ${topJob.jobName} (${topJob.score}점)`,
    `핵심 스킬: ${parsedResume.skills.slice(0, 5).join(", ")}`,
    `강점 키워드: ${parsedResume.strengths.join(", ")}`,
    `요약: ${parsedResume.summary}`,
    "",
    "[30/90일 실행 계획]",
    ...actionPlan.flatMap((phase) => [
      `${phase.phase} - ${phase.title}`,
      `초점: ${phase.focus}`,
      ...phase.actions.map((action, index) => `${index + 1}. ${action}`),
      `완료 산출물: ${phase.outcome}`,
    ]),
    "",
    `다음 액션: ${jobDetails[topJob.jobName]?.project ?? "추천 직무에 맞춘 포트폴리오 프로젝트를 1개 정리하세요."}`,
  ].join("\n");
}

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the textarea-based fallback for restricted browser contexts.
    }
  }
  return new Promise<void>((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (ok) {
        resolve();
      } else {
        reject(new Error("Copy command failed"));
      }
    } catch (error) {
      document.body.removeChild(textarea);
      reject(error instanceof Error ? error : new Error("Copy failed"));
    }
  });
}

function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
}

function buildOnboardingDraftPayload({ basicInfo, chatHistory, personalityTags, parsedResume, weights, jobs, completedActions, applicationStatuses }: { basicInfo: BasicInfo; chatHistory: ChatMessage[]; personalityTags: string[]; parsedResume: ParsedResume; weights: Weights; jobs: JobMatch[]; completedActions: string[]; applicationStatuses: Record<string, ApplicationStatus> }) {
  return {
    currentStep: "report" as StepId,
    profile: basicInfo,
    interview: {
      messages: chatHistory.map((message) => ({ ...message, createdAt: new Date().toISOString() })),
      personalityTags,
    },
    resume: parsedResume,
    weights,
    recommendations: jobs.slice(0, 3),
    reportState: {
      completedActions,
      applicationStatuses: Object.entries(applicationStatuses).map(([leadId, status]) => ({ leadId, status, updatedAt: new Date().toISOString() })),
    },
    clientMeta: {
      appVersion: "0.1.0-alpha",
      locale: "ko-KR" as const,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
}

async function saveReportToBackend(payload: ReturnType<typeof buildOnboardingDraftPayload>): Promise<ServerReportSaveResult | null> {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) return null;
  const createResponse = await fetch(`${baseUrl}/api/onboarding-drafts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!createResponse.ok) throw new Error(`Failed to create onboarding draft: ${createResponse.status}`);
  const created = (await createResponse.json()) as { draftId: string };
  const completeResponse = await fetch(`${baseUrl}/api/onboarding-drafts/${created.draftId}/complete`, { method: "POST" });
  if (!completeResponse.ok) throw new Error(`Failed to complete onboarding draft: ${completeResponse.status}`);
  const completed = (await completeResponse.json()) as ServerReportSaveResult;
  return completed;
}

function createFeedback(parsedResume: ParsedResume, jobs: JobMatch[]) {
  const topJob = jobs[0];
  const detail = jobDetails[topJob.jobName] ?? jobDetails["서비스기획"];
  const hasMetric = parsedResume.experiences.some((item) => /\d|%|개선|증가|감소|달성/.test(item));
  const hasCollaboration = parsedResume.strengths.includes("#협업강점") || parsedResume.experiences.some((item) => /협업|개발자|디자이너|이해관계자/.test(item));
  return {
    strengths: [
      hasMetric ? "성과가 숫자로 드러나 이력서 설득력이 높습니다." : "경험 서술의 방향은 명확하지만, 수치 성과를 추가하면 설득력이 커집니다.",
      hasCollaboration ? "개발·디자인 등 협업 맥락이 있어 직무 전환 스토리로 연결하기 좋습니다." : `${topJob.jobName} 직무에 맞춰 협업 대상과 본인 역할을 더 드러내면 좋습니다.`,
      `${parsedResume.skills.slice(0, 3).join(", ")} 스킬이 ${topJob.jobName} 추천 근거로 잘 연결됩니다.`,
    ],
    improvements: [
      `${detail.gapSkills[0]} 역량을 보여주는 산출물 링크를 1개 추가하세요.`,
      `${detail.project} 프로젝트를 포트폴리오 첫 항목으로 정리하세요.`,
      "경험마다 문제 정의 → 실행 → 결과 → 배운 점 순서로 3~4줄 요약을 붙이세요.",
    ],
  };
}

function createActionItems(job: JobMatch, parsedResume: ParsedResume) {
  const detail = jobDetails[job.jobName] ?? jobDetails["서비스기획"];
  return [
    `${detail.gapSkills[0]} 보완을 위한 2시간 학습 자료 1개 선택`,
    `${detail.project} 포트폴리오 초안 작성`,
    `${parsedResume.experiences[0] ?? "대표 경험"}을 STAR 구조로 5문장 정리`,
    `${job.jobName} 공고 5개를 비교해 반복 키워드 10개 추출`,
    `${parsedResume.skills.slice(0, 3).join("/")} 스킬이 드러나는 이력서 bullet 3개 작성`,
  ];
}

function createActionPlan(job: JobMatch, parsedResume: ParsedResume): ActionPlanPhase[] {
  const detail = jobDetails[job.jobName] ?? jobDetails["서비스기획"];
  const primarySkill = parsedResume.skills[0] ?? detail.tools[0] ?? "핵심 실무 도구";
  const topExperience = parsedResume.experiences[0] ?? "대표 경험";
  return [
    {
      phase: "30일",
      title: "지원 가능한 포트폴리오 기반 만들기",
      focus: `${job.jobName} 공고에서 반복되는 역량을 빠르게 보완하고 첫 지원에 쓸 증거를 만듭니다.`,
      actions: [
        `${detail.gapSkills[0]} 학습 자료 2개를 고르고 핵심 개념을 1페이지로 정리`,
        `${topExperience} 경험을 문제 정의 → 실행 → 결과 → 배운 점 구조로 재작성`,
        `${detail.project} 산출물 초안을 만들고 ${primarySkill} 활용 근거를 추가`,
      ],
      outcome: "이력서 상단 bullet 3개와 포트폴리오 초안 1개",
    },
    {
      phase: "90일",
      title: "실전 지원과 역량 증명 루프 만들기",
      focus: "지원 결과를 회고하며 부족 역량을 보완하고 더 높은 매칭 직무로 확장합니다.",
      actions: [
        `${job.jobName} 공고 20개를 비교해 반복 요구사항과 내 경험 매핑표 작성`,
        `${detail.gapSkills.slice(0, 2).join("·")} 역량을 보여주는 미니 프로젝트를 완성`,
        "지원/면접 피드백을 주 1회 정리해 이력서와 포트폴리오를 업데이트",
      ],
      outcome: "지원 기록 10건, 개선된 포트폴리오 2차본, 면접 답변 스크립트 5개",
    },
  ];
}

function readChecklistState(jobName: string) {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(`jobcodi.actions.${jobName}`) ?? "[]") as string[];
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function createApplicationLeads(job: JobMatch, parsedResume: ParsedResume): ApplicationLead[] {
  const detail = jobDetails[job.jobName] ?? jobDetails["서비스기획"];
  const skill = parsedResume.skills[0] ?? "직무 역량";
  return [
    {
      id: `${job.jobName}-seed`,
      title: `${job.jobName} 주니어 / Associate`,
      company: "SeedTech Labs",
      fit: Math.min(98, job.score + 2),
      due: "D-5",
      matchPoint: `${skill} 경험과 ${detail.tools.slice(0, 2).join("/")} 활용 역량이 잘 맞습니다.`,
      prepAction: `${detail.gapSkills[0]} 근거를 이력서 상단 bullet에 추가`,
    },
    {
      id: `${job.jobName}-growth`,
      title: `${job.jobName} 인턴십 전환형`,
      company: "GrowthBridge",
      fit: Math.max(70, job.score - 4),
      due: "D-9",
      matchPoint: `${parsedResume.strengths.slice(0, 2).join(" · ")} 성향이 실무 과제형 전형과 연결됩니다.`,
      prepAction: `${detail.project} 산출물을 1페이지 포트폴리오로 정리`,
    },
    {
      id: `${job.jobName}-remote`,
      title: `원격 가능 ${job.jobName} 포지션`,
      company: "RemoteCraft",
      fit: Math.max(68, job.score - 7),
      due: "상시",
      matchPoint: `${parsedResume.experiences[0] ?? "대표 경험"} 경험을 문제 해결 사례로 제시할 수 있습니다.`,
      prepAction: `공고 키워드 10개와 내 경험 키워드 매핑표 작성`,
    },
  ];
}

function readApplicationStatuses(jobName: string) {
  if (typeof window === "undefined") return {} as Record<string, ApplicationStatus>;
  try {
    const saved = JSON.parse(window.localStorage.getItem(`jobcodi.applications.${jobName}`) ?? "{}") as Record<string, ApplicationStatus>;
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {} as Record<string, ApplicationStatus>;
  }
}

function ReportStep({ basicInfo, chatHistory, personalityTags, parsedResume, weights, jobs, feedback, savedReports, onFeedback, onRestart, onSave, onLoadSaved, onClearSaved }: { basicInfo: BasicInfo; chatHistory: ChatMessage[]; personalityTags: string[]; parsedResume: ParsedResume; weights: Weights; jobs: JobMatch[]; feedback: boolean; savedReports: SavedReport[]; onFeedback: () => void; onRestart: () => void; onSave: (report: SavedReport) => void; onLoadSaved: (report: SavedReport) => void; onClearSaved: () => void }) {
  const topJob = jobs[0];
  const [saveStatus, setSaveStatus] = useState("리포트 저장");
  const [serverSaveState, setServerSaveState] = useState<ServerSaveState>(apiBaseUrl() ? "idle" : "unconfigured");
  const [serverSaveMessage, setServerSaveMessage] = useState(apiBaseUrl() ? "백엔드 저장 대기 중" : "백엔드 API 미설정 · 로컬 저장만 사용");
  const [copyStatus, setCopyStatus] = useState("공유 텍스트 복사");
  const [showShareText, setShowShareText] = useState(false);
  const [completedActions, setCompletedActions] = useState<string[]>(() => readChecklistState(topJob.jobName));
  const [applicationStatuses, setApplicationStatuses] = useState<Record<string, ApplicationStatus>>(() => readApplicationStatuses(topJob.jobName));
  const feedbackItems = createFeedback(parsedResume, jobs);
  const actionItems = createActionItems(topJob, parsedResume);
  const actionPlan = createActionPlan(topJob, parsedResume);
  const applicationLeads = createApplicationLeads(topJob, parsedResume);
  const completedCount = actionItems.filter((item) => completedActions.includes(item)).length;
  const actionProgress = Math.round((completedCount / actionItems.length) * 100);
  const reportText = buildReportText(basicInfo, parsedResume, jobs, actionPlan);

  const toggleAction = (item: string) => {
    setCompletedActions((current) => {
      const next = current.includes(item) ? current.filter((value) => value !== item) : [...current, item];
      localStorage.setItem(`jobcodi.actions.${topJob.jobName}`, JSON.stringify(next));
      return next;
    });
  };

  const setApplicationStatus = (leadId: string, status: ApplicationStatus) => {
    setApplicationStatuses((current) => {
      const next = { ...current, [leadId]: status };
      localStorage.setItem(`jobcodi.applications.${topJob.jobName}`, JSON.stringify(next));
      return next;
    });
  };

  const saveReport = async () => {
    setSaveStatus("저장 중...");
    setServerSaveState(apiBaseUrl() ? "saving" : "unconfigured");
    setServerSaveMessage(apiBaseUrl() ? "백엔드에 진단 결과를 저장하는 중입니다." : "백엔드 API 미설정 · 로컬 저장만 사용합니다.");
    const payload = buildOnboardingDraftPayload({ basicInfo, chatHistory, personalityTags, parsedResume, weights, jobs, completedActions, applicationStatuses });
    let backendResult: ServerReportSaveResult | null = null;
    try {
      backendResult = await saveReportToBackend(payload);
      if (backendResult) {
        setServerSaveState("saved");
        setServerSaveMessage(`백엔드 저장 완료 · ${backendResult.reportId}`);
      } else {
        setServerSaveState("unconfigured");
      }
    } catch {
      setServerSaveState("fallback");
      setServerSaveMessage("백엔드 저장 실패 · 로컬 저장으로 보관했습니다.");
    }
    const report: SavedReport = {
      id: backendResult?.reportId ?? `jobcodi-${Date.now()}`,
      createdAt: new Date().toISOString(),
      topJob: topJob.jobName,
      score: topJob.score,
      basicInfo,
      parsedResume,
      jobs: jobs.slice(0, 3),
      ...(backendResult ? { serverDraftId: backendResult.draftId, serverReportId: backendResult.reportId } : {}),
    };
    const prev = JSON.parse(localStorage.getItem("jobcodi.reports") ?? "[]") as SavedReport[];
    const next = [report, ...prev.filter((item) => item.id !== report.id)].slice(0, 5);
    localStorage.setItem("jobcodi.reports", JSON.stringify(next));
    onSave(report);
    setSaveStatus(backendResult ? "서버 저장 완료" : "로컬 저장 완료");
  };

  const copyReport = async () => {
    setShowShareText(true);
    try {
      await copyTextToClipboard(reportText);
      setCopyStatus("복사 완료");
    } catch {
      setCopyStatus("텍스트 표시됨");
    }
  };

  return (
    <div className={styles.reportStack}>
      <section className={styles.reportHero}>
        <div><span>종합 커리어 매칭 리포트 완성</span><h2>김코디 님의 종합 커리어 진단서</h2><p>{basicInfo.status} 상태와 {parsedResume.skills.slice(0, 3).join(", ")} 스킬을 바탕으로 도출된 최종 추천입니다.</p><ServerSaveBadge state={serverSaveState} message={serverSaveMessage} /></div>
        <div className={styles.reportHeroActions}><button onClick={saveReport} disabled={serverSaveState === "saving"} type="button">{saveStatus}</button><button onClick={onRestart} type="button">새 진단 시작</button></div>
      </section>
      <section className={styles.reportGrid}><article className={styles.scorePanel}><Donut score={topJob.score} /><div><span>1순위 추천 최적 직무</span><h3>{topJob.jobName}</h3><p>{parsedResume.summary}</p><div className={styles.tagCloud}>{parsedResume.strengths.map((tag) => <span key={tag}>{tag}</span>)}</div></div></article><article className={styles.panelSoft}><h3>추천 Top 3 로드맵</h3>{jobs.slice(0, 3).map((job, index) => <div className={styles.roadmapItem} key={job.jobName}><b>{index + 1}</b><span><strong>{job.jobName}</strong><small>{job.score}점 · 포트폴리오 액션 준비</small></span></div>)}</article></section>
      <ActionPlanSection phases={actionPlan} />
      <ActionChecklist items={actionItems} completed={completedActions} progress={actionProgress} onToggle={toggleAction} />
      <ApplicationBoard leads={applicationLeads} statuses={applicationStatuses} onStatus={setApplicationStatus} />
      <section className={styles.panel}>{feedback ? <div className={styles.feedbackGrid}><InfoCard title="강점" items={feedbackItems.strengths} /><InfoCard title="보완" items={feedbackItems.improvements} /></div> : <button className={styles.feedbackButton} onClick={onFeedback} type="button">✨ 맞춤 이력서 피드백 받기</button>}</section>
      <section className={styles.reportActionPanel}>
        <div><h3>리포트 공유</h3><p>상담, 포트폴리오 정리, 멘토 피드백 요청에 바로 붙여넣을 수 있는 요약 텍스트를 생성했습니다.</p></div>
        <button onClick={copyReport} type="button">{copyStatus}</button>
        {showShareText && <textarea aria-label="공유 리포트 텍스트" readOnly value={reportText} />}
      </section>
      <SavedReportsPanel reports={savedReports} onLoad={onLoadSaved} onClear={onClearSaved} />
    </div>
  );
}

function formatSavedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "저장일 알 수 없음";
  return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function ServerSaveBadge({ state, message }: { state: ServerSaveState; message: string }) {
  const label = {
    idle: "서버 저장 대기",
    saving: "서버 저장 중",
    saved: "서버 저장 완료",
    fallback: "로컬 fallback",
    unconfigured: "로컬 저장 모드",
  }[state];
  return <div className={styles.serverSaveBadge} data-state={state}><strong>{label}</strong><span>{message}</span></div>;
}

function ActionChecklist({ items, completed, progress, onToggle }: { items: string[]; completed: string[]; progress: number; onToggle: (item: string) => void }) {
  return (
    <section className={styles.actionChecklist}>
      <header>
        <div><span>Next Actions</span><h3>추천 직무 실행 체크리스트</h3><p>진단 결과를 실제 지원 준비로 연결하는 5단계 액션입니다.</p></div>
        <strong>{progress}% 완료</strong>
      </header>
      <div className={styles.actionProgress}><span style={{ width: `${progress}%` }} /></div>
      <div className={styles.actionList}>
        {items.map((item, index) => {
          const isDone = completed.includes(item);
          return (
            <label key={item} className={isDone ? styles.actionDone : styles.actionItem}>
              <input type="checkbox" checked={isDone} onChange={() => onToggle(item)} />
              <b>{index + 1}</b>
              <span>{item}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}

function ActionPlanSection({ phases }: { phases: ActionPlanPhase[] }) {
  return (
    <section className={styles.actionPlanPanel}>
      <header>
        <div><span>30/90 Day Plan</span><h3>직무 전환 실행 계획</h3><p>추천 직무를 실제 지원 준비로 연결하는 단기/중기 액션 로드맵입니다.</p></div>
      </header>
      <div className={styles.actionPlanGrid}>
        {phases.map((phase) => (
          <article key={phase.phase}>
            <strong>{phase.phase}</strong>
            <h4>{phase.title}</h4>
            <p>{phase.focus}</p>
            <ol>
              {phase.actions.map((action) => <li key={action}>{action}</li>)}
            </ol>
            <em>완료 산출물: {phase.outcome}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

const applicationStatusLabels: Record<ApplicationStatus, string> = {
  saved: "저장",
  planned: "지원예정",
  applied: "지원완료",
};

function ApplicationBoard({ leads, statuses, onStatus }: { leads: ApplicationLead[]; statuses: Record<string, ApplicationStatus>; onStatus: (leadId: string, status: ApplicationStatus) => void }) {
  return (
    <section className={styles.applicationBoard}>
      <header>
        <div><span>Application Board</span><h3>추천 지원 후보</h3><p>가상의 후보 공고를 기준으로 지원 우선순위와 준비 액션을 관리합니다.</p></div>
      </header>
      <div className={styles.applicationGrid}>
        {leads.map((lead) => {
          const status = statuses[lead.id] ?? "saved";
          return (
            <article key={lead.id}>
              <div className={styles.applicationTop}><strong>{lead.title}</strong><em>{lead.due}</em></div>
              <p className={styles.companyLine}>{lead.company} · 매칭 {lead.fit}%</p>
              <p>{lead.matchPoint}</p>
              <small>준비 액션: {lead.prepAction}</small>
              <div className={styles.statusButtons}>
                {(["saved", "planned", "applied"] as ApplicationStatus[]).map((item) => (
                  <button key={item} className={status === item ? styles.statusActive : styles.statusButton} onClick={() => onStatus(lead.id, item)} type="button">{applicationStatusLabels[item]}</button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SavedReportsPanel({ reports, onLoad, onClear }: { reports: SavedReport[]; onLoad: (report: SavedReport) => void; onClear: () => void }) {
  return (
    <section className={styles.savedReportsPanel}>
      <header>
        <div><span>Saved Reports</span><h3>최근 저장 리포트</h3></div>
        <div className={styles.savedReportHeaderActions}>
          <Link href="/reports">서버 리포트 전체 보기</Link>
          {reports.length > 0 && <button onClick={onClear} type="button">전체 삭제</button>}
        </div>
      </header>
      {reports.length === 0 ? (
        <div className={styles.savedEmpty}><strong>아직 저장된 리포트가 없습니다.</strong><p>상단의 ‘리포트 저장’을 누르면 최근 5개 진단 결과를 이곳에서 다시 확인할 수 있습니다.</p></div>
      ) : (
        <div className={styles.savedReportList}>
          {reports.map((report) => (
            <article key={report.id}>
              <div><strong>{report.topJob}</strong><span>{formatSavedDate(report.createdAt)} · {report.score}점</span></div>
              <p>{report.parsedResume.skills.slice(0, 4).join(", ")} · {report.parsedResume.strengths.slice(0, 2).join(" ")}</p>
              <SavedReportShareActions report={report} />
              <button onClick={() => onLoad(report)} type="button">불러오기</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function SavedReportShareActions({ report }: { report: SavedReport }) {
  const [copyLabel, setCopyLabel] = useState("공유 URL 복사");
  const [showUrl, setShowUrl] = useState(false);
  if (!report.serverReportId) {
    return <small className={styles.savedLocalRef}>로컬 저장 리포트 · 공유 링크 없음</small>;
  }

  const path = `/reports/${report.serverReportId}`;
  const sharedUrl = typeof window === "undefined" ? path : new URL(path, window.location.origin).toString();
  const copySharedUrl = async () => {
    setShowUrl(true);
    try {
      await copyTextToClipboard(sharedUrl);
      setCopyLabel("URL 복사 완료");
    } catch {
      setCopyLabel("URL 표시됨");
    }
  };

  return (
    <div className={styles.savedShareActions}>
      <small className={styles.savedServerRef}>서버 리포트 {report.serverReportId}</small>
      <a href={path} target="_blank" rel="noreferrer">공유 페이지 열기</a>
      <button onClick={copySharedUrl} type="button">{copyLabel}</button>
      {showUrl && <input aria-label="공유 리포트 URL" readOnly value={sharedUrl} />}
    </div>
  );
}

function StepTitle({ icon, title, desc }: { icon: string; title: string; desc: string }) { return <header className={styles.stepTitle}><span>{icon}</span><div><h2>{title}</h2><p>{desc}</p></div></header>; }
function Question({ title, hint, required, children }: { title: string; hint?: string; required?: boolean; children: React.ReactNode }) { return <div className={styles.question}><label>{title} {required && <b>*</b>} {hint && <small>{hint}</small>}</label>{children}</div>; }
function ChipGroup({ options, selected, onSelect }: { options: string[]; selected: string[]; onSelect: (value: string) => void; multi?: boolean }) { return <div className={styles.chipGroup}>{options.map((option) => <button key={option} type="button" className={selected.includes(option) ? styles.chipActive : styles.chip} onClick={() => onSelect(option)}>{option}</button>)}</div>; }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className={styles.selectField}><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function NavActions({ prevLabel, nextLabel = "다음", onPrev, onNext, disabled }: { prevLabel?: string; nextLabel?: string; onPrev?: () => void; onNext?: () => void; disabled?: boolean }) { return <div className={styles.navActions}>{onPrev && <button className={styles.secondaryButton} onClick={onPrev} type="button">← {prevLabel}</button>}{onNext && <button className={styles.primaryButton} onClick={onNext} disabled={disabled} type="button">{nextLabel} →</button>}</div>; }
function InfoCard({ title, items, action, actionLabel }: { title: string; items: string[]; action?: () => void; actionLabel?: string }) { return <article className={styles.infoCard}><header><h3>{title}</h3>{action && <button onClick={action} type="button">{actionLabel}</button>}</header>{items.map((item) => <p key={item}>{item}</p>)}</article>; }
function MiniJobList({ jobs, large = false }: { jobs: JobMatch[]; large?: boolean }) { return <div className={large ? styles.jobListLarge : styles.jobList}>{jobs.map((job, index) => <div key={job.jobName}><b>{index + 1}</b><span><strong>{job.jobName}</strong><small>{job.badge} · {job.expectedPostCount}</small></span><em>{job.score}점</em></div>)}</div>; }
function JobScoreCard({ job, rank }: { job: JobMatch; rank: number }) { return <article className={styles.jobScoreCard}><span>{job.badge}</span><h3><b>{rank}</b>{job.jobName}</h3><strong>{job.score}<small>점</small></strong><p>난이도 {job.difficulty} · 공고 {job.expectedPostCount}</p></article>; }
function JobDetail({ name }: { name: string }) { const detail = jobDetails[name] ?? jobDetails["서비스기획"]; return <div className={styles.jobDetail}><p>{detail.description}</p><div>{detail.tools.map((tool) => <span key={tool}>{tool}</span>)}</div><ul>{detail.gapSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul><strong>{detail.salary}</strong><em>{detail.project}</em></div>; }
function Donut({ score }: { score: number }) { const radius = 58; const circumference = 2 * Math.PI * radius; const offset = circumference * (1 - score / 100); return <div className={styles.donut}><svg viewBox="0 0 140 140"><circle cx="70" cy="70" r={radius} /><circle cx="70" cy="70" r={radius} strokeDasharray={circumference} strokeDashoffset={offset} /></svg><strong>{score}<small>Fit</small></strong></div>; }
