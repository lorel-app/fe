import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useNavigation, useTheme } from '@react-navigation/native'
import ButtonFollow from '@/components/ButtonFollow'

const HeaderStack = ({
  title,
  user,
  onFollowToggle,
  hideFollowButton = false
}) => {
  const { colors } = useTheme()
  const styles = useGlobalStyles()
  const navigation = useNavigation()

  return (
    <View style={styles.header}>
      <View style={[{ flex: 1 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.row}
        >
          <Icon name="keyboard-arrow-left" size={30} color={colors.primary} />
          <Text
            style={[styles.textBold, { paddingLeft: 5 }, { paddingBottom: 2 }]}
          >
            {title ? title : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerItems}>
        {!hideFollowButton &&
          (onFollowToggle ? (
            <ButtonFollow user={user} onFollowToggle={onFollowToggle} />
          ) : (
            <ButtonFollow user={user} />
          ))}
        <TouchableOpacity onPress={() => console.log('Right icon pressed')}>
          <Icon name="more-vert" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HeaderStack
