import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <header className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-[#1f1f1f]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/expedientes" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-md bg-[#ff4f00]/10 flex items-center justify-center
                            text-lg border border-[#ff4f00]/20 group-hover:bg-[#ff4f00]/20 transition">
              ⚖️
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">Bufete Popular</p>
              <p className="text-[#ff4f00] text-xs leading-tight font-mono">Sistema de Expedientes</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/expedientes"
              className={`text-sm font-medium px-4 py-2 rounded-md transition border ${
                isActive('/expedientes')
                  ? 'bg-[#ff4f00]/10 text-[#ff4f00] border-[#ff4f00]/20'
                  : 'text-[#aaa] hover:text-white hover:bg-[#1a1a1a] border-transparent'
              }`}
            >
              Expedientes
            </Link>
            <Link
              to="/expedientes/nuevo"
              className="text-sm font-bold px-4 py-2 bg-[#ff4f00] text-white
                         rounded-md hover:bg-[#ff6a20] transition"
            >
              + Nuevo
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 text-[#d4d4d4]">{children}</main>

      <footer className="max-w-5xl mx-auto px-4 py-5 mt-4 border-t border-[#1f1f1f]
                         text-center text-xs text-[#444] font-mono">
        Bufete Popular · AI Code Wars 2026 · UMG Chiquimulilla, Santa Rosa
      </footer>
    </div>
  );
}