import { DefaultTheme } from "@react-navigation/native";

const AppLightTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    text: "#00000",
    card: "#f9f9f9",
    border: "#9F9F9F",
    primary: "#333333",
    background: "#ffffff",
  },
};

export default AppLightTheme;
