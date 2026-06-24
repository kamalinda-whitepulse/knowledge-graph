import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';

// pages
import Login      from './pages/Login';
import Register   from './pages/Register';
import Dashboard  from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';
import GraphView  from './pages/GraphView';
import Search     from './pages/Search';

// layout
import Navbar from './components/Navbar';

export default function App() {
  const token = useAuthStore((s) => s.token);

  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/" replace /> : <Register />}
        />

        {/* Protected routes - all wrapped with Navbar */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/graph"
          element={
            <ProtectedRoute>
              <Navbar />
              <GraphView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <Navbar />
              <NoteDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Navbar />
              <Search />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
