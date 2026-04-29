import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/post/:id"   element={<PostDetail />} />
          <Route path="/write"      element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/edit/:id"   element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
          <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
