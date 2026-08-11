import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

describe("middleware", () => {
  it("비로그인 사용자의 /applications 접근을 로그인으로 보낸다", () => {
    const response = middleware(new NextRequest("https://jobcodi.example/applications"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://jobcodi.example/login?redirect=%2Fapplications",
    );
  });

  it("HttpOnly 사용자 세션 쿠키가 있으면 보호 경로를 통과시킨다", () => {
    const request = new NextRequest("https://jobcodi.example/applications", {
      headers: { cookie: "jobcodi_session=session-value" },
    });

    expect(middleware(request).status).toBe(200);
  });

  it("기존 읽기 가능한 토큰 쿠키는 인증으로 인정하지 않는다", () => {
    const request = new NextRequest("https://jobcodi.example/applications", {
      headers: { cookie: "jobcodi_token=legacy-token" },
    });

    expect(middleware(request).status).toBe(307);
  });
});
