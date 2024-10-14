import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'

const SendInputBar = ({ onSend, placeholder }) => {
  const [inputText, setInputText] = useState('')
  const styles = useGlobalStyles()
  const { colors } = useTheme()

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText)
      setInputText('')
    }
  }

  return (
    <View style={styles.sendBarInput}>
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        style={styles.barInput}
        multiline={true}
      />
      <TouchableOpacity style={{ paddingLeft: 8 }} onPress={handleSend}>
        <Icon name="send" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  )
}

export default SendInputBar
