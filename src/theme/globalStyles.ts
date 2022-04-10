import { createGlobalStyle, DefaultTheme } from "styled-components";

export const GlobalStyles = createGlobalStyle<{ theme: DefaultTheme }>`
  body {
    background: ${({ theme }) => theme.colors.body};
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.2s linear;
  }

  a {
    color: ${({ theme }) => theme.colors.secondary.main};
    cursor: pointer;
  }
`;
