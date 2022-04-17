/**
 * Reference: https://styled-components.com/docs/api#create-a-declarations-file
 */

// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    id: number;
    code: string;
    name: string;
    colors: {
      body: string;
      badge: string;
      borderColor: string;
      text: {
        primary: string;
        secondary: string;
      };
      primary: {
        main: string;
        light: string;
        dark: string;
      };
      secondary: {
        main: string;
        light: string;
        dark: string;
      };
    };
  }
}
