import React, { useState, useEffect } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'

const SendInputBar = ({ onSend, placeholder, isSending }) => {
  const [inputText, setInputText] = useState('')
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true)
      }
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
      }
    )

    // Cleanup listeners on unmount
    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText)
      setInputText('')
    }
  }

  return (
    <View
      style={[
        styles.sendBarInput,
        {
          marginBottom: Platform.OS === 'ios' && keyboardVisible ? 40 : 0
        }
      ]}
    >
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        style={styles.barInput}
        multiline={true}
      />
      <TouchableOpacity
        style={{ paddingLeft: 8 }}
        onPress={handleSend}
        disabled={isSending}
      >
        <Icon
          style={styles.icon}
          name="send"
          color={isSending ? colors.primaryTint : colors.primary}
        />
      </TouchableOpacity>
    </View>
  )
}

export default SendInputBar
