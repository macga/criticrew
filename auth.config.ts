import bcrypt from "bcryptjs"; // bcrypt 라이브러리 가져오기
import type { NextAuthConfig } from "next-auth"; // next-auth의 NextAuthConfig 타입 가져오기
import Credentials from "next-auth/providers/credentials"; // next-auth의 Credentials 프로바이더 가져오기

import { LoginSchema } from "@/schemas"; // 로그인 스키마 가져오기
import { getUserByEmail } from "@/data/user"; // 데이터베이스에서 사용자 정보 가져오는 함수 가져오기

export default {
  providers: [
    Credentials({
      // Credentials 프로바이더 설정
      id: "credentials", // 인증 ID
      name: "Credentials", // 인증 이름
      credentials: {
        // 자격 증명 필드 설정
        email: { label: "Email", type: "email" }, // 이메일 입력 필드
        password: { label: "Password", type: "password" }, // 비밀번호 입력 필드
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials); // 입력된 자격 증명이 유효한지 검사

        if (validatedFields.success) {
          const { email, password } = validatedFields.data; // 유효한 자격 증명 데이터 추출
          const user = await getUserByEmail(email); // 이메일로 사용자 정보 가져오기

          if (!user || !user.password) return null; // 사용자가 없거나 비밀번호가 없는 경우 로그인 실패

          const passwordMatch = await bcrypt.compare(password, user.password); // 입력된 비밀번호와 저장된 비밀번호 비교

          if (passwordMatch) return user; // 비밀번호 일치하면 사용자 정보 반환
        }
        return null; // 유효하지 않은 자격 증명 또는 비밀번호 불일치 시 로그인 실패
      },
    }),
  ],
} satisfies NextAuthConfig; // NextAuth 설정을 만족하는 타입으로 지정
