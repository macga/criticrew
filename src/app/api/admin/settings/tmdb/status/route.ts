import { NextResponse } from "next/server";
import { checkAPIStatus } from "@/lib/tmdb";

export async function GET() {
  try {
    const isConnected = await checkAPIStatus();

    return NextResponse.json({
      success: isConnected,
      recentErrors: [], // 여기에 DB에서 최근 오류 기록을 가져올 수 있습니다
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}
