import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background.primary};
  }

  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  /* Seleção de texto */
  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
  }

  /* Placeholder */
  ::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
    opacity: 1;
  }

  /* Focus outline */
  *:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Transições suaves */
  * {
    transition: all 0.2s ease-in-out;
  }

  /* Reset para inputs */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Reset para botões */
  button {
    font-family: inherit;
    cursor: pointer;
  }

  /* Reset para links */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Reset para listas */
  ul, ol {
    list-style: none;
  }
`;
