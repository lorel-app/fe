import React from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'

const Loader = () => {
  const { colors } = useTheme()
  const styles = useGlobalStyles()
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  )
}
export default Loader
