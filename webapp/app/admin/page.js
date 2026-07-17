"use client";
import { useState } from "react";
import { useApp } from "../providers";
import { ClientsTab } from "./ClientsTab";
import { HomeTab } from "./HomeTab";
import { ProductsTab } from "./ProductsTab";
import { TrilhasTab } from "./TrilhasTab";
import { SettingsTab } from "./SettingsTab";

const TABS = [
  { id: "clients", label: "Clientes" },
  { id: "home", label: "Página inicial" },
  { id: "products", label: "Conteúdo dos programas" },
  { id: "trilhas", label: "Trilhas" },
  { id: "settings", label: "Configurações" },
];

export default function AdminPage() {
  const { loading } = useApp();
  const [tab, setTab] = useState("clients");

  if (loading) return <div className="wrap"><p className="center-loading">Carregando…</p></div>;

  return (
    <div className="wrap">
      <div style={{ paddingTop: 40 }}>
        <div className="eyebrow">Modo comercial</div>
        <h1 className="sec-title" style={{ fontSize: 32, marginTop: 8 }}>Área restrita</h1>
        <p className="lead" style={{ fontSize: 16, marginTop: 10 }}>
          Cadastre clientes para personalizar propostas, ou edite o conteúdo público das páginas.
        </p>
      </div>

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? "admin-tab on" : "admin-tab"} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ paddingBottom: 90 }}>
        {tab === "clients" && <ClientsTab />}
        {tab === "home" && <HomeTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "trilhas" && <TrilhasTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
