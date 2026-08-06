import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobCodi | 목표만 알려주세요, 공고는 저희가 모아옵니다",
  description:
    "기업 규모와 직군을 고르면 AI가 대화로 조건을 정리하고, 여러 채용 사이트에서 공고를 모아드리는 JobCodi.",
  icons: {
    icon: "/brand/06_app_icon_navy_512.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5445f4",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
