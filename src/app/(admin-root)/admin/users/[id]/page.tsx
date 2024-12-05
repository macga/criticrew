"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getAvatarColor } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// 회원 상세 정보 인터페이스
interface UserDetails {
  id: string;
  email: string;
  nickname: string;
  avatar: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  _count: {
    likes: number;
    followedBy: number;
    following: number;
  };
}

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  // 회원 정보 상태
  const [user, setUser] = useState<UserDetails | null>(null);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 회원 정보 조회
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await fetch("/api/admin/users/" + params.id);
        if (!response.ok) throw new Error("Failed to fetch user details");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchUserDetails();
    }
  }, [params.id]);

  // 회원 상태 변경 핸들러
  const handleStatusChange = async (value: string) => {
    try {
      const response = await fetch("/api/admin/users/" + params.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: value,
        }),
      });

      if (!response.ok) throw new Error("Failed to update user status");

      const data = await response.json();
      setUser(data.user);
      toast.success("회원 상태가 변경되었습니다");
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("회원 상태 변경에 실패했습니다");
    }
  };

  // 회원 역할 변경 핸들러
  const handleRoleChange = async (value: string) => {
    try {
      const response = await fetch("/api/admin/users/" + params.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: value,
        }),
      });

      if (!response.ok) throw new Error("Failed to update user role");

      const data = await response.json();
      setUser(data.user);
      toast.success("회원 권한이 변경되었습니다");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("회원 권한 변경에 실패했습니다");
    }
  };

  // 로딩 중 표시
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 회원을 찾을 수 없는 경우
  if (!user) {
    return <div>사용자를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 영역 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="-ml-2">
          <ArrowLeft className="size-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">회원 상세 정보</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 기본 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>회원의 기본 정보입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 프로필 영역 */}
            <div className="flex items-center gap-4">
              <Avatar className="size-20">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback
                  className={getAvatarColor(user.nickname) + " text-lg"}>
                  {user.nickname[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user.nickname}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Separator />
            {/* 상태 관리 영역 */}
            <div className="grid gap-2">
              {/* 계정 상태 선택 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">상태</span>
                <Select
                  defaultValue={user.status}
                  onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">활성</SelectItem>
                    <SelectItem value="INACTIVE">비활성</SelectItem>
                    <SelectItem value="SUSPENDED">정지</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* 역할 선택 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">역할</span>
                <Select
                  defaultValue={user.role}
                  onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">일반 사용자</SelectItem>
                    <SelectItem value="ADMIN">관리자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* 이메일 인증 상태 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  이메일 인증
                </span>
                {user.isEmailVerified ? (
                  <Badge variant="default" className="bg-green-500">
                    인증됨
                  </Badge>
                ) : (
                  <Badge variant="secondary">미인증</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 통동 통계 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>활동 통계</CardTitle>
            <CardDescription>회원의 활동 정보입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              {/* 팔로워/팔로잉/좋아요 통계 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">팔로워</span>
                <span className="font-medium">{user._count.followedBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">팔로잉</span>
                <span className="font-medium">{user._count.following}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">좋아요</span>
                <span className="font-medium">{user._count.likes}</span>
              </div>
              <Separator />
              {/* 시간 정보 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  마지막 로그인
                </span>
                <span className="font-medium">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">가입일</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
