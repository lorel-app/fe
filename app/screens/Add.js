import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
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

  const { images, pickImages } = useMediaPicker()
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
    // TMP!
    throw new Error('Hello')
    const { type, media, title, price, caption, description, tags } = form
    if (media.length === 0) {
      showAlert('error', 'At least one image is mandatory for all posts')
      return
    }
    const pricePattern = /^[0-9]+(\.[0-9]{1,2})?$/
    if (price && !pricePattern.test(price)) {
      showAlert(
        'error',
        'Incorrect price format: Please use up to 2 decimal places and only one full stop'
      )
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
      if (response.status === 413) {
        showAlert(
          'error',
          'Upload failed. Please ensure the total size of your photos does not exceed 20MB'
        )
        return
      }
      if (response.status === 400) {
        showAlert(
          'error',
          'Invalid file type (videos will be supported in a feature release)'
        )
        return
      }
      if (response.success) {
        navigation.navigate('Profile')
      }
    } catch (error) {
      showAlert('error', 'Something went wrong, please try again later')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        <View style={[styles.rowSpan, { zIndex: 1 }]}>
          <Text style={[styles.title, { textAlign: 'left' }]}>
            What are you posting?
          </Text>
          <View style={{ marginLeft: 10 }}>
            <DropDownMenu
              options={options}
              selectedValue={selectedOption}
              onSelect={handleOptionSelect}
            />
          </View>
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
        </View>

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
                {me.preferences.currency}
              </Text>
              <TextInput
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
            style={[styles.inputLight, { height: captionHeight }]}
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
              style={[styles.inputLight, { height: descriptionHeight }]}
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
          <TouchableOpacity style={styles.buttonAbsolute} onPress={handlePost}>
            <Text style={styles.buttonText}>
              {selectedOption === 'SHOP' ? 'Add to Shop' : 'Add'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  )
}

export default AddScreen
