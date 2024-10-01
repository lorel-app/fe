import { View, TouchableOpacity, Text, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useImagePicker } from '@/hooks/useImagePicker'
import api from '@/utils/api'
import AuthContext from '@/utils/authContext'
import { useAlertModal } from '@/hooks/useAlertModal'
import UnauthenticatedView from '@/components/UnauthenticatedView'

const ProfileScreen = () => {
  const styles = useGlobalStyles()
  const showAlert = useAlertModal()
  const [displayPicture, setDisplayPicture] = useState(null)
  const { isAuthenticated, user } = useContext(AuthContext)
  const { image, pickImage } = useImagePicker()

  const fetchUser = useCallback(async () => {
    isAuthenticated && user && setDisplayPicture(user.displayPictureThumb)
  }, [isAuthenticated, user])

  useEffect(() => {
    isAuthenticated && fetchUser()
  }, [isAuthenticated, fetchUser])

  useEffect(() => {
    const uploadImage = async () => {
      if (image) {
        try {
          const response = await api.updateProfilePic(image)
          response.success
            ? setDisplayPicture(response.data.displayPicture)
            : showAlert('error', response.data.message)
        } catch (error) {
          console.error('Error uploading profile image:', error)
        }
      }
    }

    uploadImage()
  }, [image, fetchUser, showAlert])

  return isAuthenticated ? (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.rowSpan}>
          <TouchableOpacity style={styles.row}>
            {displayPicture ? (
              <Image
                source={{ uri: displayPicture }}
                resizeMode="cover"
                style={styles.myProfilePic}
              />
            ) : (
              <Icon name="circle" size={100} style={styles.myProfilePic} />
            )}
            {user ? <Text style={styles.text}>{user.username}</Text> : null}
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={pickImage}>
            <Text>Edit Profile Picture</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  ) : (
    <UnauthenticatedView />
  )
}

export default ProfileScreen
