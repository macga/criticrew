const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_API_BASE_URL =
  process.env.NEXT_PUBLIC_TMDB_API_BASE_URL || "https://api.themoviedb.org/3";

// API 키 확인용 로그
console.log("TMDB_API_KEY:", TMDB_API_KEY);

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
}

interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

import { prisma } from "@/lib/prisma";

async function logAPICall(type: string, tmdbId: number, endpoint: string) {
  try {
    await prisma.tMDBApiLog.create({
      data: {
        type,
        tmdbId,
        endpoint,
      },
    });
  } catch (error) {
    console.error("Failed to log TMDB API call:", error);
  }
}

export async function searchMovies(
  query: string,
  page = 1
): Promise<TMDBResponse<TMDBMovie>> {
  const url = new URL(`${TMDB_API_BASE_URL}/search/movie`);
  url.searchParams.append("api_key", TMDB_API_KEY!);
  url.searchParams.append("query", query);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("language", "ko-KR");
  url.searchParams.append("region", "KR");
  url.searchParams.append("include_adult", "false");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();

  // 검색 API 자체에 대한 로깅
  await logAPICall("search", 0, "/search/movie");

  return data;
}

export async function getPopularMovies(
  page = 1
): Promise<TMDBResponse<TMDBMovie>> {
  const url = new URL(`${TMDB_API_BASE_URL}/movie/popular`);
  url.searchParams.append("api_key", TMDB_API_KEY!);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("language", "ko-KR");
  url.searchParams.append("region", "KR");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status}`);
  }

  const data = await response.json();

  // 인기 영화 API 자체에 대한 로깅
  await logAPICall("list", 0, "/movie/popular");

  return data;
}

export async function getMovieDetails(movieId: number): Promise<
  TMDBMovie & {
    genres: { id: number; name: string }[];
    runtime: number;
    status: string;
    tagline: string;
    production_companies: {
      id: number;
      name: string;
      logo_path: string | null;
      origin_country: string;
    }[];
  }
> {
  const url = new URL(`${TMDB_API_BASE_URL}/movie/${movieId}`);
  url.searchParams.append("api_key", TMDB_API_KEY!);
  url.searchParams.append("language", "ko-KR");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  const data = await response.json();

  // 영화 상세 정보 조회에 대한 로깅
  await logAPICall("movie", movieId, `/movie/${movieId}`);

  return data;
}

export function getImageUrl(
  path: string | null,
  size: "original" | "w500" = "w500"
): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function checkAPIStatus(): Promise<boolean> {
  const url = new URL(`${TMDB_API_BASE_URL}/authentication/token/new`);
  url.searchParams.append("api_key", TMDB_API_KEY!);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("API connection failed");
    }

    // API 상태 체크에 대한 로깅
    await logAPICall("status", 0, "/authentication/token/new");

    return true;
  } catch (error) {
    console.error("TMDB API status check failed:", error);
    return false;
  }
}
