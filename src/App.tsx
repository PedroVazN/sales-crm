import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { Proposals } from './pages/Proposals';
import { PriceList } from './pages/PriceList';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
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
        <Route path="proposals" element={<Proposals />} />
        <Route path="price-list" element={<PriceList />} />
      </Route>
    </Routes>
  );
}

export default App;
