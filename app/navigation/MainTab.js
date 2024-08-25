import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HomeScreen from "@/app/screens/Home";
import ProfileScreen from "@/app/screens/Profile"
import { useTheme } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

function Tabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Profile") {
            iconName = focused ? "account-circle" : "account-circle";
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.tint,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.card,
        },
        headerShown: false,
        // tabBarBadge + tabBarBadgeStyle for notifications
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default Tabs
