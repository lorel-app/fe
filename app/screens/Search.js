import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native'
import ButtonIcon from '@/components/ButtonIcon'
import Loader from '@/components/Loader'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import api from '@/utils/api'
import SelectTags from '@/components/SelectTags'
import UserCard from '@/components/UserCard'
import Post from '@/components/Post'

const SearchScreen = () => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const [loading, isLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchUser, setSearchUser] = useState('')
  const [results, setResults] = useState([])
  const [resultType, setResultType] = useState('user')
  let selectedTags = []

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  const handleTagsChange = async tags => {
    selectedTags = tags
  }

  const searchUsers = async () => {
    if (searchUser) {
      isLoading(true)
      toggleCollapse()
      const response = await api.search(searchUser, 'user')
      setResults(response.data.query)
      setResultType('user')
      isLoading(false)
    }
  }

  const validateUUID = uuid => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
  const searchTags = async () => {
    if (selectedTags.length > 0) {
      isLoading(true)
      toggleCollapse()
      const validTags = selectedTags.filter(validateUUID)
      const stringifiedTags = validTags.join(',')
      const response = await api.search(stringifiedTags, 'tag')
      setResults(response.data.query)
      console.log(results)
      setResultType('tag')
      isLoading(false)
    }
  }

  const handleDeletePost = async postId => {
    const response = await api.deletePost(postId)
    if (response.success) {
      setResults(prevResults =>
        prevResults.filter(result => result.id !== postId)
      )
    }
  }

  const renderItem = useCallback(
    ({ item }) => {
      if (resultType === 'user') {
        return <UserCard user={item} />
      } else if (resultType === 'tag') {
        return (
          <View style={styles.post} key={item.id}>
            <Post post={item} onDeletePost={() => handleDeletePost(item.id)} />
          </View>
        )
      }
    },
    [resultType]
  )

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <View
        style={[styles.containerSticky, { backgroundColor: colors.background }]}
      >
        {isCollapsed && (
          <View style={styles.container}>
            <View
              style={[
                styles.input,
                styles.row,
                { paddingVertical: 0 },
                { marginTop: 0 }
              ]}
            >
              <TextInput
                style={styles.inputLight}
                placeholder="Search users"
                placeholderTextColor={colors.text}
                value={searchUser}
                onChangeText={setSearchUser}
              />
              <ButtonIcon onPress={searchUsers} iconName="search" />
            </View>
            <TouchableOpacity
              onPress={searchTags}
              style={[
                styles.buttonSmall,
                styles.row,
                { backgroundColor: colors.primaryTint },
                { marginBottom: 10 },
                { alignSelf: 'center' }
              ]}
            >
              <Text style={[styles.buttonText, { paddingRight: 3 }]}>
                search by tag
              </Text>
              <Icon
                name="search"
                color={colors.textAlt}
                style={styles.iconSmall}
              />
            </TouchableOpacity>
            <SelectTags onTagsChange={handleTagsChange} />
          </View>
        )}

        <TouchableOpacity
          style={[styles.row, { alignSelf: 'center' }, { padding: 5 }]}
          onPress={toggleCollapse}
        >
          <Text style={[styles.link, { paddingBottom: 2 }]}>
            {isCollapsed ? 'collapse' : 'open search bar'}
          </Text>
          <Icon
            name={isCollapsed ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            color={colors.primary}
            style={styles.iconSmall}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={results}
        renderItem={renderItem}
        initialNumToRender={12}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[styles.container, { zIndex: 0 }, { top: 50 }]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        // onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <Loader />}
        ListEmptyComponent={
          <Text style={[styles.textBold, { top: 100 }]}>no results</Text>
        }
        scrollEventThrottle={100}
      />
    </>
  )
}

export default SearchScreen
