import { useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive
      ? 'bg-violet-100 text-violet-700'
      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <nav className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-50">

      {/* Left — Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src="/favicon.png" alt="KnowledgeGraph" className="h-7 w-auto" />
      </div>

      {/* Center — Nav links */}
      <div className="flex items-center gap-1">
        <NavLink to="/" end className={navLinkClass}>Dashboard</NavLink>
        <NavLink to="/graph" className={navLinkClass}>Graph</NavLink>
        <NavLink to="/search" className={navLinkClass}>Search</NavLink>
      </div>

      {/* Right — Logout */}
      <button
        onClick={handleLogout}
        className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
      >
        Logout
      </button>

    </nav>
  );
}
