import React, { useContext } from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useImagePicker } from '@/hooks/useImagePicker'
import api from '@/utils/api'
import AuthContext from '@/utils/authContext'
import { useAlertModal } from '@/hooks/useAlertModal'
import UnauthenticatedView from '@/components/UnauthenticatedView'
import UserScreen from '@/app/screens/User'

const ProfileScreen = () => {
  const styles = useGlobalStyles()
  const { isAuthenticated, user } = useContext(AuthContext)
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
        onPress={() => {
          // Handle
        }}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </>
  )
}

export default ProfileScreen
