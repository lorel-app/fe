import React, { createContext, useContext, useState, useCallback } from 'react'
import ModalScreen from '@/components/ModalScreen'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { Text, View } from 'react-native'
import Spacer from '@/components/Spacer'

const AlertContext = createContext()

export const AlertProvider = ({ children }) => {
  const { colors } = useTheme()
  const styles = useGlobalStyles()
  const [alert, setAlert] = useState({
    visible: false,
    children: null
  })

  const showAlert = useCallback((type, title) => {
    const icon =
      type === 'error' ? (
        <Icon name="error" size={38} color={colors.accent} />
      ) : (
        <Icon name="check-circle" size={38} color={colors.primary} />
      )

    setAlert({
      visible: true,
      children: (
        <View style={styles.container}>
          {icon}
          <Spacer />
          <Text style={styles.title}>{title}</Text>
        </View>
      )
    })
  }, [])

  const hideAlert = useCallback(() => {
    setAlert({ visible: false, children: null })
  }, [])

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <ModalScreen visible={alert.visible} onClose={hideAlert}>
        {alert.children}
      </ModalScreen>
    </AlertContext.Provider>
  )
}

export const useAlertModal = () => {
  return useContext(AlertContext)
}
