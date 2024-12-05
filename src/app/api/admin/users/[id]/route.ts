import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        role: true,
        status: true,
        isEmailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            likes: true,
            followedBy: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return Response.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json(
      { error: "사용자 정보를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { role, status } = body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        role,
        status,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        role: true,
        status: true,
        isEmailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            likes: true,
            followedBy: true,
            following: true,
          },
        },
      },
    });

    return Response.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json(
      { error: "사용자 정보를 수정하는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
