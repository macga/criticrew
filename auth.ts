import NextAuth from "next-auth"; // next-auth 라이브러리 가져오기
import { PrismaAdapter } from "@auth/prisma-adapter"; // Prisma 어댑터 가져오기

import { db } from "@/lib/db"; // 데이터베이스 연결 가져오기
import authConfig from "@/auth.config"; // auth config 가져오기

// NextAuth 설정
export const {
  handlers: { GET, POST }, // GET과 POST 요청을 처리하는 핸들러
  auth, // 사용자 인증 함수
  signIn, // 사용자 로그인 함수
  signOut, // 사용자 로그아웃 함수
} = NextAuth({
  debug: true, //2024-11-21 디버깅을 위해 활성화
  adapter: PrismaAdapter(db), // Prisma 어댑터 설정
  session: { strategy: "jwt" }, // 세션 전략 설정 (JWT)
  ...authConfig, // 추가적인 auth config 적용
});
