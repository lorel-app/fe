import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  ActivityIndicator
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState, useRef, useContext } from 'react'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
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
  const showAlert = useAlertModal()
  const { isAuthenticated } = useContext(AuthContext)
  const navigation = useNavigation()

  const [selectedOption, setSelectedOption] = useState('CONTENT')
  const options = [
    { label: 'Content', value: 'CONTENT' },
    { label: 'Item for Sale', value: 'SHOP' }
  ]

  const { images, pickImages } = useMediaPicker()
  const [loading, setLoading] = useState(false)

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
      setForm(prevForm => ({ ...prevForm, media: images.map(img => img.file) }))
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
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  return isAuthenticated ? (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        <View style={[styles.rowSpan, { zIndex: 1 }]}>
          <Text style={[styles.title, { textAlign: 'left' }]}>
            What are you posting?
          </Text>
          <DropDownMenu
            options={options}
            selectedValue={selectedOption}
            onSelect={setSelectedOption}
          />
        </View>
        <View style={{}}>
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
              <View key={index} style={styles.imageGrid}>
                <Image
                  source={{ uri: image.uri }}
                  resizeMode="contain"
                  style={styles.imageFit}
                />
              </View>
            ))}
            <View style={styles.imageGrid}>
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
            <View style={[styles.rowSpan, { padding: 0 }]}>
              <Text style={[styles.textAccent, { marginRight: 10 }]}>EUR</Text>
              <TextInput
                style={styles.inputLight}
                placeholder="00.00"
                value={form.price}
                onChangeText={text => handleChange('price', text)}
                keyboardType="numeric"
                maxLength={55}
              />
            </View>
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

      <View>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#E88570"
            style={styles.containerFull}
          />
        ) : (
          <TouchableOpacity style={styles.buttonAbsolute} onPress={handlePost}>
            <Text style={styles.buttonText}>
              {selectedOption === 'SHOP' ? 'Add to Shop' : 'Add'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  ) : (
    <UnauthenticatedView />
  )
}

export default AddScreen
