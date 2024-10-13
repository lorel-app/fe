import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTheme } from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const NestedTabNavigator = ({ screens }) => {
  const { colors } = useTheme()
  const Tab = createMaterialTopTabNavigator()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          const icons = {
            Shop: 'local-mall',
            Content: 'interests'
          }
          return (
            <MaterialIcons name={icons[route.name]} size={20} color={color} />
          )
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.secondaryTint,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.card
        },
        headerShown: false
      })}
    >
      {screens.map(screen => (
        <Tab.Screen key={screen.name} name={screen.name}>
          {screen.component}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  )
}

export default NestedTabNavigator
