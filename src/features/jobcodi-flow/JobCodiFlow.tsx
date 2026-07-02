
"use client";

import { useMemo, useState } from "react";
import styles from "./jobcodi-flow.module.css";

type StepId =
  | "home"
  | "onboarding"
  | "interview"
  | "resume"
  | "analysis"
  | "priority"
  | "compare"
  | "report";

interface StepMeta {
  id: StepId;
  label: string;
  title: string;
}

const steps: StepMeta[] = [
  { id: "home", label: "홈", title: "무슨 직무가 맞을지 모르겠다면?" },
  { id: "onboarding", label: "기본정보", title: "기본 정보 입력" },
  { id: "interview", label: "인터뷰", title: "AI 직무 인터뷰" },
  { id: "resume", label: "이력서", title: "이력서 분석" },
  { id: "analysis", label: "분석결과", title: "이력 분석 결과" },
  { id: "priority", label: "중요도", title: "중요도 설정" },
  { id: "compare", label: "직무비교", title: "후보 직무 비교" },
  { id: "report", label: "리포트", title: "직무핏 리포트" },
];

const jobScores = [
  { rank: 1, title: "서비스기획", score: 88, tag: "가장 추천", tone: "primary" },
  { rank: 2, title: "CRM 마케팅", score: 82, tag: "병행 추천", tone: "green" },
  { rank: 3, title: "그로스 마케팅", score: 76, tag: "준비 후 추천", tone: "amber" },
  { rank: 4, title: "데이터 분석", score: 67, tag: "추가 준비 필요", tone: "gray" },
] as const;

const analysisCards = [
  { title: "주요 경험", items: ["마케팅 인턴", "캠페인 운영", "유입 데이터 분석", "서비스 개선 제안"] },
  { title: "보유 스킬", items: ["GA4", "Excel", "Notion", "SQL 기초"] },
  { title: "강점 키워드", items: ["#데이터분석", "#문제해결", "#사용자이해"] },
  { title: "직무 연결", items: ["서비스기획", "CRM마케팅", "그로스마케팅"] },
];

const priorityItems = [
  { label: "현재 취업 가능성", value: 86, color: "primary" },
  { label: "내 이력과의 적합도", value: 78, color: "primary" },
  { label: "직무 흥미도", value: 72, color: "primary" },
  { label: "성장 가능성", value: 64, color: "green" },
  { label: "연봉 기대치", value: 42, color: "amber" },
  { label: "워라밸", value: 52, color: "amber" },
  { label: "준비 난이도 낮음", value: 68, color: "green" },
] as const;

export function JobCodiFlow() {
  const [index, setIndex] = useState(0);
  const active = steps[index];
  const progress = useMemo(() => Math.round(((index + 1) / steps.length) * 100), [index]);

  const goNext = () => setIndex((current) => Math.min(current + 1, steps.length - 1));
  const goPrev = () => setIndex((current) => Math.max(current - 1, 0));
  const goTo = (target: StepId) => setIndex(steps.findIndex((step) => step.id === target));

  return (
    <main className={styles.shell}>
      <section className={styles.contextPanel} aria-labelledby="product-title">
        <span className={styles.eyebrow}>JobCodi MVP Preview</span>
        <h1 id="product-title">프로토타입을 실제 모바일 화면으로 개선 구현</h1>
        <p>
          와이어프레임의 핵심 흐름은 유지하고, 카드 대비·CTA·진행 상태·추천 근거를 강화한
          모바일 우선 인터랙션입니다.
        </p>
        <div className={styles.flowMap} aria-label="화면 목록">
          {steps.map((step, stepIndex) => (
            <button
              className={step.id === active.id ? styles.flowMapActive : styles.flowMapItem}
              key={step.id}
              onClick={() => setIndex(stepIndex)}
              type="button"
            >
              <span>{String(stepIndex + 1).padStart(2, "0")}</span>
              {step.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.phone} aria-label={`JobCodi ${active.label} 화면`}>
        <div className={styles.statusBar} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.statusIcons}>▰▰</span>
        </div>
        <div className={styles.progressTrack} aria-label={`진행률 ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.screen}>{renderScreen(active.id, goNext, goTo)}</div>
        <nav className={styles.bottomNav} aria-label="주요 탭">
          {[
            ["home", "홈", "⌂"],
            ["interview", "진단", "◇"],
            ["report", "리포트", "□"],
            ["analysis", "MY", "●"],
          ].map(([id, label, icon]) => (
            <button
              className={active.id === id ? styles.navActive : styles.navItem}
              key={id}
              onClick={() => goTo(id as StepId)}
              type="button"
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </section>

      <div className={styles.controls}>
        <button disabled={index === 0} onClick={goPrev} type="button">이전</button>
        <span>{index + 1} / {steps.length} · {active.label}</span>
        <button disabled={index === steps.length - 1} onClick={goNext} type="button">다음</button>
      </div>
    </main>
  );
}

function renderScreen(id: StepId, goNext: () => void, goTo: (target: StepId) => void) {
  switch (id) {
    case "home":
      return <HomeScreen goNext={goNext} goTo={goTo} />;
    case "onboarding":
      return <OnboardingScreen goNext={goNext} />;
    case "interview":
      return <InterviewScreen goNext={goNext} />;
    case "resume":
      return <ResumeScreen goNext={goNext} />;
    case "analysis":
      return <AnalysisScreen goNext={goNext} />;
    case "priority":
      return <PriorityScreen goNext={goNext} />;
    case "compare":
      return <CompareScreen goNext={goNext} />;
    case "report":
      return <ReportScreen />;
  }
}

function HomeScreen({ goNext, goTo }: { goNext: () => void; goTo: (target: StepId) => void }) {
  return (
    <div className={styles.stackLarge}>
      <div className={styles.brandRow}>
        <span className={styles.logoMark}>픽</span>
        <div>
          <strong>JobCodi</strong>
          <p>AI 직무 추천 플랫폼</p>
        </div>
      </div>
      <header className={styles.heroCopy}>
        <p className={styles.eyebrow}>이력 · 성향 · 우선순위 기반</p>
        <h2>무슨 직무가<br />맞을지 모르겠다면?</h2>
        <p>지금의 경험을 분석해 바로 지원할 직무와 준비 후 도전할 직무를 나눠드려요.</p>
      </header>
      <div className={styles.ctaGroup}>
        <button className={styles.primaryButton} onClick={goNext} type="button">무료로 내 직무 찾기</button>
        <button className={styles.secondaryButton} onClick={() => goTo("resume")} type="button">이력서로 추천받기</button>
      </div>
      <section className={styles.recommendBox}>
        <h3>JobCodi는 이렇게 추천해요</h3>
        {[
          ["AI 인터뷰", "성향 파악", "primary"],
          ["이력 분석", "경험 추출", "green"],
          ["직무 비교", "후보 추천", "green"],
        ].map(([title, sub, tone]) => (
          <article className={styles.miniCard} key={title}>
            <span className={tone === "primary" ? styles.checkPrimary : styles.checkGreen}>✓</span>
            <div><strong>{title}</strong><p>{sub}</p></div>
          </article>
        ))}
      </section>
    </div>
  );
}

function OnboardingScreen({ goNext }: { goNext: () => void }) {
  return (
    <div className={styles.stackLarge}>
      <PageHeader title="기본 정보 입력" subtitle="1분 안에 직무 추천 기준을 잡아볼게요." />
      <Question title="현재 어떤 상태인가요?" options={["대학생", "취준생", "인턴 경험", "주니어", "이직 준비"]} active={["취준생"]} />
      <Question title="관심 있는 분야를 골라주세요" options={["기획", "마케팅", "데이터", "디자인", "개발", "영업", "운영", "아직 몰라요"]} active={["기획", "데이터"]} tone="green" />
      <section className={styles.inputSummary}>
        <strong>희망 조건</strong>
        <p>성장 가능성이 중요해요</p>
        <span>워라밸은 보통, 연봉은 아직 모르겠어요</span>
      </section>
      <button className={styles.primaryButton} onClick={goNext} type="button">다음</button>
    </div>
  );
}

function InterviewScreen({ goNext }: { goNext: () => void }) {
  return (
    <div className={styles.stackLarge}>
      <PageHeader title="AI 직무 인터뷰" subtitle="선택해도 되고, 직접 입력해도 돼요." meta="45%" />
      <section className={styles.chatBubble}>
        <span className={styles.logoMark}>픽</span>
        <div><strong>픽봇</strong><p>지금까지 했던 경험 중 가장 재미있었던 일은 무엇이었나요?</p></div>
      </section>
      <div className={styles.answerList}>
        <button className={styles.answerActive} type="button">데이터를 분석한 경험</button>
        <button className={styles.answerGreen} type="button">서비스를 개선한 경험</button>
        <button type="button">콘텐츠를 만든 경험</button>
        <button type="button">사람을 설득한 경험</button>
      </div>
      <section className={styles.resultCard}>
        <strong>현재 분석 결과</strong>
        <div className={styles.keywordRow}><span>#데이터기반</span><span>#문제해결형</span><span>#기획선호</span></div>
        <p>후보 · 서비스기획 · CRM마케팅 · 그로스마케팅</p>
      </section>
      <button className={styles.primaryButton} onClick={goNext} type="button">인터뷰 저장</button>
    </div>
  );
}

function ResumeScreen({ goNext }: { goNext: () => void }) {
  return (
    <div className={styles.stackLarge}>
      <PageHeader title="이력서 분석" subtitle="이력서를 올리면 추천 정확도가 올라가요." />
      <section className={styles.uploadBox}>
        <span>PDF</span>
        <strong>PDF, DOCX 파일 업로드</strong>
        <p>또는 포트폴리오 링크 입력</p>
        <button className={styles.secondaryButton} type="button">파일 선택</button>
      </section>
      <label className={styles.fieldLabel}>직접 입력하기<textarea placeholder="인턴, 프로젝트, 스킬 등을 입력하세요" /></label>
      <label className={styles.fieldLabel}>포트폴리오 링크<input placeholder="https://" /></label>
      <button className={styles.primaryButton} onClick={goNext} type="button">분석 시작하기</button>
    </div>
  );
}

function AnalysisScreen({ goNext }: { goNext: () => void }) {
  return (
    <div className={styles.stackLarge}>
      <PageHeader title="이력 분석 결과" subtitle="잘못된 내용은 수정할 수 있어요." />
      <div className={styles.cardGrid}>{analysisCards.map((card) => <EditableCard key={card.title} {...card} />)}</div>
      <button className={styles.primaryButton} onClick={goNext} type="button">다음으로</button>
    </div>
  );
}

function PriorityScreen({ goNext }: { goNext: () => void }) {
  return (
    <div className={styles.stackLarge}>
      <PageHeader title="중요도 설정" subtitle="무엇을 가장 중요하게 볼까요?" />
      <div className={styles.sliderList}>
        {priorityItems.map((item) => (
          <div className={styles.sliderRow} key={item.label}>
            <div><strong>{item.label}</strong><span>{item.value}</span></div>
            <div className={styles.sliderTrack}><span className={styles[item.color]} style={{ width: `${item.value}%` }} /></div>
          </div>
        ))}
      </div>
      <button className={styles.primaryButton} onClick={goNext} type="button">추천 결과 보기</button>
    </div>
  );
}

function CompareScreen({ goNext }: { goNext: () => void }) {
  return (
    <div className={styles.stackLarge}>
      <PageHeader title="후보 직무 비교" subtitle="현재 이력과 중요도 기준으로 정렬했어요." />
      <div className={styles.jobList}>{jobScores.map((job) => <JobCard key={job.rank} {...job} />)}</div>
      <section className={styles.reasonBox}>
        <strong>추천 근거 요약</strong>
        <Metric label="이력 적합도" value={90} tone="primary" />
        <Metric label="성장 가능성" value={81} tone="green" />
      </section>
      <button className={styles.primaryButton} onClick={goNext} type="button">리포트 생성</button>
    </div>
  );
}

function ReportScreen() {
  return (
    <div className={styles.stackLarge}>
      <PageHeader title="JobCodi 리포트" subtitle="추천 이유와 다음 액션을 한 번에 확인하세요." />
      <section className={styles.reportHero}>
        <div><span>가장 잘 맞는 직무</span><strong>서비스기획</strong><p>현재 이력과 업무 성향이 가장 잘 맞아요.</p></div>
        <b>88<small>점</small></b>
      </section>
      <section className={styles.topThree}>
        <h3>추천 직무 TOP 3</h3>
        {jobScores.slice(0, 3).map((job) => (
          <div key={job.rank}><span>{job.rank}위</span><strong>{job.title}</strong><em>{job.score}점</em></div>
        ))}
      </section>
      <section>
        <h3 className={styles.sectionTitle}>내 강점 키워드</h3>
        <div className={styles.keywordRow}><span>#데이터기반</span><span>#문제해결</span><span>#사용자분석</span></div>
      </section>
      <section>
        <h3 className={styles.sectionTitle}>다음 액션</h3>
        <div className={styles.actionGrid}><button className={styles.primaryButton} type="button">이력서 개선</button><button className={styles.secondaryButton} type="button">공고 보기</button></div>
      </section>
    </div>
  );
}

function PageHeader({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
  return <header className={styles.pageHeader}><div><h2>{title}</h2><p>{subtitle}</p></div>{meta ? <span>{meta}</span> : null}</header>;
}

function Question({ title, options, active, tone = "primary" }: { title: string; options: string[]; active: string[]; tone?: "primary" | "green" }) {
  return <section className={styles.question}><h3>{title}</h3><div>{options.map((option) => <button className={active.includes(option) ? (tone === "green" ? styles.pillGreen : styles.pillActive) : styles.pill} key={option} type="button">{option}</button>)}</div></section>;
}

function EditableCard({ title, items }: { title: string; items: string[] }) {
  return <article className={styles.editableCard}><div><strong>{title}</strong><button type="button">수정</button></div><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

function JobCard({ rank, title, score, tag, tone }: { rank: number; title: string; score: number; tag: string; tone: "primary" | "green" | "amber" | "gray" }) {
  return <article className={styles.jobCard}><span className={styles[`rank${tone}`]}>{rank}</span><div><strong>{title}</strong><p>{tag}</p></div><em className={styles[`score${tone}`]}>{score}점</em></article>;
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "primary" | "green" }) {
  return <div className={styles.metric}><div><span>{label}</span><b>{value}점</b></div><div><span className={styles[tone]} style={{ width: `${value}%` }} /></div></div>;
}
