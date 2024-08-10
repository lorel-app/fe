import { DarkTheme } from "@react-navigation/native";

const AppDarkTheme = {
  ...DarkTheme,
  dark: false,
  colors: {
    ...DarkTheme.colors,
    text: "#dadada",
    card: "#191919",
    border: "#444859",
    primary: "#333333",
    background: "#000000",
  },
};

export default AppDarkTheme;
