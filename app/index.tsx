// import { Text, View, Appearance } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }

import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import AppDarkTheme from "@/constants/AppDarkTheme";
import AppLightTheme from "@/constants/AppLightTheme";
import CustomComponent from "@/components/CustomComponent";
import ThemeContext from "@/components/ThemeContext";
import { useColorScheme } from "@/hooks/useColorScheme";

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
        <CustomComponent />
        <StatusBar style="auto" />
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
