import { useEffect, useState } from "react";
import { setToLS, getFromLS } from "../utils/storage";

export const useCustomTheme = (initialTheme?: string) => {
  const [themes, setThemes] = useState<any>({});
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const setTheme = (theme: any) => {
    setToLS("selectedTheme", theme);
    setSelectedTheme(theme);
  };

  // const getFonts = () => {
  //   const allFonts = _.values(_.mapValues(themes.data, "font"));
  //   return allFonts;
  // };

  useEffect(() => {
    const localThemes = getFromLS("themes");
    if (localThemes) setThemes(localThemes);

    const localTheme = getFromLS("selectedTheme");
    if (localTheme) setSelectedTheme(localTheme);
    else setTheme(initialTheme);

    setThemeLoaded(true);
  }, []);

  return { themes, selectedTheme, themeLoaded, setTheme };
};
