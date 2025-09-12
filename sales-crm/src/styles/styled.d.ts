import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: {
        main: string;
        secondary: string;
        tertiary: string;
        primary: string;
        card: string;
        cardHover: string;
        modal: string;
      };
      text: {
        primary: string;
        secondary: string;
        muted: string;
        disabled: string;
        tertiary: string;
        inverse: string;
      };
      border: {
        primary: string;
        secondary: string;
        focus: string;
      };
      status: {
        success: string;
        warning: string;
        error: string;
        info: string;
      };
      success: string;
      error: string;
      gradients: {
        primary: string;
        background: string;
        card: string;
        button: string;
      };
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
      glow: string;
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
    transitions: {
      fast: string;
      normal: string;
      slow: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    zIndex: {
      dropdown: number;
      modal: number;
      tooltip: number;
    };
  }
}
