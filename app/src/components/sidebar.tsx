import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css';

interface SidebarItem {
  label: string;
  path: string;
  icon?: string;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Usuário', path: '/users' },
  { label: 'Ocorrências', path: '/ocorrencias' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Geomaps Portal</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {sidebarItems.map((item) => (
            <li key={item.path} className="sidebar-item">
              <Link
                to={item.path}
                className={`sidebar-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <span className="sidebar-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;