import { createContext, useEffect, useState } from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

import store from "../app/store";
import "../styles/globals.css";
import * as allThemes from "../theme/schema.json";
import { setToLS } from "../utils/storage";
import { useCustomTheme } from "../theme/useTheme";
import { GlobalStyles } from "../theme/globalStyles";

export const AppContext = createContext({
  setTheme: (theme: string) => {},
  theme: "light",
  themes: allThemes,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const {
    selectedTheme: theme,
    themeLoaded,
    setTheme,
    themes,
  } = useCustomTheme("light");
  const [selectedTheme, setSelectedTheme] = useState(allThemes.data[theme]);

  useEffect(() => {
    setSelectedTheme(allThemes.data[theme]);
  }, [theme]);

  useEffect(() => {
    setToLS("themes", allThemes.data);
  }, []);

  return (
    <Provider store={store}>
      {themeLoaded && (
        <ThemeProvider theme={selectedTheme}>
          <GlobalStyles />
          <AppContext.Provider value={{ setTheme, theme, themes }}>
            <Component {...pageProps} />
          </AppContext.Provider>
        </ThemeProvider>
      )}
    </Provider>
  );
}
