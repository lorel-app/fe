import React from 'react'
import { useTheme } from '@react-navigation/native'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons' // Import MaterialIcons
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useNavigation } from '@react-navigation/native'
import ButtonFollow from '@/components/ButtonFollow'

const HeaderStack = ({ title, user }) => {
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
            style={[styles.title, { paddingLeft: 10 }, { paddingBottom: 5 }]}
          >
            {title ? title : 'Go Back'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerItems}>
        <ButtonFollow user={user} />
        <TouchableOpacity onPress={() => console.log('Right icon pressed')}>
          <Icon name="more-vert" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HeaderStack
