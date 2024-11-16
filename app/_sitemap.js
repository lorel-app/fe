import React from 'react'
import { Colors } from '@/constants/Colors'
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import Spacer from '@/components/Spacer'

const OverrideSitemap = () => {
  const styles = useGlobalStyles()
  const goToHomeLink = process.env.EXPO_PUBLIC_APP_URL

  // Not handled for native (use Navigation + webView to open in same tab)
  const openHomeLink = () => {
    Linking.openURL(goToHomeLink).catch(err =>
      console.error('Failed to open link:', err)
    )
  }

  return (
    <View style={[styles.containerFull, { backgroundColor: Colors.white }]}>
      <Text
        style={[{ color: Colors.blue }, { fontSize: 100 }, { opacity: 0.5 }]}
      >
        404
      </Text>
      <Text style={[styles.title, { color: Colors.black }]}>
        Whoops! This page does not exist
      </Text>
      <Spacer />
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: Colors.blueDark },
          { width: 200 }
        ]}
        onPress={openHomeLink}
      >
        <Text style={[styles.buttonText, { color: Colors.white }]}>
          Go to Lorel Home
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default OverrideSitemap
