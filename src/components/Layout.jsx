import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Dumbbell, User, MessageSquare, Zap, Settings as SettingsIcon } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="app-wrapper">
      <nav className="glass-panel" style={{
        position: 'fixed',
        top: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '95%',
        maxWidth: '1200px',
        zIndex: 100,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
          <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <Dumbbell color="#000" size={20} />
          </div>
          <span className="title-gradient">SocialGym</span>
        </Link>

        <div className="nav-links" style={{ display: 'flex', gap: '2.5rem' }}>
          <NavLink to="/training" icon={<Zap size={18} />} text="Trénink" active={location.pathname === '/training'} />
          <NavLink to="/missions" icon={<MessageSquare size={18} />} text="Mise" active={location.pathname === '/missions'} />
          <NavLink to="/profile" icon={<User size={18} />} text="Profil" active={location.pathname === '/profile'} />
          <NavLink to="/settings" icon={<SettingsIcon size={18} />} text="Nastavení" active={location.pathname === '/settings'} />
        </div>
      </nav>

      <main style={{ paddingTop: '120px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

const NavLink = ({ to, icon, text, active }) => (
  <Link to={to} style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: active ? '600' : '400',
    transition: 'color 0.3s ease'
  }}>
    {icon} {text}
  </Link>
);

export default Layout;
