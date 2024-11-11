import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, TextInput } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme, useNavigation } from '@react-navigation/native'
import api from '@/utils/api'
import HeaderStack from '../navigation/HeaderStack'
import { useAlertModal } from '@/hooks/useAlertModal'
import getAllSocialIcons from '@/assets/images/SocialIcons'
import ButtonIcon from '@/components/ButtonIcon'

const EditProfileScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const showAlert = useAlertModal()
  const navigation = useNavigation()
  const { user = {}, showHeader = true } = route.params || {}

  const socialIcons = getAllSocialIcons(28, 28)

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

  const [selectedNewLink, setSelectedNewLink] = useState(null)
  const [newLinkValue, setNewLinkValue] = useState('')

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

  const socialLinkTypes = [
    'Instagram',
    'Facebook',
    'LinkedIn',
    'Behance',
    'TikTok',
    'Youtube',
    'Twitch',
    'X',
    'Pinterest',
    'Reddit'
  ]
  const availableLinks = socialLinkTypes.filter(
    type => !linkInfo.some(link => link.type === type)
  )

  const handleLinkAdd = (newLinkValue, selectedNewLink) => {
    let updatedLinks = [...linkInfo]
    const existingLinkIndex = linkInfo.findIndex(
      link => link.type === selectedNewLink
    )
    if (existingLinkIndex !== -1) {
      updatedLinks[existingLinkIndex].value = newLinkValue
    } else {
      const newLink = { type: selectedNewLink, value: newLinkValue }
      updatedLinks = [...updatedLinks, newLink]
    }
    setLinkInfo(updatedLinks)
    const existingPatch = linksToPatch.find(
      link => link.type === selectedNewLink
    )
    if (existingPatch) {
      setLinksToPatch(prevLinks =>
        prevLinks.map(link =>
          link.type === selectedNewLink
            ? { ...link, value: newLinkValue }
            : link
        )
      )
    } else {
      setLinksToPatch(prevLinks => [
        ...prevLinks,
        { type: selectedNewLink, value: newLinkValue }
      ])
    }
  }

  const handleLinkPatch = (value, identifier) => {
    let updatedLinks = [...linkInfo]
    let linkType

    if (identifier === 'PERSONAL') {
      const personalLinkIndex = linkInfo.findIndex(
        link => link.type === 'PERSONAL'
      )
      if (personalLinkIndex !== -1) {
        updatedLinks[personalLinkIndex].value = value
      } else {
        const newLink = { type: 'PERSONAL', value: value }
        updatedLinks = [...updatedLinks, newLink]
      }
      linkType = 'PERSONAL'
    } else if (typeof identifier === 'number') {
      updatedLinks[identifier].value = value
      linkType = updatedLinks[identifier].type
    }

    setLinkInfo(updatedLinks)
    const existingPatch = linksToPatch.find(link => link.type === linkType)
    if (existingPatch) {
      setLinksToPatch(prevLinks =>
        prevLinks.map(link =>
          link.type === linkType ? { ...link, value: value } : link
        )
      )
    } else {
      setLinksToPatch(prevLinks => [...prevLinks, { type: linkType, value }])
    }
  }

  const handleLinkDelete = identifier => {
    let index
    if (identifier === 'PERSONAL') {
      index = linkInfo.findIndex(link => link.type === 'PERSONAL')
    } else {
      index = identifier
    }

    if (index === -1) return
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
      }

      if (linksToPatch.length > 0) {
        for (const link of linksToPatch) {
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
        nestedScrollEnabled={true}
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

        <Text style={styles.title}>Personal Link</Text>
        <View
          style={[
            styles.row,
            { marginHorizontal: 10 },
            { alignSelf: 'center' }
          ]}
        >
          <Icon style={styles.icon} name={'link'} color={colors.secondary} />
          <TextInput
            style={styles.inputLight}
            value={
              linkInfo.find(link => link.type === 'PERSONAL')?.value ||
              'https://www.'
            }
            onChangeText={text => handleLinkPatch(text, 'PERSONAL')}
          />
          <ButtonIcon
            iconName="remove"
            iconColor={colors.accent}
            onPress={() => handleLinkDelete('PERSONAL')}
          />
        </View>
        <View style={styles.divider}></View>

        <Text style={styles.title}>Social Links</Text>
        {availableLinks.length > 0 ? (
          <>
            <Text style={[styles.textBold, { padding: 10 }]}>
              Select one to add
            </Text>
            <View
              style={[
                styles.rowWrap,
                { marginHorizontal: 20 },
                { alignItems: 'center' }
              ]}
            >
              {availableLinks.map((link, indexNew) => {
                const iconName = link.toLowerCase()

                return (
                  <TouchableOpacity
                    style={[styles.buttonSmall, styles.row]}
                    key={indexNew}
                    onPress={() => {
                      setSelectedNewLink(link)
                      setNewLinkValue('')
                    }}
                  >
                    {socialIcons[iconName]}
                    <Text style={[styles.textBold, { paddingHorizontal: 5 }]}>
                      {link}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
            <View
              style={[
                styles.row,
                { marginHorizontal: 10 },
                { alignSelf: 'center' }
              ]}
            >
              {selectedNewLink !== null ? (
                <View style={{ padding: 5 }}>
                  {socialIcons[selectedNewLink.toLowerCase()]}
                </View>
              ) : (
                <Icon
                  style={[styles.icon, { padding: 4 }]}
                  name={'check-box-outline-blank'}
                  color={colors.secondary}
                />
              )}

              <TextInput
                style={styles.inputLight}
                placeholder={
                  selectedNewLink !== null
                    ? `${selectedNewLink} username`
                    : 'select a social'
                }
                value={newLinkValue}
                onChangeText={setNewLinkValue}
              />
              <ButtonIcon
                iconName="add"
                iconColor={colors.primary}
                onPress={() => {
                  if (selectedNewLink !== null) {
                    handleLinkAdd(newLinkValue, selectedNewLink)
                    setNewLinkValue('')
                    setSelectedNewLink(null)
                  }
                }}
              />
            </View>
          </>
        ) : (
          <View style={{ padding: 5 }}>
            <Text style={styles.textCenter}>
              You have a link set to all available socials
            </Text>
          </View>
        )}

        {linkInfo &&
        linkInfo.filter(link => link.type.toLowerCase() !== 'personal').length >
          0
          ? linkInfo
              .filter(link => link.type.toLowerCase() !== 'personal')
              .map((link, index) => {
                const iconName = link.type.toLowerCase()
                return (
                  <View
                    key={index}
                    style={[
                      styles.row,
                      { marginHorizontal: 10 },
                      { alignSelf: 'center' }
                    ]}
                  >
                    <View
                      style={[
                        { margin: 8 },
                        { backgroundColor: colors.primaryTint },
                        { borderRadius: 50 }
                      ]}
                    >
                      {socialIcons[iconName]}
                    </View>

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
                )
              })
          : null}

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
