import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  children: React.ReactNode;
}

export function ScrollToTop({ children }: ScrollToTopProps) {
  const location = useLocation();

  useEffect(() => {
    // Scroll window to top for mobile and any scrollable container
    window.scrollTo(0, 0);
    // Also try to scroll any parent with overflow
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
  }, [location.pathname]);

  return <>{children}</>;
}
