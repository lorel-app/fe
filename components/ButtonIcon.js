import React from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '@react-navigation/native'

const ButtonIcon = ({ onPress, iconName, iconSize, iconColor, style }) => {
  const { colors } = useTheme()
  const effectiveIconColor = iconColor || colors.secondaryTint
  const effectiveIconSize = iconSize || 24
  const effectiveStyle = [{ margin: 15 }, style]

  return (
    <TouchableOpacity style={effectiveStyle} onPress={onPress}>
      <Icon
        name={iconName}
        size={effectiveIconSize}
        color={effectiveIconColor}
        // android needs fontSize - doesn't work dynamically
        style={{ fontSize: 24 }}
      />
    </TouchableOpacity>
  )
}

export default ButtonIcon
