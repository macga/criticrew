// login.ts (0-35)
"use server";

import * as z from "zod"; //유효성 검사 라이브러리 https://zod.dev/
import { AuthError } from "next-auth";

import { signIn } from "@/auth"; // 사용자 로그인 기능을 가져옵니다.
import { LoginSchema } from "@/schemas"; // 입력값 검증에 사용되는 스키마를 가져옵니다.
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"; // 로그인 성공 후 이동할 기본 경로를 가져옵니다.

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // 입력 값 검증
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }; // 입력값이 유효하지 않을 경우 오류 메시지를 반환합니다.
  }

  const { email, password } = validatedFields.data; // 입력된 이메일과 비밀번호를 추출합니다.

  try {
    // 사용자 로그인 시도
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT, // 로그인 성공 후 이동할 기본 경로를 설정합니다.
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "잘못된 인증입니다." }; // 사용자 인증이 실패한 경우 오류 메시지를 반환합니다.
        default:
          return { error: "오류가 발생했습니다." }; // 알 수 없는 오류가 발생한 경우 오류 메시지를 반환합니다.
      }
    }
    throw error; // 예기치 않은 오류가 발생한 경우 해당 오류를 다시 던집니다.
  }
};
