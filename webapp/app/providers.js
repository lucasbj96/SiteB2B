"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Nav } from "./nav";

const AppContext = createContext(null);

const DEFAULT_PRIMARY = "#3B6EF6";
const DEFAULT_SECONDARY = "#10245E";
const ACTIVE_KEY = "catsc_active_client";

function hx(h) {
  h = (h || "").replace("#", "");
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  const n = parseInt(h || "0", 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function lum(c) {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
}

export function initial(name) {
  return ((name || "?").trim()[0] || "?").toUpperCase();
}

export function Providers({ children }) {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [homeContent, setHomeContent] = useState(null);
  const [settings, setSettings] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  const refreshClients = useCallback(async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data.clients || []);
    return data.clients || [];
  }, []);

  const refreshProducts = useCallback(async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || []);
    return data.products || [];
  }, []);

  const refreshHomeContent = useCallback(async () => {
    const res = await fetch("/api/home-content");
    const data = await res.json();
    setHomeContent(data.content);
    return data.content;
  }, []);

  const refreshSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();
    setSettings(data.settings || {});
    return data.settings || {};
  }, []);

  useEffect(() => {
    if (isLogin) {
      setLoading(false);
      return;
    }
    let stored = null;
    try {
      stored = localStorage.getItem(ACTIVE_KEY);
    } catch {}
    Promise.all([refreshClients(), refreshProducts(), refreshHomeContent(), refreshSettings()]).then(
      ([cs]) => {
        if (stored && cs.find((c) => c.id === stored)) setActiveId(stored);
        setLoading(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  const activate = useCallback(
    (id) => {
      setActiveId((cur) => {
        let next;
        if (cur === id) {
          // Deactivating — fall back to the default client (the "opção
          // geral" Católica theme) instead of leaving nothing active.
          const def = clients.find((c) => c.isDefault);
          next = def ? def.id : null;
        } else {
          next = id;
        }
        try {
          if (next) localStorage.setItem(ACTIVE_KEY, next);
          else localStorage.removeItem(ACTIVE_KEY);
        } catch {}
        return next;
      });
    },
    [clients]
  );

  const activeClient = useMemo(() => clients.find((c) => c.id === activeId) || null, [clients, activeId]);

  const theme = useMemo(() => {
    const p = (activeClient && activeClient.primary) || DEFAULT_PRIMARY;
    const s = (activeClient && activeClient.secondary) || DEFAULT_SECONDARY;
    const rgb = hx(p);
    const on = lum(rgb) > 0.52 ? "#14161d" : "#ffffff";
    return {
      "--brand": p,
      "--brand-2": s,
      "--brand-soft": `rgba(${rgb.r},${rgb.g},${rgb.b},.09)`,
      "--brand-line": `rgba(${rgb.r},${rgb.g},${rgb.b},.24)`,
      "--on-brand": on,
    };
  }, [activeClient]);

  const value = {
    clients, setClients, refreshClients,
    products, refreshProducts,
    homeContent, refreshHomeContent,
    settings, refreshSettings,
    activeId, activeClient, activate,
    theme, loading,
  };

  return (
    <AppContext.Provider value={value}>
      <div className="app" style={theme}>
        {!isLogin && <Nav />}
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve ser usado dentro de <Providers>");
  return ctx;
}
