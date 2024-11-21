import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@react-navigation/native'
import AboutScreen from '../screens_static/About'
import LogoMain from '@/assets/images/LogoMain'
import Icon from 'react-native-vector-icons/MaterialIcons'
import UserAgreementsScreen from '../screens_static/UserAgreements'

const Drawer = createDrawerNavigator()

const CustomHeader = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Icon name="menu" color={colors.secondary} size={30} />
      </TouchableOpacity>
      <LogoMain fill={colors.secondary} width={250 / 2.5} height={61 / 2.5} />
    </View>
  )
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="About"
      screenOptions={{
        header: () => <CustomHeader />
      }}
    >
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen
        name="Privacy Policy"
        component={UserAgreementsScreen}
        initialParams={{ selectedTab: 'privacy' }}
      />
      <Drawer.Screen
        name="Terms & Conditions"
        component={UserAgreementsScreen}
        initialParams={{ selectedTab: 'terms' }}
      />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'transparent'
  }
})

export default DrawerNavigator
