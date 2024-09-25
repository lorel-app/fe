import React from 'react'
import { useTheme } from '@react-navigation/native'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons' // Import MaterialIcons
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useNavigation } from '@react-navigation/native'

const HeaderStack = ({ title }) => {
  const { colors } = useTheme()
  const globalStyles = useGlobalStyles()
  const navigation = useNavigation()

  return (
    <View style={globalStyles.header}>
      <View style={globalStyles.headerItems}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="keyboard-arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.text,
            marginLeft: 10,
            fontSize: 18,
            fontWeight: 'bold'
          }}
        >
          {title ? title : 'Go Back'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => console.log('Right icon pressed')}>
        <Icon name="more-vert" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  )
}

export default HeaderStack
