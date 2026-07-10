"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useApp, initial } from "./providers";

export function Nav() {
  const { activeClient } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const chipLabel = "Proposta para";
  const showChip = !!activeClient && !activeClient.isDefault;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="nav">
      <div className="wrap">
        <div className="nav-in">
          <Link className="brand-lock" href="/">
            <img className="blk" src="/assets/catolica-logo.png" alt="Católica SC" />
            <div>
              <div className="brand-name">Católica SC</div>
              <div className="brand-sub">Educação Corporativa</div>
            </div>
          </Link>
          <div className="nav-links">
            <Link className={isHome ? "nav-link on" : "nav-link"} href="/">
              Visão geral
            </Link>
          </div>
          <div className="nav-right">
            {showChip && (
              <div className="chip">
                {activeClient.logo ? (
                  <img className="chip-logo" src={activeClient.logo} alt="" />
                ) : (
                  <div className="chip-dot">{initial(activeClient.name)}</div>
                )}
                <div>
                  <div className="chip-lbl">{chipLabel}</div>
                  <div className="chip-name">{activeClient.name}</div>
                </div>
              </div>
            )}
            <button className="logout-link" onClick={logout}>
              Sair
            </button>
            <Link className="corner-access" href="/admin" title="Acesso interno">
              ⚙
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
