import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppleDashboard from './components/AppleDashboard';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <AppleDashboard /> : <Landing />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <AppleDashboard /> : <Navigate to="/" />} 
      />
      <Route 
        path="/signup" 
        element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/signin" 
        element={!isAuthenticated ? <SignIn /> : <Navigate to="/dashboard" />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;