import { DefaultTheme } from "@react-navigation/native";
import { Colors } from "./Colors";

const AppLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    // These are default:
    // primary: "rgb(0, 122, 255)",
    // background: "rgb(242, 242, 242)",
    // card: "rgb(255, 255, 255)",
    // text: "rgb(28, 28, 30)",
    // border: "rgb(216, 216, 216)",
    // notification: "rgb(255, 59, 48)",
    background: "#EEEBE6",
    card: Colors.white,
    tint: "#D3D5DC",
    accent: Colors.red,
    primary: Colors.blue,
    primaryTint: "#B5BBD1",
    secondary: Colors.blueDark,
    secondaryTint: "#B8C1E1",
    tertiary: "#AF1F00",
    text: Colors.black,
    textAlt: Colors.white,
  },
};

export default AppLightTheme;
