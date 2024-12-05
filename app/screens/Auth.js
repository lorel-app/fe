import React, { useState, useContext, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import ModalScreen from '@/components/ModalScreen'
import InputPhoneNumber from '@/components/InputPhoneNumber'
import ButtonIcon from '@/components/ButtonIcon'
import Spacer from '@/components/Spacer'
import AuthContext from '@/utils/authContext'
import api from '@/utils/api'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import { useAlertModal } from '@/hooks/useAlertModal'

export default function SignUpLogInModal({ visible, onClose }) {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const { login } = useContext(AuthContext)
  const showAlert = useAlertModal()
  const navigation = useNavigation()

  const [isSignUp, setIsSignUp] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false)
  const [isVerifyEmail, setIsVerifyEmail] = useState(true)
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false)
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
      showAlert('error', 'Please fill in all fields')
      return
    }
    if (!acceptTerms) {
      showAlert('error', 'You have to accept our user agreement to sign up')
      return
    }
    const usernameRegex = /^[a-zA-Z0-9._]{3,30}$/
    if (!usernameRegex.test(username)) {
      showAlert(
        'error',
        'Usernames must be at least 3 characters long and can only contain letters, numbers, periods, and underscores'
      )
      return
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,64}$/
    if (!passwordRegex.test(password)) {
      showAlert(
        'error',
        'Passwords must be at least 8 characters long and contain at least 1 uppercase letter, lowercase letter, a symbol, and number'
      )
      return
    }
    if (password !== confirmPassword) {
      showAlert('error', 'Passwords do not match')
      return
    }
    try {
      const response = await api.signUp({
        username: username.trim().toLowerCase(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim()
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
      showAlert('error', 'Please fill in all fields')
      return
    }
    try {
      const response = await login({
        identity: identity.trim().toLowerCase(),
        password: password.trim()
      })
      response.success
        ? (onClose(),
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }]
          }))
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
      showAlert('error', 'Something went wrong, please try again later')
  }

  const sendPhone = async verificationToken => {
    const response = await api.sendVerificationPhone({ verificationToken })
    !response.success &&
      showAlert('error', 'Something went wrong, please try again later')
  }

  const handleResetPassword = () => {
    onClose()
    setIsResetPasswordModalVisible(true)
  }

  return (
    <>
      <ModalScreen visible={visible} onClose={onClose}>
        <View style={styles.modalChildren}>
          <Text style={styles.title}>
            {isSignUp ? 'Sign Up (Step 1/3)' : 'Log In'}
          </Text>
          <Spacer />

          <ScrollView
            contentContainerStyle={{ maxHeight: 220 }}
            showsVerticalScrollIndicator={false}
          >
            {isSignUp ? (
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={colors.text}
                value={form.username}
                onChangeText={text => handleChange('username', text)}
                maxLength={30}
                multiline={false}
                autoFocus={visible}
              />
            ) : null}

            <TextInput
              style={styles.input}
              placeholder={isSignUp ? 'Email' : 'Username or Email'}
              placeholderTextColor={colors.text}
              value={isSignUp ? form.email : form.identity}
              onChangeText={text =>
                handleChange(isSignUp ? 'email' : 'identity', text)
              }
              multiline={false}
              autoFocus={visible}
            />

            {isSignUp ? (
              <InputPhoneNumber
                phoneNumber={form.phone}
                setPhoneNumber={text => handleChange('phone', text)}
                setCountryCode={code => handleChange('phoneCountryCode', code)}
              />
            ) : null}

            <View style={styles.row}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.text}
                value={form.password}
                onChangeText={text => handleChange('password', text)}
                secureTextEntry={!passwordVisible}
                maxLength={64}
                multiline={false}
              />
              <ButtonIcon
                onPress={() => setPasswordVisible(!passwordVisible)}
                iconName={passwordVisible ? 'visibility-off' : 'visibility'}
                iconSize={24}
              />
            </View>

            {isSignUp ? (
              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={colors.text}
                  value={form.confirmPassword}
                  onChangeText={text => handleChange('confirmPassword', text)}
                  secureTextEntry={!passwordVisible}
                  maxLength={64}
                  multiline={false}
                />
                <ButtonIcon
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  iconName={passwordVisible ? 'visibility-off' : 'visibility'}
                  iconSize={24}
                />
              </View>
            ) : null}

            {isSignUp ? (
              <View style={{ maxWidth: 250 }}>
                <View style={[styles.row, { paddingVertical: 5 }]}>
                  <ButtonIcon
                    onPress={() => setAcceptTerms(!acceptTerms)}
                    iconName={
                      acceptTerms ? 'check-box' : 'check-box-outline-blank'
                    }
                    iconSize={24}
                    iconColor={colors.primary}
                    style={[{ paddingRight: 5 }, { margin: 0 }]}
                  />
                  <Text style={styles.textSmall}>
                    I acknowledge and accept the User Agreements:
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    onClose()
                    navigation.navigate('User Agreements')
                  }}
                >
                  <Text style={[styles.link, { fontSize: 12 }]}>
                    Privacy Policy, Terms and Conditions
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </ScrollView>

          <View
            style={[styles.divider, { width: '100%' }, { marginBottom: 20 }]}
          ></View>
          <TouchableOpacity
            testID={'authenticate_button'}
            style={styles.button}
            onPress={handleFormSubmit}
          >
            <Text style={styles.buttonText}>
              {isSignUp ? 'Sign Up' : 'Log In'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={[styles.link, { marginTop: 10 }]}>
              {isSignUp ? 'I already have an account' : 'Create an account'}
            </Text>
          </TouchableOpacity>
          {!isSignUp && (
            <TouchableOpacity onPress={handleResetPassword}>
              <Text style={[styles.errorText, { paddingTop: 10 }]}>
                I forgot my password
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ModalScreen>

      <VerifyModal
        visible={isVerifyModalVisible}
        onClose={() => setIsVerifyModalVisible(false)}
        isVerifyEmail={isVerifyEmail}
        verificationToken={verificationToken}
        user={user}
      />

      <ResetPasswordModal
        visible={isResetPasswordModalVisible}
        onClose={() => setIsResetPasswordModalVisible(false)}
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
  const { colors } = useTheme()
  const [code, setCode] = useState('')
  const showAlert = useAlertModal()

  useEffect(() => {
    setCode('')
  }, [isVerifyEmail])

  const verifyCode = async () => {
    if (!code) {
      showAlert('error', 'Please fill in all fields')
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
      <View style={styles.modalChildren}>
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
          placeholderTextColor={colors.text}
          value={code}
          onChangeText={setCode}
          multiline={false}
          keyboardType="numeric"
          maxLength={6}
        />
        <TouchableOpacity style={styles.button} onPress={verifyCode}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
        {/* temp */}
        {/* <TouchableOpacity onPress={{}}>
          <Text style={styles.link}>
            {isVerifyEmail
              ? 'This is the wrong email address'
              : 'This is the wrong phone number'}
          </Text>
        </TouchableOpacity> */}
      </View>
    </ModalScreen>
  )
}

const ResetPasswordModal = ({ visible, onClose }) => {
  const styles = useGlobalStyles()
  const showAlert = useAlertModal()
  const { colors } = useTheme()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sendEmail = async () => {
    setIsSubmitting(true)
    await api.sendResetPasswordEmail({
      email: email.trim()
    })
    onClose()
    setIsSubmitting(false)
    showAlert(
      'success',
      'A link to reset your password has been emailed to you if the account exists'
    )
  }

  return (
    <ModalScreen visible={visible} onClose={onClose}>
      <View style={styles.modalChildren}>
        <Text style={styles.title}>Reset your password</Text>
        <Spacer />
        <Text style={styles.textCenter}>What's your email address?</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor={colors.text}
          value={email}
          onChangeText={setEmail}
          multiline={false}
          autoFocus={visible}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={sendEmail}
          disabled={!email || isSubmitting}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ModalScreen>
  )
}
