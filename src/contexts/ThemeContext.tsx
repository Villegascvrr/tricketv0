import { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";

type SectionTheme = "default" | "operations" | "marketing" | "audience" | "sales" | "historical";

interface ThemeContextType {
  sectionTheme: SectionTheme;
  themeClass: string;
}

const ThemeContext = createContext<ThemeContextType>({
  sectionTheme: "default",
  themeClass: "",
});

export const useTheme = () => useContext(ThemeContext);

// Map routes to their themes
const routeThemeMap: Record<string, SectionTheme> = {
  "/operations/pre-festival": "operations",
  "/operations/event-day": "operations",
  "/marketing": "marketing",
  "/audience": "audience",
  "/sales": "sales",
  "/historical": "historical",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const { sectionTheme, themeClass } = useMemo(() => {
    const theme = routeThemeMap[location.pathname] || "default";
    const className = theme !== "default" ? `theme-${theme}` : "";
    return { sectionTheme: theme, themeClass: className };
  }, [location.pathname]);

  return (
    <ThemeContext.Provider value={{ sectionTheme, themeClass }}>
      {children}
    </ThemeContext.Provider>
  );
}
