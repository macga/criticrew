/**
 * API 호출 통계를 보여주는 막대 그래프 컴포넌트
 *
 * @description
 * - recharts를 사용하여 구현하고 shadcn 스타일을 적용
 * - 반응형 레이아웃 지원
 * - 호버 시 툴팁으로 상세 정보 표시
 * - 천 단위 구분자 자동 적용
 *
 * @example
 * ```tsx
 * <Chart data={[
 *   { date: "12.01", calls: 150 },
 *   { date: "12.02", calls: 230 }
 * ]} />
 * ```
 */

"use client";

import * as React from "react";
/** recharts 차트 구성에 필요한 컴포넌트들 */
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Tooltip,
} from "recharts";
/** shadcn 유틸리티: 클래스 이름 조합에 사용 */
import { cn } from "@/lib/utils";

/**
 * 차트에 표시될 데이터 포인트의 구조
 * @property date - X축에 표시될 날짜 (MM.DD 형식)
 * @property calls - Y축에 표시될 API 호출 횟수
 */
interface ChartData {
  date: string;
  calls: number;
}

/**
 * 차트 컴포넌트 Props
 * @property data - 차트에 표시할 데이터 배열
 */
interface ChartProps {
  data: ChartData[];
}

export function Chart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        {/* X축: 날짜 표시 */}
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false} // 눈금선 제거로 깔끔한 디자인
          axisLine={false} // 축선 제거로 미니멀한 스타일
        />
        {/* Y축: 호출 횟수 표시 */}
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value.toLocaleString()}`} // 천 단위 구분자 적용
        />
        {/* 툴팁: 호버 시 상세 정보 표시 */}
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))" }} // shadcn 테마 컬러 사용
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div
                  className={cn(
                    // shadcn 스타일 적용
                    "rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md",
                    // 부드러운 등장 애니메이션
                    "animate-in fade-in-0 zoom-in-95"
                  )}>
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-sm text-muted-foreground">
                    {payload[0].value?.toLocaleString()}회 호출
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        {/* 막대 그래프 */}
        <Bar
          dataKey="calls"
          fill="currentColor"
          radius={[4, 4, 0, 0]} // 상단 모서리만 둥글게
          className="fill-primary" // shadcn 프라이머리 컬러 사용
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
