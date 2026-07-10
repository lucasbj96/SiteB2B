"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(true);
      return;
    }
    const next = params.get("next") || "/";
    router.push(next);
    router.refresh();
  }

  return (
    <div className="wrap">
      <div className="login-wrap">
        <form className="login-card" onSubmit={onSubmit}>
          <div className="login-badge">C</div>
          <h3 className="login-h">Área restrita</h3>
          <p className="login-s">Acesso exclusivo do time autorizado da Católica SC.</p>
          <div className="field">
            <span className="label">Usuário</span>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
          </div>
          <div className="field">
            <span className="label">Senha</span>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="login-err">Usuário ou senha incorretos.</p>}
          <button type="submit" className="btn btn-brand" style={{ width: "100%", justifyContent: "center", marginTop: 6 }} disabled={submitting}>
            {submitting ? "Entrando…" : "Entrar →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
