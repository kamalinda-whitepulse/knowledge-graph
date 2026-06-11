import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';
import GraphView from './pages/GraphView';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar />}
        <main className="app-main">
          <Routes>
            {!isAuthenticated ? (
              <Route path="*" element={<Login />} />
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/notes/:id" element={<NoteDetail />} />
                <Route path="/graph" element={<GraphView />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;