import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role, UserStatus, Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as UserStatus | null;
    const role = searchParams.get("role") as Role | null;
    const isEmailVerified =
      searchParams.get("isEmailVerified") === "true"
        ? true
        : searchParams.get("isEmailVerified") === "false"
        ? false
        : null;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const skip = (page - 1) * limit;

    // 검색 조건 구성
    const where: Prisma.UserWhereInput = {
      ...(search
        ? {
            OR: [
              {
                email: {
                  contains: search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                nickname: {
                  contains: search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
            ],
          }
        : {}),
      ...(status ? { status } : {}),
      ...(role ? { role } : {}),
      ...(isEmailVerified !== null ? { isEmailVerified } : {}),
    };

    // 정렬 조건 구성
    const orderBy = {
      [sortBy]: sortOrder,
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "회원 목록을 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 일괄 상태 변경 API
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userIds, status } = body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "선택된 회원이 없습니다." },
        { status: 400 }
      );
    }

    if (!Object.values(UserStatus).includes(status)) {
      return NextResponse.json(
        { error: "잘못된 상태값입니다." },
        { status: 400 }
      );
    }

    await prisma.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        status,
      },
    });

    return NextResponse.json({
      message: "선택한 회원의 상태가 변경되었습니다.",
    });
  } catch (error) {
    console.error("Error updating users:", error);
    return NextResponse.json(
      { error: "회원 상태 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
