import React, { useContext, useState } from 'react'
import { View, TouchableOpacity, Text, Image, TextInput } from 'react-native'
import { useTheme, useNavigation } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useImagePicker } from '@/hooks/useImagePicker'
import ModalScreen from '@/components/ModalScreen'
import { useConfirmModal } from '@/hooks/useConfirmModal'
import api from '@/utils/api'
import AuthContext from '@/utils/authContext'
import UnauthenticatedView from '@/components/UnauthenticatedView'
import UserScreen from '@/app/screens/User'
import DropDownMenu from '@/components/DropDownMenu'
import Spacer from '@/components/Spacer'
import Loader from '@/components/Loader'
import { useAlertModal } from '@/hooks/useAlertModal'

const ProfileScreen = () => {
  const styles = useGlobalStyles()
  const showAlert = useAlertModal()
  const showConfirm = useConfirmModal()
  const { isAuthenticated, user } = useContext(AuthContext)
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false)
  const { pickImage } = useImagePicker()

  const options = [
    { label: 'Edit profile', value: 'edit_profile' },
    { label: 'Change username', value: 'edit_username' },
    { label: 'Change profile picture', value: 'edit_pp' },
    { label: 'Change cover picture', value: 'edit_cp' },
    { label: 'Clear profile picture', value: 'delete_pp', icon: 'delete' },
    { label: 'Clear cover picture', value: 'delete_cp', icon: 'delete' }
  ]

  const handleOptionSelect = async value => {
    const actionMap = {
      edit_profile: () => navigation.navigate('EditProfile', { user }),
      edit_username: () => setIsUsernameModalVisible(true),
      edit_pp: () => handleImageUpdate(api.updateProfilePic),
      edit_cp: () => handleImageUpdate(api.updateCoverPic),
      delete_pp: () =>
        handleImageDelete(api.deleteProfilePic, 'profile picture'),
      delete_cp: () => handleImageDelete(api.deleteCoverPic, 'cover picture')
    }

    const action = actionMap[value]
    if (action) {
      await action()
    } else {
      showAlert('error', 'Something went wrong, please try again later')
    }
  }

  const handleImageUpdate = async updateApi => {
    const selectedImage = await pickImage()
    setLoading(true)
    if (selectedImage) {
      const response = await updateApi({ file: selectedImage })
      setLoading(false)
      handleResponse(response)
    } else {
      showAlert('error', 'Please try again')
    }
  }

  const handleImageDelete = async (deleteApi, type) => {
    showConfirm(`Are you sure you want to delete your ${type}?`, async () => {
      const response = await deleteApi()
      navigation.reset({ routes: [{ name: 'Profile' }] })
      if (!response.success) {
        showAlert('error', response.data.message)
      }
    })
  }

  const handleResponse = response => {
    if (response.status === 413) {
      showAlert(
        'error',
        'Upload failed. Please ensure the total size of your photos and videos does not exceed 20MB'
      )
    } else if (!response.success) {
      showAlert('error', response.data.message)
    }
  }

  if (!isAuthenticated || !user) {
    return <UnauthenticatedView />
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <UserScreen
        route={{ params: { user, showHeader: false } }}
        navigation={navigation}
      />
      <View style={styles.editButton}>
        <DropDownMenu
          options={options}
          hasIconButton={'edit'}
          onSelect={handleOptionSelect}
        />
      </View>
      <UsernameModal
        visible={isUsernameModalVisible}
        onClose={() => setIsUsernameModalVisible(false)}
      />
    </>
  )
}

const UsernameModal = ({ visible, onClose }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const showAlert = useAlertModal()
  const { user } = useContext(AuthContext)
  const [newUsername, setNewUsername] = useState(user.username)

  const editUsername = async () => {
    if (!newUsername) {
      showAlert('error', 'Field is empty')
      return
    }
    const response = await api.editProfile({
      username: newUsername.toLowerCase()
    })
    onClose()
    response.success
      ? showAlert('success', 'Username changed successfully')
      : showAlert('error', response.data.message)
  }

  return (
    <ModalScreen visible={visible} onClose={onClose}>
      <View style={styles.modalChildren}>
        <Text style={styles.title}>Change your username</Text>
        <Spacer />
        <TextInput
          style={styles.input}
          placeholder={user.username}
          placeholderTextColor={colors.text}
          value={newUsername}
          onChangeText={setNewUsername}
          multiline={false}
          autoFocus={visible}
        />
        <TouchableOpacity style={styles.button} onPress={editUsername}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <Text style={styles.textSmall}>Only available every 24 hours</Text>
      </View>
    </ModalScreen>
  )
}

export default ProfileScreen
