import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AppHeader() {
  return (
    <header className="fixed top-0 z-50 w-full bg-background border-b">
      <div className="flex h-14 items-center px-6 gap-4">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-lg font-semibold">CritiCrew</h1>
      </div>
    </header>
  );
}
