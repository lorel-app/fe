import { View, TouchableOpacity, Text, TextInput, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState, useRef, useContext } from 'react'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import AuthContext from '@/utils/authContext'
import { useMediaPicker } from '@/hooks/useMediaPicker'
import api from '@/utils/api'
import { useAlertModal } from '@/hooks/useAlertModal'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import UnauthenticatedView from '@/components/UnauthenticatedView'
import Spacer from '@/components/Spacer'
import ButtonIcon from '@/components/ButtonIcon'
import DropDownMenu from '@/components/DropDownMenu'

const AddScreen = () => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const showAlert = useAlertModal()
  const { isAuthenticated, user, loadUser } = useContext(AuthContext)
  const navigation = useNavigation()

  const [selectedOption, setSelectedOption] = useState('CONTENT')
  const options = [
    { label: 'Content', value: 'CONTENT' },
    { label: 'Item for Sale', value: 'SHOP' }
  ]

  const { images, pickImages } = useMediaPicker()

  const [form, setForm] = useState({
    type: selectedOption,
    media: [],
    title: '',
    price: '',
    caption: '',
    tags: '',
    description: ''
  })

  useFocusEffect(
    React.useCallback(() => {
      setForm({
        type: selectedOption,
        media: [],
        title: '',
        price: '',
        caption: '',
        tags: '',
        description: ''
      })
    }, [selectedOption])
  )

  useFocusEffect(
    React.useCallback(() => {
      setForm(prevForm => ({ ...prevForm, media: images.map(img => img.file) })) // Update with selected images
    }, [images])
  )

  const handleChange = (key, value) => {
    setForm(prevForm => ({ ...prevForm, [key]: value }))
  }

  const scrollViewRef = useRef()

  const [captionHeight, setCaptionHeight] = useState(65)
  const [descriptionHeight, setDescriptionHeight] = useState(95)

  const onContentSizeChange = contentSize => {
    setCaptionHeight(Math.min(contentSize.height, 500))
  }
  const onDescriptionContentSizeChange = contentSize => {
    setDescriptionHeight(Math.min(contentSize.height, 1000))
  }

  const handlePost = async () => {
    const { type, media, title, price, caption, tags, description } = form
    if (media.length === 0 || !caption) {
      showAlert(
        'error',
        'At least one image/video and a caption are mandatory for all posts.'
      )
      return
    }
    try {
      const response = await api.addPost({
        type,
        media,
        title,
        price,
        caption,
        tags,
        description
      })
      response.status === 400
        ? showAlert('error', response.data.message)
        : response.success
          ? (showAlert('success', response.data.message),
            navigation.navigate('Home'))
          : showAlert('error', 'Something went wrong, please try again later.')
    } catch {
      showAlert('error', 'Something went wrong, please try again later.')
    }
  }

  return isAuthenticated ? (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        <View style={[styles.rowSpan, { zIndex: 1 }]}>
          <Text style={styles.title}>What are you posting?</Text>
          <DropDownMenu
            options={options}
            selectedValue={selectedOption}
            onSelect={setSelectedOption}
          />
        </View>
        <View style={{ height: 280 }}>
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.containerLeft, { padding: 0 }]}
          >
            {images.map((image, index) => (
              <View
                key={index}
                style={[styles.gridPost, { backgroundColor: colors.card }]}
              >
                <Image
                  source={{ uri: image.uri }}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
            ))}
            <View style={[styles.gridPost, { backgroundColor: colors.card }]}>
              <Image
                source={{
                  uri: 'https://images.ctfassets.net/ub3bwfd53mwy/5zi8myLobtihb1cWl3tj8L/45a40e66765f26beddf7eeee29f74723/6_Image.jpg'
                }}
                resizeMode="contain"
                style={styles.image}
                value="media"
              />
            </View>
            <View style={[styles.gridPost, { backgroundColor: colors.card }]}>
              <ButtonIcon
                iconName="add-photo-alternate"
                iconSize={80}
                onPress={pickImages}
              />
            </View>
            <Spacer />
          </ScrollView>
        </View>

        <View style={styles.container}>
          {selectedOption === 'SHOP' ? (
            <TextInput
              style={styles.inputLight}
              placeholder="Title"
              value={form.title}
              onChangeText={text => handleChange('title', text)}
              maxLength={55}
              autoCapitalize="words"
            />
          ) : null}
          {selectedOption === 'SHOP' ? (
            <TextInput
              style={styles.inputLight}
              placeholder="Currency, Price"
              value={form.price}
              onChangeText={text => handleChange('price', text)}
              keyboardType="numeric"
              maxLength={55}
            />
          ) : null}
          <TextInput
            style={[styles.inputLight, { height: captionHeight }]}
            placeholder="*Caption"
            value={form.caption}
            onChangeText={text => handleChange('caption', text)}
            onContentSizeChange={event =>
              onContentSizeChange(event.nativeEvent.contentSize)
            }
            multiline={true}
            maxLength={255}
          />
          {selectedOption === 'SHOP' ? (
            <TextInput
              style={[styles.inputLight, { height: descriptionHeight }]}
              placeholder="Description"
              value={form.description}
              onChangeText={text => handleChange('description', text)}
              onContentSizeChange={event =>
                onDescriptionContentSizeChange(event.nativeEvent.contentSize)
              }
              multiline={true}
              maxLength={1000}
            />
          ) : null}
          <Text style={styles.inputLight}>Tag selection placeholder</Text>
          <Spacer />
          <Spacer />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.buttonAbsolute} onPress={handlePost}>
        <Text style={styles.buttonText}>
          {selectedOption === 'SHOP' ? 'Add to Shop' : 'Add'}
        </Text>
      </TouchableOpacity>
    </>
  ) : (
    <UnauthenticatedView />
  )
}

export default AddScreen
