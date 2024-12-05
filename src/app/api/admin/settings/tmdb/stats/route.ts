import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format } from "date-fns";
import { getMovieDetails } from "@/lib/tmdb";

export async function GET() {
  try {
    // 오늘의 호출 수
    const today = startOfDay(new Date());
    const todayCalls = await prisma.tMDBApiLog.count({
      where: {
        timestamp: {
          gte: today,
        },
        type: {
          not: "status",
        },
      },
    });

    // 전체 호출 수
    const totalCalls = await prisma.tMDBApiLog.count({
      where: {
        type: {
          not: "status",
        },
      },
    });

    // 최근 30일간 일별 호출 수
    const dailyCalls = await Promise.all(
      Array.from({ length: 30 }, (_, i) => {
        const date = subDays(today, i);
        return prisma.tMDBApiLog
          .count({
            where: {
              timestamp: {
                gte: date,
                lt: subDays(today, i - 1),
              },
              type: {
                not: "status",
              },
            },
          })
          .then((calls) => ({
            date: format(date, "MM.dd"),
            calls,
          }));
      })
    );

    // 가장 많이 조회된 영화 TOP 5
    const popularMovies = await prisma.tMDBApiLog.groupBy({
      by: ["tmdbId"],
      where: {
        type: "movie",
      },
      _count: {
        tmdbId: true,
      },
      orderBy: {
        _count: {
          tmdbId: "desc",
        },
      },
      take: 5,
    });

    // 영화 상세 정보 조회
    const moviesWithDetails = await Promise.all(
      popularMovies.map(async (movie) => {
        try {
          const details = await getMovieDetails(movie.tmdbId);
          return {
            id: movie.tmdbId,
            title: details.title,
            originalTitle: details.original_title,
            calls: movie._count.tmdbId,
          };
        } catch (error) {
          console.error(
            `Failed to fetch movie details for ID ${movie.tmdbId}:`,
            error
          );
          return {
            id: movie.tmdbId,
            title: `영화 ${movie.tmdbId}`,
            originalTitle: "",
            calls: movie._count.tmdbId,
          };
        }
      })
    );

    return NextResponse.json({
      totalCalls,
      todayCalls,
      dailyCalls: dailyCalls.reverse(),
      popularMovies: moviesWithDetails,
    });
  } catch (error) {
    console.error("Failed to fetch TMDB API stats:", error);
    return NextResponse.json(
      { error: "통계 데이터를 불러오는데 실패했습니다" },
      { status: 500 }
    );
  }
}
