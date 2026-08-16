import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, LayoutDashboard, Library, Tags, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Books', path: '/books', icon: <Library size={20} /> },
    { name: 'Categories', path: '/categories', icon: <Tags size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ padding: '24px 30px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-color)' }}>
          <BookOpen size={28} color="var(--primary)" />
          <span style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--primary)' }}>BookHive</span>
        </div>

        <div style={{ flex: 1 }}>
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 30px',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--secondary)' : 'transparent',
                  borderRight: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s',
                }}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </div>

        <div style={{ padding: 20, borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', width: '100%', padding: '10px 10px', borderRadius: 8 }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut size={20} />
            <span style={{ fontWeight: 500 }}>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1 style={{ fontSize: 20, fontWeight: 600, textTransform: 'capitalize' }}>
            {location.pathname.split('/')[1] || 'Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500, display: 'flex', gap: 10 }}>
              <span>{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>{currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderLeft: '1px solid var(--border-color)', paddingLeft: 20 }}>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user?.name ||user?.email}</span>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>
        <div className="content-area"><Outlet /></div>
      </div>
    </div>
  );
};

export default AdminLayout;
