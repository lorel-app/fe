import React, { createContext, useContext, useState, useCallback } from 'react'
import ModalScreen from '@/components/ModalScreen'
import { Text, View, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import Spacer from '@/components/Spacer'

const ConfirmContext = createContext()

export const ConfirmProvider = ({ children }) => {
  const { colors } = useTheme()
  const styles = useGlobalStyles()
  const [confirm, setConfirm] = useState({
    visible: false,
    title: '',
    onConfirm: null
  })

  const showConfirm = useCallback((title, onConfirm) => {
    setConfirm({
      visible: true,
      title,
      onConfirm
    })
  }, [])

  const hideConfirmModal = useCallback(() => {
    setConfirm({ visible: false, title: '', onConfirm: null })
  }, [])

  const handleConfirm = useCallback(() => {
    if (confirm.onConfirm) {
      confirm.onConfirm()
    }
    hideConfirmModal()
  }, [confirm, hideConfirmModal])

  return (
    <ConfirmContext.Provider value={showConfirm}>
      {children}
      <ModalScreen visible={confirm.visible} onClose={hideConfirmModal}>
        <View style={styles.modalChildren}>
          <Spacer />
          <Text style={styles.title}>{confirm.title}</Text>
          <Spacer />
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.background }]}
            onPress={hideConfirmModal}
          >
            <Text style={styles.link}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ModalScreen>
    </ConfirmContext.Provider>
  )
}

export const useConfirmModal = () => {
  return useContext(ConfirmContext)
}
