import React, { useEffect, useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { apiService } from './services/api';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Sales } from './pages/Sales';
import { Reports } from './pages/Reports';
import { Goals } from './pages/Goals';
import { Performance } from './pages/Performance';
import { Analysis } from './pages/Analysis';
import { Calendar } from './pages/Calendar';
import { Notifications } from './pages/Notifications';
import { Configurations } from './pages/Configurations';
import { Products } from './pages/Products';
import { Clients } from './pages/Clients';
import { Distributors } from './pages/Distributors';
import { PriceList } from './pages/Proposals';

// Context para gerenciar autenticação
interface AuthContextType {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="sales" element={<Sales />} />
          <Route path="reports" element={<Reports />} />
          <Route path="goals" element={<Goals />} />
          <Route path="performance" element={<Performance />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="configurations" element={<Configurations />} />
          <Route path="products" element={<Products />} />
          <Route path="clients" element={<Clients />} />
          <Route path="distributors" element={<Distributors />} />
          <Route path="proposals" element={<PriceList />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
