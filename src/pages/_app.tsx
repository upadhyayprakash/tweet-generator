import { createContext, useEffect, useState } from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

import store from "../app/store";
import "../styles/globals.css";
import * as themes from "../theme/schema.json";
import { setToLS } from "../utils/storage";
import { useCustomTheme } from "../theme/useTheme";
import { GlobalStyles } from "../theme/globalStyles";

export const CustomThemeContext = createContext({
  setTheme: (theme: any) => {},
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const { theme, themeLoaded } = useCustomTheme(themes.data.light);
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    setSelectedTheme(theme);
  }, [themeLoaded, theme]);

  useEffect(() => {
    setToLS("all-themes", themes.data);
  }, []);

  return (
    <Provider store={store}>
      {themeLoaded && (
        <ThemeProvider theme={selectedTheme}>
          <CustomThemeContext.Provider value={{ setTheme: setSelectedTheme }}>
            <GlobalStyles />
            <Component {...pageProps} />
          </CustomThemeContext.Provider>
        </ThemeProvider>
      )}
    </Provider>
  );
}
