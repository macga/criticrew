"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

const registerSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다"),
});

type RegisterForm = z.infer<typeof registerSchema>;

interface ApiError {
  error: string;
  field?: string;
  message: string;
}

export default function RegisterPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      nickname: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(data: RegisterForm) {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = responseData as ApiError;
        if (error.field) {
          form.setError(error.field as keyof RegisterForm, {
            type: "manual",
            message: error.message,
          });
          toast.error(error.message);
        } else {
          toast.error(error.message || "회원가입에 실패했습니다");
        }
        return;
      }

      setIsSuccess(true);
      toast.success("회원가입이 완료되었습니다");
    } catch {
      toast.error("회원가입 중 오류가 발생했습니다");
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          회원가입이 완료되었습니다!
        </h1>
        <p className="text-sm text-muted-foreground">
          이제 로그인하여 서비스를 이용하실 수 있습니다.
        </p>
        <Button asChild className="mt-4">
          <Link href="/login">로그인하러 가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">회원가입</h1>
        <p className="text-sm text-muted-foreground">
          아래 정보를 입력하여 계정을 만드세요
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>닉네임</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="닉네임을 입력하세요"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="nickname"
                      autoCorrect="off"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="••••••••"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect="off"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full">
              {form.formState.isSubmitting ? "계정 생성 중..." : "계정 생성"}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              또는
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Button variant="outline" asChild>
            <Link href="/login">로그인</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
