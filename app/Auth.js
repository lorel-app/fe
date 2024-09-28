import React, { useState, useContext, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import ModalScreen from '@/components/ModalScreen'
import InputPhoneNumber from '@/components/InputPhoneNumber'
import ButtonIcon from '@/components/ButtonIcon'
import Spacer from '@/components/Spacer'
import AuthContext from '@/utils/authContext'
import api from '@/utils/api'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useAlertModal } from '@/hooks/useAlertModal'

export default function SignUpLogInModal({ visible, onClose }) {
  const styles = useGlobalStyles()
  const { login } = useContext(AuthContext)
  const showAlert = useAlertModal()

  const [isSignUp, setIsSignUp] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false)
  const [isVerifyEmail, setIsVerifyEmail] = useState(true)
  const [verificationToken, setVerificationToken] = useState('')
  const [user, setUser] = useState('')
  const [savedPassword, setSavedPassword] = useState('')

  const [form, setForm] = useState({
    username: '',
    email: '',
    identity: '',
    phoneCountryCode: 'DE',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (key, value) => {
    setForm(prevForm => ({ ...prevForm, [key]: value }))
  }

  const handleFormSubmit = async () => {
    isSignUp ? await handleSignUp() : await handleLogin()
  }

  const handleSignUp = async () => {
    const { username, email, phone, password, confirmPassword } = form
    if (!username || !email || !phone || !password || !confirmPassword) {
      showAlert('error', 'Please fill in all fields.')
      return
    }
    const usernameRegex = /^[a-zA-Z0-9._]{3,30}$/
    if (!usernameRegex.test(username)) {
      showAlert(
        'error',
        'Usernames must be at least 3 characters long and can only contain letters, numbers, periods, and underscores.'
      )
      return
    }
    if (password !== confirmPassword) {
      showAlert('error', 'Passwords do not match.')
      return
    }
    try {
      const response = await api.signUp({
        username: username.toLowerCase(),
        email,
        phone,
        password
      })
      response.success
        ? (handleVerification(response.data, password), onClose())
        : showAlert('error', response.data.message)
    } catch (error) {
      console.error('Error signing up:', error)
    }
  }

  const handleLogin = async () => {
    const { identity, password } = form
    if (!identity || !password) {
      showAlert('error', 'Please fill in all fields.')
      return
    }
    try {
      const response = await login({
        identity: identity.toLowerCase(),
        password
      })
      response.success
        ? (onClose(), showAlert('success', response.data.message))
        : response.status === 403
          ? (handleVerification(response.data, password), onClose())
          : showAlert('error', response.data.message)
    } catch (error) {
      console.error('Error logging in:', error)
    }
  }

  handleVerification = async (data, password = savedPassword) => {
    password && setSavedPassword(password)
    const verificationToken = data.verificationToken
    setVerificationToken(verificationToken)
    const user = data.user
    setUser(user)
    !user.isEmailVerified
      ? (sendEmail(verificationToken),
        setIsVerifyEmail(true),
        setIsVerifyModalVisible(true))
      : user.isEmailVerified && !user.isPhoneVerified
        ? (sendPhone(verificationToken),
          setIsVerifyEmail(false),
          setIsVerifyModalVisible(true))
        : user.isEmailVerified &&
          user.isPhoneVerified &&
          (await login({ identity: user.email, password: savedPassword }).then(
            response =>
              response.success
                ? (setIsVerifyModalVisible(false),
                  showAlert('success', response.data.message))
                : showAlert('error', response.data.message)
          ))
  }

  const sendEmail = async verificationToken => {
    const response = await api.sendVerificationEmail({ verificationToken })
    !response.success &&
      showAlert('error', 'Something went wrong. Please try again later.')
  }

  const sendPhone = async verificationToken => {
    const response = await api.sendVerificationPhone({ verificationToken })
    !response.success &&
      showAlert('error', 'Something went wrong. Please try again later.')
  }

  return (
    <>
      <ModalScreen visible={visible} onClose={onClose}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {isSignUp ? 'Sign Up (Step 1/3)' : 'Log In'}
          </Text>
          <Spacer />

          {isSignUp ? (
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={form.username}
              onChangeText={text => handleChange('username', text)}
              maxLength={30}
            />
          ) : null}

          <TextInput
            style={styles.input}
            placeholder={isSignUp ? 'Email' : 'Username or Email'}
            value={isSignUp ? form.email : form.identity}
            onChangeText={text =>
              handleChange(isSignUp ? 'email' : 'identity', text)
            }
          />

          {isSignUp ? (
            <InputPhoneNumber
              phoneNumber={form.phone}
              setPhoneNumber={text => handleChange('phone', text)}
              setCountryCode={code => handleChange('phoneCountryCode', code)}
            />
          ) : null}

          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={form.password}
              onChangeText={text => handleChange('password', text)}
              secureTextEntry={!passwordVisible}
            />
            <ButtonIcon
              onPress={() => setPasswordVisible(!passwordVisible)}
              iconName={passwordVisible ? 'visibility-off' : 'visibility'}
              iconSize={24}
            />
          </View>

          {isSignUp ? (
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChangeText={text => handleChange('confirmPassword', text)}
                secureTextEntry={!passwordVisible}
              />
              <ButtonIcon
                onPress={() => setPasswordVisible(!passwordVisible)}
                iconName={passwordVisible ? 'visibility-off' : 'visibility'}
                iconSize={24}
              />
            </View>
          ) : null}
          <Spacer />
          <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
            <Text style={styles.buttonText}>
              {isSignUp ? 'Sign Up' : 'Log In'}
            </Text>
          </TouchableOpacity>
          <Spacer />
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.link}>
              {isSignUp ? 'I already have an account' : 'Create an account'}
            </Text>
          </TouchableOpacity>
        </View>
      </ModalScreen>

      <VerifyModal
        visible={isVerifyModalVisible}
        onClose={() => setIsVerifyModalVisible(false)}
        isVerifyEmail={isVerifyEmail}
        verificationToken={verificationToken}
        user={user}
      />
    </>
  )
}

export function VerifyModal({
  visible,
  onClose,
  verificationToken,
  user,
  isVerifyEmail
}) {
  const styles = useGlobalStyles()
  const [code, setCode] = useState('')
  const showAlert = useAlertModal()

  useEffect(() => {
    setCode('')
  }, [isVerifyEmail])

  const verifyCode = async () => {
    if (!code) {
      showAlert('error', 'Please fill in all fields.')
      return
    }
    try {
      const response = isVerifyEmail
        ? await api.verifyEmail({ verificationToken, code })
        : await api.verifyPhone({ verificationToken, code })

      response.success
        ? handleVerification({
            user: {
              ...user,
              isEmailVerified: isVerifyEmail ? true : user.isEmailVerified,
              isPhoneVerified: !isVerifyEmail ? true : user.isPhoneVerified
            },
            verificationToken
          })
        : showAlert('error', response.error)
    } catch (error) {
      console.error('Error handling verification:', error)
    }
  }

  return (
    <ModalScreen visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isVerifyEmail ? 'Sign Up (Step 2/3)' : 'Sign Up (Step 3/3)'}
        </Text>
        <Spacer />
        <Text style={styles.textCenter}>
          {isVerifyEmail
            ? `Please enter the code sent to ${user.email}`
            : `Please enter the code sent to ${user.phone}`}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="000000"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity style={styles.button} onPress={verifyCode}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
        {/* temp */}
        <TouchableOpacity onPress={{}}>
          <Text style={styles.link}>
            {isVerifyEmail
              ? 'This is the wrong email address'
              : 'This is the wrong phone number'}
          </Text>
        </TouchableOpacity>
      </View>
    </ModalScreen>
  )
}
