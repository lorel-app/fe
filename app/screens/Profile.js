import React, { useContext } from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import { useTheme, useNavigation } from '@react-navigation/native' // Use useNavigation hook
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useImagePicker } from '@/hooks/useImagePicker'
import api from '@/utils/api'
import AuthContext from '@/utils/authContext'
import UnauthenticatedView from '@/components/UnauthenticatedView'
import UserScreen from '@/app/screens/User'
import DropDownMenu from '@/components/DropDownMenu'

const ProfileScreen = () => {
  const styles = useGlobalStyles()
  const { isAuthenticated, user } = useContext(AuthContext)
  const navigation = useNavigation()

  const options = [
    { label: 'Edit profile', value: 'CONTT' },
    { label: 'Change username', value: 'CONTENT' },
    { label: 'Change profile picture', value: 'SHP' },
    { label: 'Change cover picture', value: 'SHOP' },
    { label: 'Clear profile picture', value: 'SHiP', icon: 'delete' },
    { label: 'Clear cover picture', value: 'SHooP', icon: 'delete' }
  ]

  const handleOptionSelect = value => {
    if (value === 'CONTENT') {
      console.log(options)
    } else {
      console.log(value)
    }
  }

  const routeParams = {
    user: user,
    showHeader: false
  }

  if (!isAuthenticated || !user) {
    return <UnauthenticatedView />
  }

  return (
    <>
      <UserScreen
        route={{
          params: routeParams
        }}
        navigation={navigation}
      />
      <TouchableOpacity
        style={styles.buttonAbsolute}
        onPress={() => navigation.navigate('EditProfile', { user })}
      >
        <Text style={styles.buttonText}>edit profile</Text>
      </TouchableOpacity>
      <View style={styles.editButton}>
        <DropDownMenu
          options={options}
          hasIconButton={'edit'}
          onSelect={handleOptionSelect}
        />
      </View>
    </>
  )
}

export default ProfileScreen
