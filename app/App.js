// import * as React from "react";
// import { StatusBar } from "expo-status-bar";
// import { useColorScheme } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";

// import AppDarkTheme from "../constants/AppDarkTheme";
// import AppLightTheme from "../constants/AppLightTheme";
// import CustomComponent from "../components/CustomComponent";

// export default function App() {
//   const colorScheme = useColorScheme();

//   const [theme, setTheme] = React.useState(colorScheme);
//   const themeData = { theme, setTheme };

//   return (
//     <ThemeContext.Provider value={themeData}>
//       <NavigationContainer
//         theme={colorScheme === "light" ? AppLightTheme : AppDarkTheme}
//       >
//         <CustomComponent />
//         <StatusBar style="auto" />
//       </NavigationContainer>
//     </ThemeContext.Provider>
//   );
// }
