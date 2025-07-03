import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log('ScrollToTop fired for', pathname);
    const el = document.getElementById('main-content');
    if (el) el.scrollTop = 0;
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
} 