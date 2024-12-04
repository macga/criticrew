import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 입력 데이터 검증
    const validatedData = loginSchema.parse(body);

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "이메일 또는 비밀번호가 일치하지 않습니다",
          field: "email",
          message: "이메일을 다시 확인해주세요.",
        },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "이메일 또는 비밀번호가 일치하지 않습니다",
          field: "password",
          message: "비밀번호를 다시 확인해주세요.",
        },
        { status: 401 }
      );
    }

    // 비밀번호를 제외한 사용자 정보
    const { password: _, ...userWithoutPassword } = user;

    // JWT 토큰 생성 (모든 필요한 정보 포함)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Generated token payload:", {
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
    });

    return NextResponse.json({
      message: "로그인이 완료되었습니다",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "로그인 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
