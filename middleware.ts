//사용자 인증 상태에 따라 경로를 이동
import NextAuth from "next-auth"; // next-auth 라이브러리 가져오기

import authConfig from "@/auth.config";
// API와 관련된 경로와 인증, 공개 경로 정의
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig); // next-auth 설정

export default auth((req) => {
  const { nextUrl } = req; // 현재 요청 URL 정보 가져오기
  const isLoggedIn = !!req.auth; // 사용자가 로그인 중인지 확인 (로그인 정보가 있는지)

  console.log("ROUTE:", req.nextUrl.pathname);
  console.log("IS LOGGEDIN:", isLoggedIn);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix); // API 인증 경로인지 확인
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname); // 공개 경로인지 확인
  const isAuthRoute = authRoutes.includes(nextUrl.pathname); // 인증 필요 경로인지 확인

  if (isApiAuthRoute) {
    return null; // API 인증 경로인 경우 아무 작업도 수행하지 않음
  }

  if (isAuthRoute) {
    //인증루트인데
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)); // 이미 로그인 중이면 기본 로그인 리다이렉트로 이동
    }
    return null; // 인증 필요 경로지만 로그인하지 않은 경우 아무 작업도 수행하지 않음
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl)); // 비로그인 상태이고 공개 경로가 아닌 경우 로그인 페이지로 리다이렉트
  }

  return null; // 그 외의 경우 아무 작업도 수행하지 않음
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // 모든 비파일 및 _next 경로에 미들웨어 적용 (예: /api, /trpc)
    "/", // 루트 경로에 미들웨어 적용
    "/(api|trpc)(.*)", // /api 및 /trpc 하위 경로에 미들웨어 적용
  ],
};
