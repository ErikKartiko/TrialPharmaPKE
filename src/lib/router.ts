import { useEffect, useState } from "react";

/* Router hash sederhana: #/dashboard, #/kasus/case-1/4, dsb. */

export function nav(path: string) {
  window.location.hash = path.startsWith("/") ? path : `/${path}`;
}

export function useHashRoute(): string {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, "") || "/");
  useEffect(() => {
    const onChange = () => setRoute(window.location.hash.replace(/^#/, "") || "/");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function routeParts(route: string): string[] {
  return route.split("/").filter(Boolean);
}

/** Terapkan tema gelap/terang ke <html> */
export function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export { routeParts as parts };
