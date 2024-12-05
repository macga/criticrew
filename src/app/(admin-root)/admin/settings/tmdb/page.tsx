"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chart } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface APIStatus {
  isConnected: boolean;
  responseTime: number;
  lastChecked: Date | null;
  recentErrors: {
    timestamp: Date;
    message: string;
  }[];
}

interface APIStats {
  dailyCalls: {
    date: string;
    calls: number;
  }[];
  popularMovies: {
    id: number;
    title: string;
    originalTitle: string;
    calls: number;
  }[];
  totalCalls: number;
  todayCalls: number;
}

export default function TMDBSettingsPage() {
  const [status, setStatus] = useState<APIStatus>({
    isConnected: false,
    responseTime: 0,
    lastChecked: null,
    recentErrors: [],
  });
  const [stats, setStats] = useState<APIStats>({
    dailyCalls: [],
    popularMovies: [],
    totalCalls: 0,
    todayCalls: 0,
  });
  const [isChecking, setIsChecking] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkAPIStatus = useCallback(async () => {
    if (isChecking) return;

    setIsChecking(true);
    try {
      const startTime = performance.now();
      const response = await fetch("/api/admin/settings/tmdb/status");
      const endTime = performance.now();

      if (!response.ok) {
        throw new Error("API 연결 실패");
      }

      const data = await response.json();

      setStatus({
        isConnected: true,
        responseTime: Math.round(endTime - startTime),
        lastChecked: new Date(),
        recentErrors: data.recentErrors || [],
      });
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        isConnected: false,
        lastChecked: new Date(),
        recentErrors: [
          {
            timestamp: new Date(),
            message: error instanceof Error ? error.message : "알 수 없는 오류",
          },
          ...prev.recentErrors.slice(0, 9),
        ],
      }));
    } finally {
      setIsChecking(false);
    }
  }, [isChecking]);

  async function loadAPIStats() {
    try {
      const response = await fetch("/api/admin/settings/tmdb/stats");
      if (!response.ok) throw new Error("통계 데이터를 불러올 수 없습니다");

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to load API stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  }

  useEffect(() => {
    loadAPIStats();
  }, []);

  useEffect(() => {
    setLastChecked(status.lastChecked);
  }, [status.lastChecked]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">TMDB API 설정</h2>
          <p className="text-sm text-muted-foreground">
            TMDB API의 상태를 모니터링하고 설정을 관리합니다
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">API 상태</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {isChecking ? (
                <Badge variant="outline" className="animate-pulse">
                  확인 중...
                </Badge>
              ) : !status.lastChecked ? (
                <Badge variant="secondary" className="gap-1">
                  <Activity className="w-3 h-3" />
                  확인 필요
                </Badge>
              ) : status.isConnected ? (
                <Badge
                  variant="outline"
                  className="gap-1 bg-green-50 text-green-700 border-green-300">
                  <CheckCircle2 className="w-3 h-3" />
                  정상
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="w-3 h-3" />
                  오류
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {status.responseTime}ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                마지막 확인: {lastChecked?.toLocaleString()}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={checkAPIStatus}
                disabled={isChecking}>
                <RefreshCw
                  className={`w-3 h-3 mr-2 ${isChecking ? "animate-spin" : ""}`}
                />
                확인
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">전체 호출</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold">
                {stats.totalCalls.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                오늘: +{stats.todayCalls.toLocaleString()}
              </p>
              <div className="mt-2 text-xs text-muted-foreground space-y-1">
                <p>API 제한: 초당 4회</p>
                <p>일일 최대: 100,000회</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Tabs defaultValue="daily">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>API 사용량 통계</CardTitle>
            <TabsList className="grid w-[250px] grid-cols-2">
              <TabsTrigger value="daily">일간</TabsTrigger>
              <TabsTrigger value="popular">인기 콘텐츠</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="daily">
              {isLoadingStats ? (
                <div className="space-y-2">
                  <Skeleton className="h-[250px]" />
                </div>
              ) : (
                <div className="h-[250px]">
                  <Chart data={stats.dailyCalls} />
                </div>
              )}
            </TabsContent>
            <TabsContent value="popular">
              {isLoadingStats ? (
                <div className="space-y-2">
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.popularMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{movie.title}</span>
                        <span className="text-sm text-muted-foreground">
                          ({movie.originalTitle})
                        </span>
                        <span className="text-sm text-muted-foreground">
                          #{movie.id}
                        </span>
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">
                        {movie.calls.toLocaleString()}회
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">최근 오류</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {status.recentErrors.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              최근 발생한 오류가 없습니다
            </p>
          ) : (
            status.recentErrors.slice(0, 3).map((error, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-destructive">
                    {error.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(error.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
