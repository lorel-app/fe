import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, TextInput } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import ModalScreen from '@/components/ModalScreen'
import api from '@/utils/api'
import Spacer from '@/components/Spacer'
import { useAlertModal } from '@/hooks/useAlertModal'

const ReportModal = ({ visible, onClose, id, type, postIndex, title }) => {
  const styles = useGlobalStyles()
  const showAlert = useAlertModal()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (visible) {
      setMessage('')
    }
  }, [visible])

  const handleReport = async () => {
    setIsSubmitting(true)
    const response = await api.sendReport({
      ...(type !== 'HELP' && { resourceId: id }),
      resourceType: type,
      mediaIndex: postIndex || null,
      message
    })
    if (response.success) {
      showAlert('success', 'Thank you, we will look into it')
      onClose()
      setIsSubmitting(false)
    } else {
      showAlert('error', 'Something went wrong, please try again later')
      setIsSubmitting(false)
      return
    }
  }

  return (
    <ModalScreen visible={visible} onClose={onClose}>
      <View style={styles.modalChildren}>
        <Spacer />
        <Text style={styles.title}>
          {title || `Report this ${type.toLowerCase()}`}
        </Text>
        <Text style={styles.text}>If applicable, we will get back to you</Text>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          multiline={true}
          numberOfLines={6}
          maxLength={1000}
          autoFocus={visible}
        />
        <TouchableOpacity
          style={[
            styles.button,
            !message || isSubmitting ? { opacity: 0.5 } : null
          ]}
          onPress={handleReport}
          disabled={!message | isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.buttonText}>Submitting...</Text>
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </ModalScreen>
  )
}

export default ReportModal
