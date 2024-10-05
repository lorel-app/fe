import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'

export function useImagePicker() {
  const [image, setImage] = useState(null)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    })

    if (!result.canceled) {
      const { uri, type } = result.assets[0]
      const response = await fetch(uri)
      const blob = await response.blob()

      // To match Multer's file handling, create a File object
      const file = {
        uri,
        type: blob.type || type,
        name: 'profile-picture.jpg'
      }

      setImage(file)
    }
  }

  return { image, pickImage }
}
