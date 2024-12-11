import React, { useState, useContext } from 'react'
import { View, TouchableOpacity, Text, TextInput,KeyboardAvoidingView, Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme, useNavigation } from '@react-navigation/native'
import api from '@/utils/api'
import HeaderStack from '../navigation/HeaderStack'
import { useAlertModal } from '@/hooks/useAlertModal'
import { useConfirmModal } from '@/hooks/useConfirmModal'
import AuthContext from '@/utils/authContext'
import Spacer from '@/components/Spacer'

const EditPostScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const showAlert = useAlertModal()
  const showConfirm = useConfirmModal()
  const navigation = useNavigation()
  const { user: me } = useContext(AuthContext)
  const { post = {}, showHeader = true } = route.params || {}

  const [form, setForm] = useState({
    title: post.title || 'Untitled',
    price: post.price || '',
    caption: post.caption || '',
    description: post.description || '',
    sold: post.sold || false
  })

  const handleChange = (key, value) => {
    if (key === 'sold') {
      setForm(prevForm => ({ ...prevForm, [key]: !prevForm[key] }))
    } else {
      setForm(prevForm => ({ ...prevForm, [key]: value }))
    }
  }

  const handleSubmitChanges = async () => {
    const pricePattern = /^[0-9]+(\.[0-9]{1,2})?$/
    if (form.price && !pricePattern.test(form.price.replace(/[^0-9.]/g, ''))) {
      showAlert(
        'error',
        'Incorrect price format: Please use up to 2 decimal places and only one full stop'
      )
      return
    }
    const response = await api.editPost(post.id, {
      title: form.title.trim() || 'Untitled',
      price: form.price.replace(/[^0-9.]/g, '') || null,
      sold: form.sold,
      caption: form.caption.trim() || null,
      description: form.description.trim() || null
    })
    if (response.success) {
      navigation.navigate('Profile')
    } else {
      showAlert('error', 'Failed to save changes')
    }
  }

  const handleDelete = async () => {
    showConfirm('Are you sure you want to delete this post?', async () => {
      await api.deletePost(post.id)
      navigation.navigate('Profile')
      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }]
      })
    })
  }

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
    style={{ flex: 1 }}
    keyboardShouldPersistTaps="handled"
  >
      {showHeader && (
        <HeaderStack title={`Edit your post`} hideFollowButton={true} />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { maxWidth: 500 },
          { alignSelf: 'center' },
          { paddingHorizontal: 20 }
        ]}
      >
        {post.type === 'SHOP' && (
          <>
            <View style={styles.rowSpan}>
              <Text style={styles.textBold}>Title</Text>
              <Text style={styles.textLight}>(Max 50)</Text>
            </View>
            <TextInput
              style={styles.inputLight}
              placeholder="Title"
              placeholderTextColor={colors.text}
              value={form.title}
              onChangeText={text => handleChange('title', text)}
              maxLength={50}
              autoCapitalize="words"
            />
          </>
        )}

        {post.type === 'SHOP' && (
          <View style={[styles.rowSpan, { padding: 0 }]}>
            <Text style={[styles.textBold, { padding: 10 }]}>
              {me.preferences.currency}
            </Text>
            <TextInput
              style={styles.inputLight}
              placeholder="00.00"
              placeholderTextColor={colors.text}
              value={form.price.replace(/[^0-9.]/g, '')}
              onChangeText={text => handleChange('price', text)}
              keyboardType="numeric"
              maxLength={50}
            />
            <TouchableOpacity
              style={[styles.buttonSmall, { marginLeft: 20 }]}
              onPress={() => handleChange('sold')}
            >
              <View style={[styles.row, { alignSelf: 'center' }]}>
                <Text style={styles.textBold}>
                  {form.sold ? 'Sold' : 'Mark as sold'}
                </Text>
                <Icon
                  name={form.sold ? 'check-box' : 'check-box-outline-blank'}
                  style={styles.iconSmall}
                  color={colors.text}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.rowSpan}>
          <Text style={styles.textBold}>Caption</Text>
          <Text style={styles.textLight}>(Max 255)</Text>
        </View>
        <TextInput
          style={[styles.inputLight, { height: 100 }]}
          placeholder="Caption"
          placeholderTextColor={colors.text}
          value={form.caption}
          onChangeText={text => handleChange('caption', text)}
          multiline={true}
          maxLength={255}
        />

        {post.type === 'SHOP' && (
          <>
            <View style={styles.rowSpan}>
              <Text style={styles.textBold}>Description</Text>
              <Text style={styles.textLight}>(Max 1000)</Text>
            </View>
            <TextInput
              style={[styles.inputLight, { height: 150 }]}
              placeholder="Description"
              placeholderTextColor={colors.text}
              value={form.description}
              onChangeText={text => handleChange('description', text)}
              multiline={true}
              maxLength={1000}
            />
          </>
        )}
        <Spacer />
        <TouchableOpacity onPress={handleDelete}>
          <Text style={[styles.errorText, { marginBottom: 80 }]}>
            delete post
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity
        style={styles.buttonAbsolute}
        onPress={handleSubmitChanges}
      >
        <Text style={styles.buttonText}>save changes</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

export default EditPostScreen
