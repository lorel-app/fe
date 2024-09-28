import React, { useState, useContext } from 'react'
import { View } from 'react-native'
import { useTheme } from '@react-navigation/native'
import LogoSvg from '@/assets/images/LogoMain.svg'
import ButtonSwitch from '@/components/ButtonSwitch'
import ButtonIcon from '@/components/ButtonIcon'
import SignUpLogInModal from '@/app/Auth'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import AuthContext from '@/utils/authContext'
import { useAlertModal } from '@/hooks/useAlertModal'

export default function Header() {
  const { colors } = useTheme()
  const styles = useGlobalStyles()
  const showAlert = useAlertModal()
  const { isAuthenticated, logout } = useContext(AuthContext)
  const [modalVisible, setModalVisible] = useState(false)

  const handleLogout = async () => {
    const response = await logout()
    if (response.success) {
      showAlert('success', 'Successfully logged out.')
    } else {
      showAlert('error', 'Something went wrong')
    }
  }

  return (
    <View style={styles.header}>
      <LogoSvg fill={colors.secondary} width={250 / 2.5} height={61 / 2.5} />
      <View style={[styles.headerItems]}>
        <ButtonSwitch />
        {isAuthenticated ? (
          <ButtonIcon iconName="logout" onPress={handleLogout} />
        ) : (
          <ButtonIcon
            iconName="account-circle"
            onPress={() => setModalVisible(true)}
          />
        )}
      </View>
      <SignUpLogInModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  )
}
