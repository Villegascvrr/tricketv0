import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  children: React.ReactNode;
}

export function ScrollToTop({ children }: ScrollToTopProps) {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <main ref={mainRef} className="flex-1 min-w-0 overflow-auto">
      {children}
    </main>
  );
}
