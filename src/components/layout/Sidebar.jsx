import { NavLink } from 'react-router-dom';
import { Home, Users, FileText, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ role }) => {
  const { logout } = useAuth();

  const hrLinks = [
    { to: '/hr/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/hr/employees', icon: Users, label: 'Employees' },
    { to: '/hr/create-employee', icon: FileText, label: 'Create Employee' },
  ];

  const employeeLinks = [
    { to: '/employee/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/employee/status', icon: FileText, label: 'Status' },
  ];

  const links = role === 'hr' ? hrLinks : employeeLinks;

  return (
    <div className="w-56 bg-white border-r border-neutral-300 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-neutral-300 flex justify-center">
        <img 
          src="/src/assets/Nesto-logo.png" 
          alt="Nesto Logo" 
          className="h-7 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2 px-2">Menu</p>
        <div className="space-y-0.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-900 font-semibold border-l-2 border-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`
              }
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-neutral-300">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 w-full transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
