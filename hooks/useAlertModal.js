import React, { createContext, useContext, useState, useCallback } from 'react'
import ModalScreen from '@/components/ModalScreen'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Text, View } from 'react-native'

const AlertContext = createContext()

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    visible: false,
    children: null
  })

  const showAlert = useCallback((type, title) => {
    const icon =
      type === 'error' ? (
        <Icon name="error" size={48} color="red" />
      ) : (
        <Icon name="check-circle" size={48} color="green" />
      )

    setAlert({
      visible: true,
      children: (
        <View style={{ alignItems: 'center' }}>
          {icon}
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>
            {title}
          </Text>
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
