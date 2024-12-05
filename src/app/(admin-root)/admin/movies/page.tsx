"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { searchMovies, getPopularMovies, getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true);
      try {
        if (!debouncedSearch) {
          const data = await getPopularMovies(currentPage);
          setMovies(data.results);
          setTotalPages(Math.min(data.total_pages, 500));
          setTotalResults(data.total_results);
        } else {
          const data = await searchMovies(debouncedSearch, currentPage);
          setMovies(data.results);
          if (data.results.length === 0 && debouncedSearch) {
            const dataWithOriginalTitle = await searchMovies(
              debouncedSearch,
              currentPage
            );
            setMovies(dataWithOriginalTitle.results);
            setTotalPages(Math.min(dataWithOriginalTitle.total_pages, 500));
            setTotalResults(dataWithOriginalTitle.total_results);
          } else {
            setTotalPages(Math.min(data.total_pages, 500));
            setTotalResults(data.total_results);
          }
        }
      } catch {
        toast.error("영화 목록을 불러오는 중 오류가 발생했습니다");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, [currentPage, debouncedSearch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">영화 관리</h2>
        <Input
          placeholder="영화 제목으로 검색"
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        총 {totalResults.toLocaleString()}개의 영화가 검색되었습니다
      </p>

      <Table>
        <TableHeader className="bg-muted">
          <TableRow className="hover:bg-muted">
            <TableHead className="w-[8%] font-medium">ID</TableHead>
            <TableHead className="w-[10%] font-medium">포스터</TableHead>
            <TableHead className="w-[42%] font-medium">제목</TableHead>
            <TableHead className="w-[15%] font-medium">개봉일</TableHead>
            <TableHead className="w-[15%] text-right font-medium">
              평점
            </TableHead>
            <TableHead className="w-[10%] font-medium">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                로딩 중...
              </TableCell>
            </TableRow>
          ) : movies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {searchQuery ? "검색 결과가 없습니다" : "영화가 없습니다"}
              </TableCell>
            </TableRow>
          ) : (
            movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell className="font-mono">{movie.id}</TableCell>
                <TableCell>
                  <Image
                    src={
                      movie.poster_path
                        ? (getImageUrl(movie.poster_path, "w500") as string)
                        : "/no-image.png"
                    }
                    alt={movie.title}
                    width={50}
                    height={75}
                    className="rounded-sm"
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{movie.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {movie.original_title}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {movie.release_date}
                </TableCell>
                <TableCell className="text-right">
                  {movie.vote_average.toFixed(1)}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    선택
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    currentPage > 1 && setCurrentPage((page) => page - 1)
                  }
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                return pageNumber;
              }).map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={currentPage === pageNumber}>
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    currentPage < totalPages &&
                    setCurrentPage((page) => page + 1)
                  }
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
