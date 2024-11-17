import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <LoginButton><Button size="lg">로그인</Button></LoginButton>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">프리텐다드</h1>
      <div className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">criticrew:크리티크루</div>
      <p className="leading-7 [&:not(:first-child)]:mt-6">위의 github에서 파일을 다운로드 받은 후 web - variable - woff2 에 있는 PretendardVariable.woff2 파일을 app 폴더의 fonts 폴더를 만들어 옮겨 준다. (fonts 폴더는 app 폴더 안에 있어도 관계 없다.)
그 다음 루트 폴더의 layout.tsx에서 다음과 같이 작성한다.</p>
      </main>
  );
}
