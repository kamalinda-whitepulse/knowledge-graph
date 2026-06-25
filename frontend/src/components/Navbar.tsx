import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      <span className="font-medium">KnowledgeGraph</span>
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 hover:underline cursor-pointer"
      >
        Logout
      </button>
    </nav>
  );
}
