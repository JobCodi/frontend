"use client";

import { useState } from "react";
import styles from "./reports-index.module.css";

interface ReportShareActionsProps {
  reportId: string;
}

async function copyTextToClipboard(text: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    throw new Error("Clipboard API is unavailable");
  }

  await Promise.race([
    navigator.clipboard.writeText(text),
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error("Clipboard API timed out")), 1200);
    }),
  ]);
}

export default function ReportShareActions({ reportId }: ReportShareActionsProps) {
  const [copyLabel, setCopyLabel] = useState("공유 URL 복사");
  const [showUrl, setShowUrl] = useState(false);
  const path = `/reports/${reportId}`;
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
    <div className={styles.shareActions}>
      <button onClick={copySharedUrl} type="button">{copyLabel}</button>
      {showUrl && <input aria-label={`${reportId} 공유 리포트 URL`} readOnly value={sharedUrl} />}
    </div>
  );
}
