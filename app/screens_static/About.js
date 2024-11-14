import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import AuthContext from '@/utils/authContext'
import { useAlertModal } from '@/hooks/useAlertModal'
import { ScrollView } from 'react-native-gesture-handler'
import ReportModal from '@/components/Report'
import Spacer from '@/components/Spacer'
import Icon from 'react-native-vector-icons/MaterialIcons'

const AboutScreen = () => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const { isAuthenticated } = useContext(AuthContext)
  const showAlert = useAlertModal()
  const [isReportModalVisible, setIsReportModalVisible] = useState(false)
  const [title, setTitle] = useState({})

  const handleContact = () => {
    if (!isAuthenticated) {
      showAlert('error', 'Please log in or create an account')
      return
    } else {
      setIsReportModalVisible(true)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text style={styles.textAccent}>ABOUT LOREL</Text>
        <Text style={styles.textAccent}>UNDER CONSTRUCTION</Text>
        <Text>
          Lorel was born out of a few key observations in the world of art and
          creativity: Lorel aims to fill that gap. Think of us as a mix of
          Behance and Vinted—a place where artists can showcase and sell their
          work, and where art lovers can discover and connect with talent.
          Currently in its beta phase, Lorel is the brainchild of two software
          engineering students based in Berlin, developing the platform as part
          of our capstone project. Our mission is to create a space where art
          can thrive, both online and offline, with a focus on accessibility,
          community, and inspiration for all.
        </Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <View>
              <Icon name="art" />
              <Text style={styles.title}>Made for Artists</Text>
              <Text style={styles.text}>
                Artists and creators who want to sell their work online
                typically face a tough choice. They either create their own
                branded webstore or turn to marketplaces like Etsy, often
                relying on social media to promote their work and reach new
                audiences.
              </Text>
            </View>
          </View>
          <View style={styles.gridItem}>
            <View>
              <Icon name="art" />
              <Text style={styles.title}>Focus on Traditional</Text>
              <Text style={styles.text}>
                While some online platforms like exchange.art have gained
                traction in the art industry, they primarily focus on digital
                art, NFTs, and cryptocurrencies—leaving a gap for artists
                working in traditional mediums.
              </Text>
            </View>
          </View>
          <View style={styles.gridItem}>
            <View>
              <Icon name="art" />
              <Text style={styles.title}>Finding Art & Inspiration</Text>
              <Text style={styles.text}>
                For buyers and gallerists searching for art, the current options
                are limited to Google, word-of-mouth, or the most popular social
                media platforms. While Behance has become a staple in the design
                world, there's no similar platform that caters specifically to
                the broader art community.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.post, , { maxWidth: 600 }]}>
        <Text style={[styles.textAccent, { padding: 15 }]}>
          GET IN TOUCH WITH US
        </Text>
        <Text style={[styles.textCenter, { padding: 15 }]}>
          We'd love to hear from you.{'\n'}All feedback helps us to improve
          Lorel as we develop the official release.
        </Text>
        <TouchableOpacity
          onPress={() => {
            handleContact()
            setTitle('How can we help?')
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleContact()
            setTitle('Describe the bug you found')
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>report a bug</Text>
        </TouchableOpacity>
      </View>
      <ReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        type="HELP"
        title={title}
      />
    </ScrollView>
  )
}

export default AboutScreen
