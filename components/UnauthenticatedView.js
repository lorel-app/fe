import React from 'react'
import { View, Text } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import Spacer from '@/components/Spacer'

const UnauthenticatedView = () => {
  const styles = useGlobalStyles()

  return (
    <View style={styles.containerFull}>
      <Text style={[styles.textAccent, { fontSize: 100 }, { opacity: 0.5 }]}>
        401
      </Text>
      <Text style={styles.title}>Please log in or create an account</Text>
      <Spacer />
    </View>
  )
}

export default UnauthenticatedView
