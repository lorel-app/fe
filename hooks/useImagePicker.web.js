import * as ImagePicker from 'expo-image-picker'

export function useImagePicker() {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    })

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri)
      const blob = await response.blob()
      const file = new File([blob], 'display-or-cover.jpg', {
        type: blob.type
      })
      return file
    }
    return null
  }
  return { pickImage }
}
