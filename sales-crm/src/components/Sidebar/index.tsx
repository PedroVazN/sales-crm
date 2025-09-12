import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  FileText, 
  Target,
  Activity,
  Calendar,
  Bell,
  Settings,
  Package,
  UserCheck,
  Truck,
  FileSpreadsheet,
  DollarSign
} from 'lucide-react';
import { 
  Container, 
  Logo, 
  MenuSection, 
  MenuItem, 
  MenuIcon, 
  MenuText,
  MenuTitle
} from './styles';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive?: boolean;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({ icon, label, path, isActive }) => {
  const navigate = useNavigate();
  
  return (
    <MenuItem 
      onClick={() => navigate(path)} 
      $isActive={isActive}
    >
      <MenuIcon>{icon}</MenuIcon>
      <MenuText>{label}</MenuText>
    </MenuItem>
  );
};

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'PRINCIPAL',
      items: [
        { icon: <BarChart3 size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Users size={20} />, label: 'Leads', path: '/leads' },
        { icon: <TrendingUp size={20} />, label: 'Vendas', path: '/sales' },
        { icon: <FileText size={20} />, label: 'Relatórios', path: '/reports' },
        { icon: <Target size={20} />, label: 'Metas', path: '/goals' },
      ]
    },
    {
      title: 'ANÁLISE',
      items: [
        { icon: <Activity size={20} />, label: 'Performance', path: '/performance' },
        { icon: <BarChart3 size={20} />, label: 'Análise', path: '/analysis' },
        { icon: <Calendar size={20} />, label: 'Calendário', path: '/calendar' },
      ]
    },
    {
      title: 'GESTÃO',
      items: [
        { icon: <Package size={20} />, label: 'Produtos', path: '/products' },
        { icon: <UserCheck size={20} />, label: 'Clientes', path: '/clients' },
        { icon: <Truck size={20} />, label: 'Distribuidores', path: '/distributors' },
        { icon: <DollarSign size={20} />, label: 'Lista de Preços', path: '/proposals' },
      ]
    },
    {
      title: 'SISTEMA',
      items: [
        { icon: <Bell size={20} />, label: 'Notificações', path: '/notifications' },
        { icon: <Settings size={20} />, label: 'Configurações', path: '/configurations' },
      ]
    }
  ];

  return (
    <Container>
      <Logo>
        <h1>SellOne</h1>
        <span>CRM</span>
      </Logo>
      
      {menuItems.map((section, index) => (
        <MenuSection key={index}>
          <MenuTitle>{section.title}</MenuTitle>
          {section.items.map((item, itemIndex) => (
            <MenuItemComponent
              key={itemIndex}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
            />
          ))}
        </MenuSection>
      ))}
    </Container>
  );
};
