import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    // Cores principais
    primary: '#00d4aa',
    secondary: '#6366f1',
    accent: '#ec4899',
    
    // Backgrounds
    background: {
      main: '#0f0f23',
      secondary: '#1a1a2e',
      tertiary: '#16213e',
      primary: '#0f0f23', // Adicionado para compatibilidade
      card: 'rgba(255, 255, 255, 0.05)',
      cardHover: 'rgba(255, 255, 255, 0.08)',
      modal: 'rgba(0, 0, 0, 0.8)',
    },
    
    // Textos
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.8)',
      muted: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.4)',
      tertiary: 'rgba(255, 255, 255, 0.5)', // Adicionado para compatibilidade
      inverse: '#000000', // Adicionado para compatibilidade
    },
    
    // Bordas
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.2)',
      focus: 'rgba(0, 212, 170, 0.5)',
    },
    
    // Status
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    
    // Cores diretas para compatibilidade
    success: '#10b981',
    error: '#ef4444',
    
    // Gradientes
    gradients: {
      primary: 'linear-gradient(135deg, #00d4aa 0%, #6366f1 50%, #ec4899 100%)',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
      button: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    
  },
  
  // Sombras
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.15)',
    large: '0 8px 32px rgba(0, 0, 0, 0.2)',
    glow: '0 0 30px rgba(0, 212, 170, 0.3)',
  },
  
  // Espaçamentos
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  // Bordas
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '50%',
  },
  
  // Transições
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  
  // Breakpoints
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
  
  // Z-index
  zIndex: {
    dropdown: 100,
    modal: 1000,
    tooltip: 1100,
  },
};

export type Theme = typeof theme;