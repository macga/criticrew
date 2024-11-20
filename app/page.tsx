import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <LoginButton>
        <Button size="lg">로그인</Button>
      </LoginButton>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        공부시작!
      </h1>
      <div className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        criticrew:크리티크루
      </div>
    </main>
  );
}
