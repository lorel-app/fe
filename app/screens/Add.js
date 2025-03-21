import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState, useRef, useContext } from 'react'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import AuthContext from '@/utils/authContext'
import { useMediaPicker } from '@/hooks/useMediaPicker'
import api from '@/utils/api'
import { useAlertModal } from '@/hooks/useAlertModal'
import {
  useTheme,
  useNavigation,
  useFocusEffect
} from '@react-navigation/native'
import Spacer from '@/components/Spacer'
import ButtonIcon from '@/components/ButtonIcon'
import DropDownMenu from '@/components/DropDownMenu'
import SelectTags from '@/components/SelectTags'
import Loader from '@/components/Loader'

const AddScreen = () => {
  const styles = useGlobalStyles()
  const showAlert = useAlertModal()
  const { colors } = useTheme()
  const { user: me } = useContext(AuthContext)
  const navigation = useNavigation()

  const [selectedOption, setSelectedOption] = useState('CONTENT')
  const options = [
    { label: 'Content', value: 'CONTENT', icon: 'interests' },
    { label: 'Item for Sale', value: 'SHOP', icon: 'local-mall' }
  ]

  const { images, pickImages, clearImages } = useMediaPicker()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    type: selectedOption,
    media: [],
    title: '',
    price: '',
    caption: '',
    tags: [],
    description: ''
  })

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'web') {
        setForm(prevForm => ({
          ...prevForm,
          media: images.map(img => img.file)
        }))
      } else {
        setForm(prevForm => ({ ...prevForm, media: images.map(img => img) }))
      }
    }, [images])
  )

  const handleClearImages = () => {
    setForm(prevForm => ({
      ...prevForm,
      media: []
    }))
    clearImages()
  }

  const handleOptionSelect = value => {
    setSelectedOption(value)
    setForm(prevForm => ({ ...prevForm, type: value }))
  }

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

  let selectedTags = []

  const handleTagsChange = tags => {
    if (tags.length <= 6) {
      selectedTags = tags
      setForm(prevForm => ({ ...prevForm, tags }))
    } else {
      showAlert('error', 'You can only select up to 6 tags')
    }
  }

  const handlePost = async () => {
    const { type, media, title, price, caption, description, tags } = form
    const pricePattern = /^[0-9]+(\.[0-9]{1,2})?$/
    if (price && !pricePattern.test(price)) {
      showAlert(
        'error',
        'Incorrect price format: Please use up to 2 decimal places and only one full stop'
      )
      return
    }
    if (media.length === 0) {
      showAlert('error', 'At least one image is mandatory for all posts')
      return
    }
    setLoading(true)
    try {
      const response = await api.addPost({
        type,
        media,
        title,
        price: price.replace(/[^0-9.]/g, ''),
        caption,
        tags,
        description
      })

      switch (response.status) {
        case 400:
          showAlert(
            'error',
            'Invalid file type (videos will be supported in a future release)'
          )
          break
        case 413:
          showAlert(
            'error',
            'Upload failed. Please ensure the total size of your photos does not exceed 20MB'
          )
          break
        case 201:
          navigation.reset({
            index: 0,
            routes: [{ name: 'Profile' }]
          })
          break
        default:
          showAlert('error', 'Something went wrong, please try again later')
          break
      }
    } catch (error) {
      showAlert('error', 'Something went wrong, please try again later')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <ScrollView
        testID="add_screen"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        // nestedScrollEnabled={true}
      >
        <View style={[styles.rowSpan, { zIndex: 1 }]}>
          <Text style={[styles.title, { textAlign: 'left' }]}>
            What are you{'\n'}posting today?
          </Text>
          <View style={{ marginLeft: 10 }} testID="post_dropdown">
            <DropDownMenu
              options={options}
              selectedValue={selectedOption}
              onSelect={handleOptionSelect}
            />
          </View>
        </View>
        <>
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
            horizontal
            nestedScrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[{ flexDirection: 'row' }, { flexGrow: 1 }]}
          >
            {images.map(image => (
              <View key={image.uri} style={styles.imageGrid}>
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
              <Text style={styles.textLight}>(Max 5)</Text>
            </View>
            <Spacer />
          </ScrollView>
          <TouchableOpacity
            onPress={handleClearImages}
            style={{ paddingBottom: 20 }}
          >
            <Text style={styles.link}>clear images</Text>
          </TouchableOpacity>
        </>

        <View
          style={[styles.container, { maxWidth: 500 }, { alignSelf: 'center' }]}
        >
          {selectedOption === 'SHOP' ? (
            <TextInput
              style={styles.inputLight}
              placeholder="Title"
              placeholderTextColor={colors.text}
              value={form.title}
              onChangeText={text => handleChange('title', text)}
              maxLength={50}
              autoCapitalize="words"
            />
          ) : null}
          {selectedOption === 'SHOP' ? (
            <View style={[styles.rowSpan, { padding: 0 }]}>
              <Text style={[styles.textAccent, { marginRight: 10 }]}>
                {me?.preferences?.currency || 'EUR'}
              </Text>
              <TextInput
                testID="price_input"
                style={styles.inputLight}
                placeholder="00.00"
                placeholderTextColor={colors.text}
                value={form.price.replace(/[^0-9.]/g, '')}
                onChangeText={text => handleChange('price', text)}
                keyboardType="numeric"
                maxLength={50}
              />
            </View>
          ) : null}
          <TextInput
            testID="caption_input"
            style={[
              styles.inputLight,
              { height: captionHeight },
              { minHeight: 50 }
            ]}
            placeholder="Caption"
            placeholderTextColor={colors.text}
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
              style={[
                styles.inputLight,
                { height: descriptionHeight },
                { minHeight: 50 }
              ]}
              placeholder="Description"
              placeholderTextColor={colors.text}
              value={form.description}
              onChangeText={text => handleChange('description', text)}
              onContentSizeChange={event =>
                onDescriptionContentSizeChange(event.nativeEvent.contentSize)
              }
              multiline={true}
              maxLength={1000}
            />
          ) : null}
          <View style={[styles.row, { padding: 10 }, { marginBottom: 10 }]}>
            <Text style={styles.text}>Add tags to your post</Text>
            <Text style={styles.textLight}>(Max 6)</Text>
          </View>
          <SelectTags onTagsChange={handleTagsChange} />
          <Spacer />
          <Spacer />
        </View>
      </ScrollView>

      <View>
        {loading ? (
          <Loader />
        ) : (
          <TouchableOpacity
            testID="add_button"
            style={styles.buttonAbsolute}
            onPress={handlePost}
          >
            <Text style={styles.buttonText}>
              {selectedOption === 'SHOP' ? 'Add to Shop' : 'Add'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

export default AddScreen
