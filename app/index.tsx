import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppDarkTheme from "@/constants/AppDarkTheme";
import AppLightTheme from "@/constants/AppLightTheme";
import ThemeContext from "@/components/ThemeContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import Tabs from "./navigation/MainTab" 
import Header from "./navigation/Header"
import { AuthProvider } from "@/utils/authContext";
import { AlertProvider } from "@/hooks/useAlertModal";

export default function Index() {
  const colorScheme = useColorScheme();

  const [theme, setTheme] = React.useState(colorScheme);
  const themeData = { theme, setTheme };

  return (
    <AuthProvider>
      <ThemeContext.Provider value={themeData}>
        <AlertProvider>
          <NavigationContainer
            independent={true}
            theme={theme === "light" ? AppLightTheme : AppDarkTheme}
          >
            <Header />
            <Tabs />
            <StatusBar style={theme === "light" ? "dark" : "light"} />
          </NavigationContainer>
        </AlertProvider>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}