import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'

export function useMediaPicker() {
  const [image, setImage] = useState(null)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    })

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
      const response = await fetch(result.assets[0].uri)
      const blob = await response.blob()
      // To match Multer's file handling, you can create a File object with a specific name
      const file = new File([blob], 'profile-picture.jpg', {
        type: blob.type
      })
      setImage(file)
    }
  }

  return { image, pickImage }
}
