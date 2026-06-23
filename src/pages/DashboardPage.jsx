import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { RenderHistory } from '../components/Dashboard/RenderHistory';
import { PresetManager } from '../components/Dashboard/PresetManager';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import '../styles/dashboard.css';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('renders');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    authService.logout();
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <button
            onClick={() => navigate('/upload')}
            className="btn-back-header"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <h1>Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={20} /> Logout
        </button>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'renders' ? 'active' : ''}`}
            onClick={() => setActiveTab('renders')}
          >
            Renders
          </button>
          <button
            className={`tab-button ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            Presets
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'renders' && <RenderHistory />}
          {activeTab === 'presets' && <PresetManager />}
        </div>
      </main>
    </div>
  );
}
