import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, TextInput } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme, useNavigation } from '@react-navigation/native'
import api from '@/utils/api'
import HeaderStack from '../navigation/HeaderStack'
import { useAlertModal } from '@/hooks/useAlertModal'
import SocialIcon from '@/assets/images/SocialIcons'
import ButtonIcon from '@/components/ButtonIcon'

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
  const [generalInfoChanged, setGeneralInfoChanged] = useState(false)
  const [linkInfo, setLinkInfo] = useState([])
  const [linksToPatch, setLinksToPatch] = useState([])
  const [linksToDelete, setLinksToDelete] = useState([])

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

  useEffect(() => {
    if (myInfo) {
      const links = myInfo.links || []
      const updatedLinks = links.map(link => {
        const urlParts = link.url.split('/')
        const value = urlParts[urlParts.length - 1]
        return {
          type: link.type,
          value: value
        }
      })
      setLinkInfo(updatedLinks)
    }
  }, [myInfo])

  const handleGeneralChange = (field, value) => {
    setGeneralInfo({
      ...generalInfo,
      [field]: value
    })
    setGeneralInfoChanged(true)
  }

  const handleLinkPatch = (value, index) => {
    const updatedLinks = [...linkInfo]
    updatedLinks[index].value = value
    setLinkInfo(updatedLinks)

    const existingPatch = linksToPatch.find(
      link => link.type === updatedLinks[index].type
    )
    if (existingPatch) {
      setLinksToPatch(prevLinks =>
        prevLinks.map(link =>
          link.type === updatedLinks[index].type ? updatedLinks[index] : link
        )
      )
    } else {
      setLinksToPatch(prevLinks => [...prevLinks, updatedLinks[index]])
    }
    console.log(linksToPatch, '-links to patch')
  }

  const handleLinkDelete = index => {
    const linksToDelete = linkInfo[index]
    setLinksToDelete(prevLinks => [...prevLinks, linksToDelete])

    const updatedLinks = linkInfo.filter((_, i) => i !== index)
    setLinkInfo(updatedLinks)
  }

  const handleSubmitChanges = async () => {
    try {
      if (generalInfoChanged) {
        const response = await api.editProfile(generalInfo)
        if (!response.success) throw new Error(response.data.message)
        console.log(response)
      }

      if (linksToPatch.length > 0) {
        for (const link of linksToPatch) {
          console.log(link, '-link')
          const response = await api.addProfileLink({
            type: link.type,
            value: link.value
          })
          if (!response.success) throw new Error(response.data.message)
        }
      }

      if (linksToDelete.length > 0) {
        for (const link of linksToDelete) {
          const response = await api.deleteProfileLink({ type: link.type })
          if (!response.success) throw new Error(response.data.message)
        }
      }

      navigation.reset({ routes: [{ name: 'Profile' }] })
      navigation.goBack()
    } catch (error) {
      showAlert('error', error.message)
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
              <Icon
                name={'notes'}
                style={styles.icon}
                color={colors.secondary}
              />
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
            <Icon name={'hail'} style={styles.icon} color={colors.secondary} />
            <Text style={[styles.textBold, { paddingLeft: 5 }]}>Location</Text>
          </View>
          <TextInput
            style={styles.input}
            maxLength={50}
            value={generalInfo.location}
            onChangeText={value => handleGeneralChange('location', value)}
          />
          <View style={[styles.row, { padding: 10 }]}>
            <Icon name={'place'} style={styles.icon} color={colors.secondary} />
            <Text style={[styles.textBold, { paddingLeft: 5 }]}>
              Occupation
            </Text>
          </View>
          <TextInput
            style={styles.input}
            maxLength={50}
            value={generalInfo.occupation}
            onChangeText={value => handleGeneralChange('occupation', value)}
          />
        </View>

        <View style={styles.divider}></View>

        <Text style={styles.title}>Links</Text>

        <View>
          {linkInfo && linkInfo.length > 0
            ? linkInfo.map((link, index) => (
                <View style={styles.row} key={index}>
                  {link.type.toLowerCase() === 'personal' ? (
                    <Icon
                      style={styles.icon}
                      name={'link'}
                      color={colors.secondary}
                    />
                  ) : (
                    <View>
                      <SocialIcon
                        icon={link.type.toLowerCase()}
                        key={`${index}-editscreen`}
                      />
                    </View>
                  )}
                  <TextInput
                    style={styles.inputLight}
                    value={link.value}
                    onChangeText={text => handleLinkPatch(text, index)}
                  />
                  <ButtonIcon
                    iconName="remove"
                    iconColor={colors.accent}
                    onPress={() => handleLinkDelete(index)}
                  />
                </View>
              ))
            : null}
        </View>
        <View>{/* ADD add link input */}</View>
        <View style={[styles.divider, { marginBottom: 80 }]}></View>
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
