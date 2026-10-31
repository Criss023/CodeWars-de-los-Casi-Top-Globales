import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/expedientes" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center
                            text-xl border border-white/10 group-hover:bg-white/20 transition">
              ⚖️
            </div>
            <div>
              <p className="font-bold text-white text-base leading-tight">Bufete Popular</p>
              <p className="text-blue-300 text-xs leading-tight">Sistema de Expedientes</p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            <Link
              to="/expedientes"
              className={`text-sm font-medium px-4 py-2 rounded-xl transition ${
                isActive('/expedientes')
                  ? 'bg-white/20 text-white'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Expedientes
            </Link>
            <Link
              to="/expedientes/nuevo"
              className="text-sm font-bold px-4 py-2 bg-white text-blue-900
                         rounded-xl hover:bg-blue-50 transition shadow-md"
            >
              + Nuevo
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-5 mt-4 border-t border-gray-200
                         text-center text-xs text-gray-400">
        Bufete Popular · AI Code Wars 2026 · UMG Chiquimulilla, Santa Rosa
      </footer>
    </div>
  );
}