import { useEffect, useState } from "react";
import { DefaultTheme } from "styled-components";
import { setToLS, getFromLS } from "../utils/storage";

export const useCustomTheme = (initialTheme?: DefaultTheme) => {
  const themes = getFromLS("all-themes");
  const [theme, setTheme] = useState(themes?.data?.light ?? initialTheme);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const setMode = (mode: string) => {
    setToLS("theme", mode);
    setTheme(mode);
  };

  // const getFonts = () => {
  //   const allFonts = _.values(_.mapValues(themes.data, "font"));
  //   return allFonts;
  // };

  useEffect(() => {
    const localTheme = getFromLS("theme");
    localTheme ? setTheme(localTheme) : setTheme(themes.data.light);
    setThemeLoaded(true);
  }, []);

  return { themes, theme, themeLoaded, setMode };
};
