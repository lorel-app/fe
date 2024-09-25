import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import ButtonIcon from '@/components/ButtonIcon'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import api from '@/utils/api'

const SearchScreen = () => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.allTags()
        if (response.success) {
          setTags(response.data.tags)
        }
      } catch (error) {
        console.error('Failed to fetch posts', error)
      }
    }
    fetchTags()
  }, [])

  const mediumTags = tags.filter(tag => tag.type === 'MEDIUM')
  const subjectTags = tags.filter(tag => tag.type === 'SUBJECT')
  const styleTags = tags.filter(tag => tag.type === 'STYLE')

  const renderTagButtons = tagArray => {
    return tagArray.map(tag => (
      <TouchableOpacity
        key={tag.id}
        style={[
          styles.buttonSmall,
          selectedTags.includes(tag.name) && styles.buttonSmallSelected
        ]}
        onPress={() => handleTagSelect(tag)}
      >
        <Text
          style={{
            color: (() => {
              switch (tag.type) {
                case 'SUBJECT':
                  return colors.tertiary
                case 'MEDIUM':
                  return colors.primary
                case 'STYLE':
                  return colors.secondary
                default:
                  return colors.text
              }
            })()
          }}
        >
          {tag.name}
        </Text>
      </TouchableOpacity>
    ))
  }

  const handleTagSelect = tag => {
    setSelectedTags(prevSelectedTags =>
      prevSelectedTags.includes(tag.name)
        ? prevSelectedTags.filter(t => t !== tag.name)
        : [...prevSelectedTags, tag.name]
    )
  }

  const toggleExpanded = () => setIsExpanded(!isExpanded)
  const clearSelectedTags = () => setSelectedTags([])

  return (
    <>
      <View style={styles.containerSticky}>
        <View style={styles.inputWithIcon}>
          <TextInput
            style={styles.inputLight}
            placeholder="Search (coming soon)"
          ></TextInput>
          <ButtonIcon onPress={toggleExpanded} iconName="search" />
        </View>
        <TouchableOpacity onPress={toggleExpanded} style={styles.inputWithIcon}>
          <Text style={styles.text}>Select Tags</Text>
          <ButtonIcon
            onPress={toggleExpanded}
            iconName={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            iconSize={18}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.containerLeft}>
            <Text style={styles.text}>Subject Matter</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.rowScroll}>
                {renderTagButtons(subjectTags)}
              </View>
            </ScrollView>
            <Text style={styles.text}>Mediums</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.rowScroll}>
                {renderTagButtons(mediumTags)}
              </View>
            </ScrollView>
            <Text style={styles.text}>Styles</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.rowScroll}>
                {renderTagButtons(styleTags)}
              </View>
            </ScrollView>
            <TouchableOpacity onPress={clearSelectedTags}>
              <Text style={styles.link}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.selectedTagsText}>
            {selectedTags.length > 0
              ? `You selected: ${selectedTags.join(', ')}`
              : 'No tags selected'}
          </Text>
        </View>
      </ScrollView>
    </>
  )
}

export default SearchScreen
