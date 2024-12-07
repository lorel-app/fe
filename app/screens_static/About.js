import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import AuthContext from '@/utils/authContext'
import { useAlertModal } from '@/hooks/useAlertModal'
import { ScrollView } from 'react-native-gesture-handler'
import ReportModal from '@/components/Report'
import Spacer from '@/components/Spacer'

const AboutScreen = () => {
  const styles = useGlobalStyles()
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
    <ScrollView
      contentContainerStyle={[styles.container, { padding: 10 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.textAccent, { paddingVertical: 10 }]}>
        ABOUT LOREL
      </Text>
      <Text style={[styles.text, { padding: 15 }, { maxWidth: 600 }]}>
        Lorel's mission is to be a place where artists can showcase and sell
        their work, and where art lovers can discover and connect. Currently in
        its beta phase, Lorel is the brainchild of two software engineering
        students based in Berlin, developing the platform as part of our
        capstone project. Our mission is to create a space where art can thrive,
        both online and offline, with a focus on accessibility, community, and
        inspiration for all.
      </Text>

      <View style={styles.divider}></View>
      <Text style={[styles.textAccent, { paddingVertical: 10 }]}>
        Coming soon...
      </Text>
      <Text style={[styles.text, { padding: 15 }]}>
        📹 Upload videos{'\n'}
        💾 Save content{'\n'}
        💳 Payment integration{'\n'}
        🤝 Mediation of buying process
      </Text>
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.title}>👑</Text>
          <Text style={styles.title}>Made for Artists</Text>
          <Spacer />
          <Text style={styles.text}>
            Artists and creators who wish to build a name for themselves, often
            have limited choices. Mostly, they can either build their own
            branded website or portfolio, which gives them full control over
            their brand and sales, but also requires them to take on the
            responsibility of marketing and driving traffic to their site. And
            alternatively, they can turn to established marketplace or social
            platforms, which offer built-in audiences but come with the downside
            of being crowded and cluttered with other sellers and content,
            making it harder for their work to stand out.
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.title}>🎨</Text>
          <Text style={styles.title}>Embrace the Traditional</Text>
          <Spacer />
          <Text style={styles.text}>
            While some online platforms for artists and creators have gained
            traction in the art industry, they tend to focus on
            digital/commerical art and NFTs, especially as the cryptocurrency
            space expands. While ownership remains a valid factor, there's room
            to support and empower those who create in more traditional,
            hands-on mediums. These who produce unique, physical works with a
            commitment to creating art for the sake of being creative, and
            creation itself.
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.title}>✨</Text>
          <Text style={styles.title}>Inspire & Sell</Text>
          <Spacer />
          <Text style={styles.text}>
            For buyers and gallerists searching for art, the current options are
            limited to Google, word-of-mouth, or the most popular social media
            platforms. Like Behance has become a staple in the design world,
            there's no similar platform that caters specifically to the broader
            art community.
          </Text>
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
