import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-wide">⚖ Bufete Popular</h1>
            <p className="text-blue-300 text-xs mt-0.5">Sistema de Gestión de Expedientes</p>
          </div>
          <nav className="flex gap-2">
            <Link
              to="/expedientes"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
                isActive('/expedientes')
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800'
              }`}
            >
              Expedientes
            </Link>
            <Link
              to="/expedientes/nuevo"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
                isActive('/expedientes/nuevo')
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800'
              }`}
            >
              + Nuevo
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      <footer className="text-center text-xs text-gray-400 py-4 border-t mt-8">
        Bufete Popular — AI Code Wars 2026 | UMG Chiquimulilla
      </footer>
    </div>
  );
}