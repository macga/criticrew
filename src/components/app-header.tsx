import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b">
      <div className="flex h-14 items-center px-6 gap-2">
        <SidebarTrigger className="-ml-2" />
        <Image
          src="/criticrew.svg"
          alt="CritiCrew"
          width={100}
          height={18}
          className="-mt-1.5"
        />
      </div>
    </header>
  );
}
