import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Navbar />
      <Outlet />
    </ProtectedRoute>
  );
}

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

        {/* Protected routes - share one Navbar via layout route */}
        <Route element={<ProtectedLayout />}>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/graph"     element={<GraphView />} />
          <Route path="/notes/:id" element={<NoteDetail />} />
          <Route path="/search"    element={<Search />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
