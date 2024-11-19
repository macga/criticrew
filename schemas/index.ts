import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "올바른 이메일을 입력해 주세요",
  }),
  password: z.string().min(1, {
    message: "비밀번호를 입력해 주세요",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "이메일을 입력해 주세요",
  }),
  password: z.string().min(6, {
    message: "최소 6자를 입력해 주세요",
  }),
  name: z.string().min(1, {
    message: "닉네임을 입력해 주세요",
  }),
});
