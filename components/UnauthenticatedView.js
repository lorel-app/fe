import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import SignUpLogInModal from '@/app/Auth'
import Spacer from '@/components/Spacer'

const UnauthenticatedView = () => {
  const styles = useGlobalStyles()
  const [modalVisible, setModalVisible] = React.useState(false)

  return (
    <View style={styles.containerFull}>
      <Text style={styles.title}>Please log in or create an account</Text>
      <Spacer />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Sign Up / Log In</Text>
      </TouchableOpacity>

      <SignUpLogInModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  )
}

export default UnauthenticatedView
