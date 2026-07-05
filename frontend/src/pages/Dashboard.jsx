import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch dashboard data');
        }

        setData(result);
      } catch (err) {
        setToast({
          message: err.message,
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-nav">
          <div className="skeleton" style={{ width: '150px', height: '24px', borderRadius: '4px' }}></div>
          <div className="skeleton" style={{ width: '120px', height: '32px', borderRadius: '50px' }}></div>
        </div>
        <div className="dashboard-content">
          <div className="skeleton skeleton-title"></div>
          <div className="grid-metrics">
            <div className="skeleton" style={{ height: '96px', borderRadius: '14px' }}></div>
            <div className="skeleton" style={{ height: '96px', borderRadius: '14px' }}></div>
          </div>
          <div className="skeleton" style={{ height: '200px', borderRadius: '14px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Navigation Header */}
      <div className="dashboard-nav">
        <div className="dashboard-brand">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Aegis Shield</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="dashboard-user-badge">
            <span className="user-dot"></span>
            <span>Active Session</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Hello, {data?.user?.name}!</h2>
          <p>Welcome to your secure account command center. You have successfully authenticated using JSON Web Tokens.</p>
        </div>

        {/* Profile Metrics Grid */}
        <div className="grid-metrics">
          <div className="metric-card">
            <div className="metric-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="metric-details">
              <p>Authenticated User</p>
              <h4>{data?.user?.name}</h4>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon metric-icon-green">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="metric-details">
              <p>Email Address</p>
              <h4>{data?.user?.email}</h4>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
