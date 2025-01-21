import React from 'react'
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import ButtonIcon from '@/components/ButtonIcon'
import { useTheme } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'

export default function ModalScreen({ visible, onClose, children }) {
  const { colors } = useTheme()
  const styles = useGlobalStyles()

  return (
    <Modal
      testID={'alert_modal'}
      appElement={
        Platform.OS === 'web' ? document.getElementById('root') : undefined
      }
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <ButtonIcon
              style={styles.closeButton}
              iconName="close"
              iconColor={colors.text}
              onPress={onClose}
            />
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  )
}
