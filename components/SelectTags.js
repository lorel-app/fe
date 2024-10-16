import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import ButtonIcon from '@/components/ButtonIcon'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import api from '@/utils/api'

const SelectTags = ({ onTagsChange }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('ALL')

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.allTags()
        if (response.success) {
          setTags(response.data.tags)
        }
      } catch (error) {
        console.error('Failed to fetch tags', error)
      }
    }
    fetchTags()
  }, [])

  const filterTypes = ['ALL', 'SUBJECT', 'MEDIUM', 'STYLE']

  const getTagsToRender = () => {
    if (selectedFilter === 'ALL') return tags
    return tags.filter(tag => tag.type === selectedFilter)
  }

  const getTagColor = type => {
    switch (type) {
      case 'SUBJECT':
        return colors.tertiary
      case 'MEDIUM':
        return colors.primary
      case 'STYLE':
        return colors.secondary
      default:
        return colors.text
    }
  }

  const renderTagButtons = tagArray => {
    return tagArray.map(tag => (
      <TouchableOpacity
        key={tag.id}
        style={[
          styles.buttonSmall,
          selectedTags.includes(tag.id) && styles.buttonSmallSelected
        ]}
        onPress={() => handleTagSelect(tag)}
      >
        <Text style={{ color: getTagColor(tag.type) }}>{tag.name}</Text>
      </TouchableOpacity>
    ))
  }

  const handleTagSelect = tag => {
    const updatedTags = selectedTags.includes(tag.id)
      ? selectedTags.filter(t => t !== tag.id)
      : [...selectedTags, tag.id]

    setSelectedTags(updatedTags)
    onTagsChange(updatedTags)
  }

  const toggleExpanded = () => setIsExpanded(!isExpanded)
  const clearSelectedTags = () => setSelectedTags([])

  const renderSelectedTagButtons = () => {
    return selectedTags.map(selectedTagId => {
      const tag = tags.find(t => t.id === selectedTagId)
      if (!tag) return null

      return (
        <TouchableOpacity
          key={selectedTagId}
          style={[styles.buttonSmall, styles.buttonSmallSelected]}
          onPress={() => handleTagSelect(tag)}
        >
          <Text style={{ color: getTagColor(tag.type) }}>{tag.name}</Text>
        </TouchableOpacity>
      )
    })
  }

  return (
    <>
      <View style={styles.rowWrap}>
        {selectedTags.length > 0 ? (
          renderSelectedTagButtons()
        ) : (
          <Text style={[styles.buttonSmallSelected, styles.text]}>
            No tags selected
          </Text>
        )}
        {selectedTags.length > 0 && (
          <TouchableOpacity
            style={styles.buttonSmall}
            onPress={clearSelectedTags}
          >
            <Text style={styles.text}>CLEAR</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={toggleExpanded} style={styles.rowSpan}>
        <Text style={styles.link}>Show all tags</Text>
        <ButtonIcon
          onPress={toggleExpanded}
          iconName={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          iconSize={18}
        />
      </TouchableOpacity>

      {isExpanded && (
        <>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputLight}
              placeholder="Search tags"
              placeholderTextColor={colors.text}
            />
            <ButtonIcon onPress={toggleExpanded} iconName="search" />
          </View>
          <View style={styles.rowSpan}>
            {filterTypes.map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedFilter(type)}
              >
                <Text style={[styles.link, { paddingVertical: 5 }]}>
                  {type === 'ALL'
                    ? 'ALL'
                    : type === 'SUBJECT'
                      ? 'SUBJECT MATTER'
                      : type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.rowWrap}>
            {renderTagButtons(getTagsToRender())}
          </View>
        </>
      )}
    </>
  )
}

export default SelectTags
