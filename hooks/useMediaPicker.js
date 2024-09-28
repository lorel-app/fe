import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'

export function useMediaPicker() {
  const [images, setImages] = useState([])

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: true
    })

    if (!result.canceled) {
      const newImages = await Promise.all(
        result.assets.map(async asset => {
          const response = await fetch(asset.uri)
          const blob = await response.blob()
          const file = new File([blob], 'image.jpg', { type: blob.type })
          return { uri: asset.uri, file } // Keep both uri and file
        })
      )
      setImages(newImages)
    }
  }

  return { images, pickImages }
}
