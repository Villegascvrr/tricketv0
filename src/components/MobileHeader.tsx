import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileHeader() {
  const { toggleSidebar, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <header className="sticky top-0 z-40 flex h-12 items-center gap-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir menú</span>
      </Button>
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-foreground truncate">
          Primaverando
        </h1>
        <p className="text-[10px] text-muted-foreground">Command Center 2025</p>
      </div>
    </header>
  );
}

export default MobileHeader;
