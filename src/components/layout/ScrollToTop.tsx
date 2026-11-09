import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically scrolls window to top on every route navigation
 * and synchronizes canonical URL tag for search engine indexing.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // Dynamically synchronize canonical link tag to prevent Google "Duplicate without canonical" issues
    if (typeof document !== "undefined") {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      const cleanPath = pathname === "/" ? "" : pathname.replace(/\/+$/, "");
      canonical.setAttribute("href", `https://triphimalaya.com.np${cleanPath || "/"}`);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
