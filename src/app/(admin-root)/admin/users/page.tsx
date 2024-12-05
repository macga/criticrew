"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAvatarColor } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { Role, UserStatus } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// 회원 정보 인터페이스
interface User {
  id: string;
  email: string;
  nickname: string;
  avatar: string | null;
  role: Role;
  status: UserStatus;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  _count: {
    likes: number;
    followedBy: number;
    following: number;
  };
}

// API 응답 인터페이스
interface UsersResponse {
  users: User[];
  total: number;
  pages: number;
}

// 필터 상태 타입
type FilterStatus = UserStatus | "ALL";
type FilterRole = Role | "ALL";

export default function UsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 필터링 상태
  const [status, setStatus] = useState<FilterStatus>("ALL");
  const [role, setRole] = useState<FilterRole>("ALL");
  const [isEmailVerified, setIsEmailVerified] = useState<
    "ALL" | "true" | "false"
  >("ALL");

  // 정렬 상태
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const debouncedSearch = useDebounce(searchQuery, 300);

  // 선택된 회원 ID 목록
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // 전체 선택 상태
  const isAllSelected =
    users.length > 0 && selectedUsers.length === users.length;

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  // 개별 선택/해제 핸들러
  const handleSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // 선택된 회원 상태 변경 핸들러
  const handleUpdateStatus = async (newStatus: UserStatus) => {
    if (selectedUsers.length === 0) {
      toast.error("선택된 회원이 없습니다");
      return;
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error();

      toast.success("선택한 회원의 상태가 변경되었습니다");
      setSelectedUsers([]);
      // 목록 새로고침
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(status !== "ALL" && { status }),
        ...(role !== "ALL" && { role }),
        ...(isEmailVerified !== "ALL" && { isEmailVerified }),
        sortBy,
        sortOrder,
      });

      const refreshResponse = await fetch("/api/admin/users?" + params);
      const data: UsersResponse = await refreshResponse.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error updating users:", error);
      toast.error("회원 상태 변경에 실패했습니다");
    }
  };

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(status !== "ALL" && { status }),
          ...(role !== "ALL" && { role }),
          ...(isEmailVerified !== "ALL" && { isEmailVerified }),
          sortBy,
          sortOrder,
        });

        const response = await fetch("/api/admin/users?" + params);
        const data: UsersResponse = await response.json();

        setUsers(data.users);
        setTotalPages(data.pages);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, [
    currentPage,
    debouncedSearch,
    status,
    role,
    isEmailVerified,
    sortBy,
    sortOrder,
  ]);

  const statusColors = {
    ACTIVE: "bg-green-500",
    INACTIVE: "bg-gray-500",
    SUSPENDED: "bg-red-500",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">회원 관리</h2>
          {selectedUsers.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {selectedUsers.length}명 선택됨
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleUpdateStatus("ACTIVE")}>
                  활성화
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus("INACTIVE")}>
                  비활성화
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus("SUSPENDED")}>
                  계정 정지
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <Input
          placeholder="이메일 또는 닉네임으로 검색"
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as FilterStatus)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">모든 상태</SelectItem>
            <SelectItem value="ACTIVE">활성</SelectItem>
            <SelectItem value="INACTIVE">비활성</SelectItem>
            <SelectItem value="SUSPENDED">정지</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={role}
          onValueChange={(value) => setRole(value as FilterRole)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="역할 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">모든 역할</SelectItem>
            <SelectItem value="USER">일반 사용자</SelectItem>
            <SelectItem value="ADMIN">관리자</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={isEmailVerified}
          onValueChange={(value: "ALL" | "true" | "false") =>
            setIsEmailVerified(value)
          }>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="이메일 인증 상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">모든 인증 상태</SelectItem>
            <SelectItem value="true">인증됨</SelectItem>
            <SelectItem value="false">미인증</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">가입일</SelectItem>
            <SelectItem value="lastLoginAt">마지막 로그인</SelectItem>
            <SelectItem value="nickname">닉네임</SelectItem>
            <SelectItem value="email">이메일</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 순서" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">내림차순</SelectItem>
            <SelectItem value="asc">오름차순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>사용자</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>이메일 인증</TableHead>
              <TableHead>팔로워</TableHead>
              <TableHead>마지막 로그인</TableHead>
              <TableHead>가입일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  회원이 없습니다
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={(e) => {
                    // 체크박스 클릭 시 상세 페이지로 이동하지 않음
                    if ((e.target as HTMLElement).closest(".checkbox-cell")) {
                      return;
                    }
                    router.push("/admin/users/" + user.id);
                  }}>
                  <TableCell className="checkbox-cell">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelect(user.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback className={getAvatarColor(user.nickname)}>
                        {user.nickname[0]}
                      </AvatarFallback>
                    </Avatar>
                    {user.nickname}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[user.status]}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.isEmailVerified ? (
                      <Badge variant="default" className="bg-green-500">
                        인증됨
                      </Badge>
                    ) : (
                      <Badge variant="secondary">미인증</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user._count.followedBy}</TableCell>
                  <TableCell>
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && users.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage((p) => p - 1);
                }}
              />
            </PaginationItem>

            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(1);
                  }}>
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage - 1);
                  }}>
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink href="#" isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage + 1);
                  }}>
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(totalPages);
                  }}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
