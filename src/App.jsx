// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Conversations from './pages/Conversations';
import LeadsPipeline from './pages/LeadsPipeline';
import Contacts from './pages/Contacts';
import Campaigns from './pages/Campaigns';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AutomationSettings from './pages/AutomationSettings';
import QRCodeIntegration from './pages/QRCodeIntegration'; // ADICIONAR ESTA LINHA

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="conversations" element={<Conversations />} />
            <Route path="pipeline" element={<LeadsPipeline />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="automation" element={<AutomationSettings />} />
            <Route path="qrcode" element={<QRCodeIntegration />} /> {/* ADICIONAR ESTA LINHA */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;