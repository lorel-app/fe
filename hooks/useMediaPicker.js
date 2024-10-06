import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'

export function useMediaPicker() {
  const [images, setImages] = useState([])

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      //I DONT KNOW THE LIMIT
      selectionLimit: 10
    })

    if (!result.canceled) {
      const newImages = await Promise.all(
        result.assets.map(async asset => {
          const response = await fetch(asset.uri)
          const blob = await response.blob()

          return {
            uri: asset.uri,
            type: blob.type || asset.type,
            name: asset.uri.split('/').pop() || 'image.jpg'
          }
        })
      )
      setImages(prevImages => [...prevImages, ...newImages])
    }
  }

  return { images, pickImages }
}
