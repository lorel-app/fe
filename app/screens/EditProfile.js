import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, TextInput } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme, useNavigation } from '@react-navigation/native'
import api from '@/utils/api'
import HeaderStack from '../navigation/HeaderStack'
import { useAlertModal } from '@/hooks/useAlertModal'

const EditProfileScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const showAlert = useAlertModal()
  const navigation = useNavigation()
  const { user = {}, showHeader = true } = route.params || {}

  const [myInfo, setMyInfo] = useState({})
  const [generalInfo, setGeneralInfo] = useState({
    bio: '',
    location: '',
    occupation: ''
  })

  const [inputHeight, setInputHeight] = useState(0)

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const response = await api.getUser(user.id)
        if (response.success) {
          setMyInfo(response.data.user)
        } else {
          showAlert('error', `${response.data.message}: Please try again later`)
        }
      } catch (err) {
        console.log('Error fetching user data:', err.message)
      }
    }
    fetchMyInfo()
  }, [user.id])

  useEffect(() => {
    if (myInfo) {
      setGeneralInfo({
        bio: myInfo.bio || '',
        location: myInfo.location || '',
        occupation: myInfo.occupation || ''
      })
    }
  }, [myInfo])

  const handleGeneralChange = (field, value) => {
    setGeneralInfo({
      ...generalInfo,
      [field]: value
    })
  }

  const handleSubmitChanges = async () => {
    const response = await api.editProfile(generalInfo)
    if (response.success) {
      navigation.reset({
        routes: [{ name: 'Profile' }]
      })
      navigation.goBack()
    } else {
      showAlert('error', response.data.message)
    }
  }

  return (
    <>
      {showHeader && <HeaderStack title={'Edit your profile'} user={user} />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>General</Text>
        <View style={styles.card}>
          <View style={styles.rowSpan}>
            <View style={styles.row}>
              <Icon name={'notes'} size={18} color={colors.primary} />
              <Text style={[styles.textBold, { paddingLeft: 5 }]}>Bio</Text>
            </View>
            <Text style={styles.textLight}>(Max 255)</Text>
          </View>
          <TextInput
            style={[
              styles.input,
              { height: Math.max(40, inputHeight), minHeight: 40 }
            ]}
            multiline={true}
            maxLength={255}
            value={generalInfo.bio}
            onChangeText={value => handleGeneralChange('bio', value)}
            onContentSizeChange={event => {
              setInputHeight(event.nativeEvent.contentSize.height)
            }}
          />
          <View style={[styles.row, { padding: 10 }]}>
            <Icon name={'hail'} size={18} color={colors.primary} />
            <Text style={[styles.textBold, { paddingLeft: 5 }]}>Location</Text>
          </View>
          <TextInput
            style={styles.input}
            // double check
            maxLength={50}
            value={generalInfo.location}
            onChangeText={value => handleGeneralChange('location', value)}
          />
          <View style={[styles.row, { padding: 10 }]}>
            <Icon name={'place'} size={18} color={colors.primary} />
            <Text style={[styles.textBold, { paddingLeft: 5 }]}>
              Occupation
            </Text>
          </View>
          <TextInput
            style={styles.input}
            // double check
            maxLength={50}
            value={generalInfo.occupation}
            onChangeText={value => handleGeneralChange('occupation', value)}
          />
        </View>
        <View style={styles.divider}></View>
      </ScrollView>
      <TouchableOpacity
        style={styles.buttonAbsolute}
        onPress={handleSubmitChanges}
      >
        <Text style={styles.buttonText}>save changes</Text>
      </TouchableOpacity>
    </>
  )
}

export default EditProfileScreen
