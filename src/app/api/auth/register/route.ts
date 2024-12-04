import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// 입력 데이터 검증을 위한 스키마
const registerSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 입력 데이터 검증
    const validatedData = registerSchema.parse(body);

    // 이메일 중복 확인
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          error: "이미 사용 중인 이메일입니다",
          field: "email",
          message: "다른 이메일 주소를 사용해주세요.",
        },
        { status: 400 }
      );
    }

    // 닉네임 중복 확인
    const existingUserByNickname = await prisma.user.findFirst({
      where: { nickname: validatedData.nickname },
    });

    if (existingUserByNickname) {
      return NextResponse.json(
        {
          error: "이미 사용 중인 닉네임입니다",
          field: "nickname",
          message: "다른 닉네임을 사용해주세요.",
        },
        { status: 400 }
      );
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        nickname: validatedData.nickname,
      },
    });

    // 비밀번호를 제외한 사용자 정보 반환
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod 에러 메시지를 더 자세하게 반환
      const firstError = error.errors[0];
      return NextResponse.json(
        {
          error: firstError.message,
          field: firstError.path[0],
          message: "입력한 정보를 다시 확인해주세요.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "회원가입 중 오류가 발생했습니다",
        message: "잠시 후 다시 시도해주세요.",
      },
      { status: 500 }
    );
  }
}
