import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  children: React.ReactNode;
}

export function ScrollToTop({ children }: ScrollToTopProps) {
  const location = useLocation();

  useEffect(() => {
    // Scroll the main element to top (the scrollable container)
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo(0, 0);
    }
    // Also scroll window for fallback
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <>{children}</>;
}
