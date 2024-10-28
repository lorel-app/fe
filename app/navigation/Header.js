import React, { useState, useContext } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import LogoMain from '@/assets/images/LogoMain'
import ButtonSwitch from '@/components/ButtonSwitch'
import ButtonIcon from '@/components/ButtonIcon'
import SignUpLogInModal from '@/app/screens/Auth'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import AuthContext from '@/utils/authContext'
import { useAlertModal } from '@/hooks/useAlertModal'
import ModalScreen from '@/components/ModalScreen'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function Header() {
  const { colors } = useTheme()
  const styles = useGlobalStyles()
  const showAlert = useAlertModal()
  const { isAuthenticated, logout, user } = useContext(AuthContext)
  const [modalVisible, setModalVisible] = useState(false)
  const [optionsVisible, setOptionsVisible] = useState(false)
  const [actionOptions, setActionOptions] = useState([])
  const navigation = useNavigation()

  const options = [
    {
      label: 'User Settings',
      value: 'settings'
    },
    {
      label: 'Privacy Policy, T&Cs',
      value: 'user_agreements'
    },
    { label: 'Get Help', value: 'help' },
    { label: 'Log Out', value: 'logout', icon: 'logout' }
  ]

  const handleOptionSelect = value => {
    const actionsMap = {
      settings: () => navigation.navigate('User Settings', { user }),
      user_agreements: () => navigation.navigate('User Agreements'),
      // temp
      help: () => navigation.navigate('User Agreements'),
      logout: async () => {
        const response = await logout()
        if (response.success) {
          showAlert('success', 'Successfully logged out')
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }]
          })
        } else {
          showAlert('error', 'Something went wrong')
        }
      }
    }

    const action = actionsMap[value]
    if (action) {
      action()
    } else {
      showAlert('error', 'Something went wrong, please try again later')
    }
    setOptionsVisible(false)
  }

  const openOptions = () => {
    setActionOptions(options)
    setOptionsVisible(true)
  }

  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <LogoMain fill={colors.text} width={250 / 2.5} height={61 / 2.5} />
      </View>
      <View style={[styles.headerItems]}>
        <ButtonSwitch />
        {isAuthenticated ? (
          <ButtonIcon
            testID={'options-button'}
            iconName="account-circle"
            onPress={openOptions}
          />
        ) : (
          <ButtonIcon
            testID={'login-button'}
            iconName="account-circle"
            onPress={() => setModalVisible(true)}
          />
        )}
      </View>
      <SignUpLogInModal
        testID={'auth-modal'}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <ModalScreen
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
      >
        {actionOptions.map(option => (
          <TouchableOpacity
            style={[
              { width: 200 },
              { paddingVertical: 10 },
              { borderBottomWidth: 0 },
              { borderBottomColor: colors.primaryTint }
            ]}
            key={option.value}
            onPress={() => handleOptionSelect(option.value)}
          >
            <View style={[styles.row, { alignSelf: 'center' }]}>
              {option.icon && (
                <Icon
                  name={option.icon}
                  color={colors.primary}
                  style={[
                    styles.iconSmall,
                    { paddingRight: 5 },
                    { paddingTop: 2 }
                  ]}
                />
              )}
              <Text style={styles.textBold}>{option.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ModalScreen>
    </View>
  )
}
