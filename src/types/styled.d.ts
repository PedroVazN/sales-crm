import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      
      background: {
        primary: string;
        secondary: string;
        tertiary: string;
        card: string;
        overlay: string;
      };
      
      text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
      };
      
      border: {
        primary: string;
        secondary: string;
        accent: string;
      };
      
      gradient: {
        primary: string;
        secondary: string;
        accent: string;
      };
    };
    
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      glow: string;
    };
    
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  }
}

