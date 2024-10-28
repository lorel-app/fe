import React, { useState, useContext } from 'react'
import { View, Text, FlatList } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'

const AboutScreen = () => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()

  return (
    <View style={[styles.containerFull, { backgroundColor: colors.primary }]}>
      <Text style={styles.title}>ABOUT LOREL</Text>
    </View>
  )
}

export default AboutScreen
