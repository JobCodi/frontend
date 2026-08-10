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
});
