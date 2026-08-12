import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

describe("middleware", () => {
  it("메모리 전용 access token 모델에서는 /applications의 서버 인증을 주장하지 않는다", () => {
    const response = middleware(new NextRequest("https://jobcodi.example/applications"));

    expect(response.status).toBe(200);
  });

  it("refresh HttpOnly 쿠키 유무로 서버 인증을 판단하지 않는다", () => {
    const request = new NextRequest("https://jobcodi.example/applications", {
      headers: { cookie: "jobcodi_refresh=refresh-value" },
    });

    expect(middleware(request).status).toBe(200);
  });
});
