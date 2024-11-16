import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import {
  useTheme,
  useFocusEffect,
  useNavigation
} from '@react-navigation/native'
import { useAlertModal } from '@/hooks/useAlertModal'
import { useConfirmModal } from '@/hooks/useConfirmModal'
import api from '@/utils/api'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ModalScreen from '@/components/ModalScreen'
import Loader from '@/components/Loader'
import Spacer from '@/components/Spacer'
import ButtonIcon from '@/components/ButtonIcon'

const SettingsScreen = () => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const showAlert = useAlertModal()
  const showConfirm = useConfirmModal()
  const navigation = useNavigation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState('')
  const [optionsVisible, setOptionsVisible] = useState(false)
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false)

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        setLoading(true)
        const response = await api.getMe()
        if (response.success) {
          setUser(response.data)
          setCurrency(response.data.preferences.currency)
        } else {
          showAlert('error', 'Failed to fetch user data')
        }
        setLoading(false)
      }
      fetchUserData()
    }, [showAlert])
  )

  const unImplemented = () => {
    showAlert('error', 'This will be available in a future release')
  }

  const handleAccountDelete = async () => {
    navigation.navigate('Home')
    showConfirm(
      `Are you sure you want to DELETE your account?\nAll of your data will be wiped\nand CANNOT BE RESTORED`,
      async () => {
        try {
          await api.deleteMe()
          showAlert(
            'success',
            'You deleted your Lorel account and have been logged out'
          )
        } catch (error) {
          console.error(error)
          showAlert('error', 'Failed to delete account, please try again later')
        }
      }
    )
  }

  const options = [
    { label: 'AU$ (AUD)', value: 'AUD' },
    { label: 'R$ (BRL)', value: 'BRL' },
    { label: 'CA$ (CAD)', value: 'CAD' },
    { label: '₣ (CHF)', value: 'CHF' },
    { label: 'CN¥ (CNY)', value: 'CNY' },
    { label: '€ (EUR)', value: 'EUR' },
    { label: '£ (GBP)', value: 'GBP' },
    { label: '₹ (INR)', value: 'INR' },
    { label: '¥ (JPY)', value: 'JPY' },
    { label: 'MX$ (MXN)', value: 'MXN' },
    { label: '$ (USD)', value: 'USD' },
    { label: 'R (ZAR)', value: 'ZAR' }
  ]

  const handleOptionSelect = async value => {
    const response = await api.editPreferences({ currency: value })
    if (response.success) {
      setCurrency(value)
      setOptionsVisible(false)
    } else {
      setOptionsVisible(false)
      showAlert('error', 'Something went wrong, please try again later')
    }
  }

  const openModal = () => {
    setIsChangePasswordModalVisible(true)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={[styles.row, { paddingTop: 10 }]}>
            <Icon
              name={'settings'}
              style={[styles.icon, { paddingHorizontal: 8 }]}
              color={colors.secondary}
            />
            <Text style={styles.title}>Preferences</Text>
          </View>
          <View style={styles.divider}></View>
          <View style={[styles.row, { paddingLeft: 10 }, { paddingTop: 10 }]}>
            <Text style={styles.textBold}>Currency</Text>
          </View>
          <View style={[styles.rowSpan, { paddingBottom: 20 }]}>
            <Text style={styles.text}>{currency}</Text>
            <TouchableOpacity onPress={() => setOptionsVisible(true)}>
              <Text style={styles.link}>change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={[styles.row, { paddingTop: 10 }]}>
            <Icon
              name={'account-circle'}
              style={[styles.icon, { paddingHorizontal: 8 }]}
              color={colors.secondary}
            />
            <Text style={styles.title}>Account Information</Text>
          </View>
          <View style={styles.divider}></View>
          <View style={[styles.rowSpan, { paddingBottom: 20 }]}>
            <Text style={styles.textBold}>Username</Text>
            <Text style={styles.textBold}>{user.username}</Text>
          </View>

          <View style={[styles.row, { paddingLeft: 10 }]}>
            <Text style={styles.textBold}>Email address</Text>
          </View>
          <View style={[styles.rowSpan, { paddingBottom: 20 }]}>
            <Text style={styles.text}>{user.email}</Text>
            <TouchableOpacity onPress={unImplemented}>
              <Text style={styles.link}>change</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.row, { paddingLeft: 10 }]}>
            <Text style={styles.textBold}>Phone number</Text>
          </View>
          <View style={[styles.rowSpan, { paddingBottom: 20 }]}>
            <Text style={styles.text}>{user.phone}</Text>
            <TouchableOpacity onPress={unImplemented}>
              <Text style={styles.link}>change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}></View>

          <TouchableOpacity onPress={openModal}>
            <Text style={[styles.link, { paddingBottom: 10 }]}>
              change password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleAccountDelete}>
            <Text style={[styles.errorText, { paddingBottom: 10 }]}>
              delete account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ChangePasswordModal
        visible={isChangePasswordModalVisible}
        onClose={() => setIsChangePasswordModalVisible(false)}
      />

      <ModalScreen
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {options.map(option => (
            <TouchableOpacity
              style={[
                { width: 200 },
                { paddingVertical: 10 },
                { borderBottomWidth: 1 },
                { borderBottomColor: colors.primaryTint }
              ]}
              key={option.value}
              onPress={() => handleOptionSelect(option.value)}
            >
              <View style={[styles.row, { alignSelf: 'center' }]}>
                <Text style={styles.textBold}>{option.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ModalScreen>
    </>
  )
}

const ChangePasswordModal = ({ visible, onClose }) => {
  const styles = useGlobalStyles()
  const showAlert = useAlertModal()
  const { colors } = useTheme()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const changePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      onClose()
      showAlert('error', 'Failed because passwords did not match')
      return
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,64}$/
    if (!passwordRegex.test(newPassword)) {
      onClose()
      showAlert(
        'error',
        'Failed because passwords must be at least 8 characters long and contain at least 1 uppercase letter, lowercase letter, and number'
      )
      return
    }
    setIsSubmitting(true)
    const response = await api.changePassword({ oldPassword, newPassword })
    if (response.success) {
      onClose()
      showAlert('success', 'Password updated')
    } else if (response.status === 400) {
      onClose()
      showAlert('error', 'Failed because you entered the wrong password')
    } else {
      onClose()
      showAlert('error', 'Something went wrong, please try again later')
    }
    setIsSubmitting(false)
  }
  return (
    <ModalScreen visible={visible} onClose={onClose}>
      <View style={styles.modalChildren}>
        <Text style={styles.title}>Change your password</Text>
        <Spacer />
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          placeholderTextColor={colors.text}
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={!passwordVisible}
          multiline={false}
          autoFocus={visible}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor={colors.text}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!passwordVisible}
          multiline={false}
          autoFocus={visible}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor={colors.text}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry={!passwordVisible}
          multiline={false}
          autoFocus={visible}
        />
        <TouchableOpacity
          style={styles.rowSpan}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Text style={styles.text}>
            {passwordVisible ? 'hide passwords' : 'show passwords'}
          </Text>
          <ButtonIcon
            onPress={() => setPasswordVisible(!passwordVisible)}
            iconName={passwordVisible ? 'visibility-off' : 'visibility'}
            iconSize={24}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={changePassword}
          disabled={
            isSubmitting || !oldPassword || !newPassword || !confirmNewPassword
          }
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ModalScreen>
  )
}

export default SettingsScreen
