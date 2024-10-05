import React from 'react'
import {
  Text,
  Modal,
  View,
  TouchableWithoutFeedback,
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
      appElement={
        Platform.OS === 'web' ? document.getElementById('root') : undefined
      }
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <ButtonIcon
              style={styles.closeButton}
              iconName="close"
              iconSize="15"
              iconColor={colors.text}
              onPress={onClose}
            />
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
