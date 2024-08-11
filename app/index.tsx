import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppDarkTheme from "@/constants/AppDarkTheme";
import AppLightTheme from "@/constants/AppLightTheme";
import CustomComponent from "@/components/CustomComponent";
import ThemeContext from "@/components/ThemeContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import Tabs from "@/components/navigation/MainTab"
import Header from "@/components/navigation/Header"

export default function Index() {
  const colorScheme = useColorScheme();

  const [theme, setTheme] = React.useState(colorScheme);
  const themeData = { theme, setTheme };

  return (
    <ThemeContext.Provider value={themeData}>
      <NavigationContainer
        independent={true}
        theme={theme === "light" ? AppLightTheme : AppDarkTheme}
      >
        <Header />
        <Tabs />
        <StatusBar style="auto" />
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
