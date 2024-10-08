import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import ButtonIcon from '@/components/ButtonIcon'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import api from '@/utils/api'
import SelectTags from '@/components/SelectTags'

const SearchScreen = () => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()

  let selectedTags = []
  const handleTagsChange = tags => {
    selectedTags = tags
  }
  return (
    <View style={styles.containerSticky}>
      <SelectTags onTagsChange={handleTagsChange} />
    </View>
  )
}

export default SearchScreen
