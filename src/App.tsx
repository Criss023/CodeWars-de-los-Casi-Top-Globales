import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ExpedientesPage } from './pages/ExpedientesPage';
import { NuevoExpedientePage } from './pages/NuevoExpedientePage';
import { ExpedienteDetailPage } from './pages/ExpedienteDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/expedientes" replace />} />
          <Route path="/expedientes" element={<ExpedientesPage />} />
          <Route path="/expedientes/nuevo" element={<NuevoExpedientePage />} />
          <Route path="/expedientes/:id" element={<ExpedienteDetailPage />} />
          <Route path="*" element={<Navigate to="/expedientes" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}