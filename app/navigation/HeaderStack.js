import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useNavigation, useTheme } from '@react-navigation/native'
import ButtonFollow from '@/components/ButtonFollow'
import useFormatResponse from '@/hooks/useFormatResponse'

const HeaderStack = ({
  title,
  user = null,
  onFollowToggle,
  hideFollowButton = false
}) => {
  const { colors } = useTheme()
  const styles = useGlobalStyles()
  const navigation = useNavigation()
  const { truncate } = useFormatResponse()

  return (
    <View style={styles.header}>
      <View style={[{ flex: 1 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.row}
        >
          <Icon
            name="keyboard-arrow-left"
            color={colors.primary}
            style={styles.icon}
          />
          <Text
            style={[styles.textBold, { paddingLeft: 5 }, { paddingBottom: 2 }]}
          >
            {title ? truncate(title, 20) : ''}
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
        {/* <TouchableOpacity onPress={() => console.log('Right icon pressed')}> */}
        {/* <Icon name="more-vert" color={colors.primary} style={styles.icon} />
        </TouchableOpacity> */}
      </View>
    </View>
  )
}

export default HeaderStack
