import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import logo from '../assets/biglogo.png';

export default function Login() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login(email, password);
      setToken(res.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">

      {/* Left side - Logo */}
      <div className="flex justify-center items-center">
        <img src={logo} alt="KnowledgeGraph Logo" className="w-64" />
      </div>

      {/* Right side - Form */}
      <form onSubmit={handleSubmit} className="border-2 bg-black/80 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-full max-w-sm">

        <h2 className="font-medium text-2xl">Login</h2>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white placeholder-gray-400"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white placeholder-gray-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Login Now'}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">Agree to the terms of use &amp; privacy policy.</label>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-violet-500 cursor-pointer">
              Click here
            </Link>
          </p>
        </div>

      </form>
    </div>
  );
}
