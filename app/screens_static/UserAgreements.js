import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { ScrollView } from 'react-native-gesture-handler'

const TabButton = ({ label, isSelected, onPress, styles }) => (
  <TouchableOpacity style={{ margin: 15 }} onPress={onPress}>
    <Text style={isSelected ? styles.textBold : styles.link}>{label}</Text>
  </TouchableOpacity>
)

const SpacedText = React.forwardRef(({ children, style, ...props }, ref) => {
  const styles = useGlobalStyles()
  return (
    <Text
      ref={ref}
      selectable={true}
      style={[
        styles.text,
        { margin: 5 },
        { width: '100%' },
        { maxWidth: 500 },
        { alignSelf: 'center' },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  )
})

const PrivacyPolicy = ({ styles, sections }) => (
  <>
    <Text style={styles.title}>Privacy Policy</Text>
    <SpacedText ref={sections[0].ref} style={styles.textAccent}>
      1. Introduction
    </SpacedText>
    <SpacedText>
      This Privacy Policy explains how Lorel (beta), created by Alsje Lourens
      and Massimiliano Ricci, collects, uses, and protects your personal data.
      We are committed to protecting your privacy and complying with the General
      Data Protection Regulation (GDPR).
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[1].ref} style={styles.textAccent}>
      2. Data We Collect
    </SpacedText>
    <SpacedText style={styles.textBold}>Account Information</SpacedText>
    <SpacedText>
      When you register, we collect your phone number, email address, username,
      and password.
    </SpacedText>
    <SpacedText style={styles.textBold}>User Content</SpacedText>
    <SpacedText>
      When you upload images and videos (future feature), this content may be
      publicly visible on the App - including to non-users.
    </SpacedText>
    <SpacedText style={styles.textBold}>Payment Information</SpacedText>
    <SpacedText>
      In future updates, we may collect payment details if you engage in
      financial transactions on the platform.
    </SpacedText>
    <SpacedText style={styles.textBold}>Location Data</SpacedText>
    <SpacedText>
      In future updates, we may collect your location if you enable this feature
      for relevant app functionalities.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[2].ref} style={styles.textAccent}>
      3. How We Use Your Data
    </SpacedText>
    <SpacedText style={styles.textBold}>
      We use your personal data to:
    </SpacedText>
    <SpacedText>Create and manage your account.</SpacedText>
    <SpacedText>Provide you with access to the features of Lorel.</SpacedText>
    <SpacedText>Enhance your experience on the platform.</SpacedText>
    <SpacedText>Ensure the security of your account.</SpacedText>
    <SpacedText>Provide customer support.</SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[3].ref} style={styles.textAccent}>
      4. Legal Basis for Processing Data
    </SpacedText>
    <SpacedText>
      Under the GDPR, we process your personal data based on the following
      lawful bases:
    </SpacedText>
    <SpacedText style={styles.textBold}>Consent: </SpacedText>
    <SpacedText>
      By creating an account and using Lorel, you consent to our collection and
      use of your data.
    </SpacedText>
    <SpacedText style={styles.textBold}>Contract: </SpacedText>
    <SpacedText>
      We process your data to fulfill our obligations, such as providing access
      to the app’s features.
    </SpacedText>
    <SpacedText style={styles.textBold}>Legitimate Interest: </SpacedText>
    <SpacedText>
      We may process your data to improve our services and ensure the security
      of the app.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[4].ref} style={styles.textAccent}>
      5. Data Sharing and Disclosure
    </SpacedText>
    <SpacedText>
      We do not share your personal data with third parties except in the
      following cases:
    </SpacedText>
    <SpacedText style={styles.textBold}>Legal Requirements: </SpacedText>
    <SpacedText>
      We may disclose your information if required by law or in response to
      legal requests.
    </SpacedText>
    <SpacedText style={styles.textBold}>Service Providers: </SpacedText>
    <SpacedText>
      We may share your data with third-party providers who help us operate the
      App, but only for the purposes outlined in this Privacy Policy.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[5].ref} style={styles.textAccent}>
      6. Data Retention
    </SpacedText>
    <SpacedText>
      We retain your personal data only for as long as necessary to provide you
      with our services. If you delete your account or content, we will delete
      all related data permanently.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[6].ref} style={styles.textAccent}>
      7. Your Rights Under GDPR
    </SpacedText>
    <SpacedText>
      As a user in the EU, you have the following rights under the GDPR:
    </SpacedText>
    <SpacedText style={styles.textBold}>Right to Access: </SpacedText>
    <SpacedText>
      You can request access to the personal data we hold about you.
    </SpacedText>
    <SpacedText style={styles.textBold}>Right to Rectification: </SpacedText>
    <SpacedText>
      You can request that we correct any inaccurate or incomplete data.
    </SpacedText>
    <SpacedText style={styles.textBold}>Right to Erasure: </SpacedText>
    <SpacedText>You can request that we delete your data.</SpacedText>
    <SpacedText style={styles.textBold}>
      Right to Restrict Processing:
    </SpacedText>
    <SpacedText>
      You can request that we limit the processing of your data.
    </SpacedText>
    <SpacedText style={styles.textBold}>Right to Data Portability: </SpacedText>
    <SpacedText>
      You can request a copy of your data in a machine-readable format.
    </SpacedText>
    <SpacedText style={styles.textBold}>Right to Object: </SpacedText>
    <SpacedText>
      You can object to the processing of your data under certain conditions.
    </SpacedText>
    <SpacedText>To exercise any of these rights, please contact us.</SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[7].ref} style={styles.textAccent}>
      8. Data Security
    </SpacedText>
    <SpacedText>
      We take the security of your data seriously and use industry-standard
      measures to protect your personal information from unauthorized access,
      loss, or misuse.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[8].ref} style={styles.textAccent}>
      9. Changes to This Privacy Policy
    </SpacedText>
    <SpacedText>
      We may update this Privacy Policy to reflect changes in our practices or
      legal requirements. Any updates will be posted within the App, and your
      continued use of the App after changes will indicate your acceptance of
      the revised policy.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[9].ref} style={styles.textAccent}>
      10. Contact Us
    </SpacedText>
    <SpacedText>
      If you have any questions or requests about this Privacy Policy or how we
      handle your data, please contact us.
    </SpacedText>
    <SpacedText style={styles.textSmall}>
      Alsje Lourens, Product Owner
    </SpacedText>
    <SpacedText style={styles.textBold}>alsje.lourens@code.berlin</SpacedText>
    <SpacedText style={styles.textSmall}>
      Massimiliano Ricci, Product Owner
    </SpacedText>
    <SpacedText style={styles.textBold}>
      massimiliano.ricci@code.berlin
    </SpacedText>
    <View style={[{ height: 80 }]}></View>
  </>
)

const TermsConditions = ({ styles, sections }) => (
  <>
    <Text style={styles.title}>Terms & Conditions</Text>
    <SpacedText ref={sections[0].ref} style={styles.textAccent}>
      1. Introduction
    </SpacedText>
    <SpacedText>
      Welcome to Lorel (beta), a platform created by Alsje Lourens and
      Massimiliano Ricci. Lorel is designed to help artists and art lovers
      connect, be inspired, and showcase and sell their work. By using our app,
      you agree to the following terms and conditions. Please read them
      carefully before proceeding.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[1].ref} style={styles.textAccent}>
      2. Acceptance of Terms
    </SpacedText>
    <SpacedText>
      By accessing or using Lorel, you agree to be bound by these Terms and
      Conditions and our Privacy Policy. If you do not agree to these terms, you
      must not use the App.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[2].ref} style={styles.textAccent}>
      3. Use of the App
    </SpacedText>
    <SpacedText style={styles.textBold}>Account Registration</SpacedText>
    <SpacedText>
      To access certain features, you must register for an account by providing
      a username, password, phone number, and email address. You agree to
      provide accurate and up-to-date information.
    </SpacedText>
    <SpacedText style={styles.textBold}>Account Security</SpacedText>
    <SpacedText>
      You are responsible for maintaining the confidentiality of your login
      credentials and for all activities under your account.
    </SpacedText>
    <SpacedText style={styles.textBold}>User Content</SpacedText>
    <SpacedText>
      You may upload images and videos (in future updates). By uploading
      content, you grant Lorel the right to display your content on the app, but
      you retain full ownership. You are responsible for ensuring that any
      content you upload does not violate any laws or infringe on the rights of
      others.
    </SpacedText>
    <SpacedText style={styles.textBold}>Content Deletion</SpacedText>
    <SpacedText>
      When you delete content or your account, we will delete all relevant
      information. We do not retain your data for future use.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[3].ref} style={styles.textAccent}>
      4. Prohibited Activities
    </SpacedText>
    <SpacedText style={styles.textBold}>You agree not to: </SpacedText>
    <SpacedText>Violate any laws or regulations.</SpacedText>
    <SpacedText>
      Post any illegal, harmful, or inappropriate content.
    </SpacedText>
    <SpacedText>Use Lorel to spam, harass, or mislead others.</SpacedText>
    <SpacedText>
      Attempt to interfere with the App's security or functionality.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[4].ref} style={styles.textAccent}>
      5. Termination
    </SpacedText>
    <SpacedText>
      We may suspend or terminate your account if you violate these terms or
      engage in behavior harmful to Lorel users or creators.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[5].ref} style={styles.textAccent}>
      6. Payment and Fees
    </SpacedText>
    <SpacedText>
      In future updates, Lorel may introduce features that allow you to buy or
      sell art. You agree to provide accurate payment information if you choose
      to engage in transactions on the app. Specific terms related to payments
      and transactions will be introduced when these features are live.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[6].ref} style={styles.textAccent}>
      7. Disclaimer of Warranties
    </SpacedText>
    <SpacedText>
      Lorel is provided on an "as is" and "as available" basis. We do not
      guarantee that the App will be error-free or uninterrupted.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[7].ref} style={styles.textAccent}>
      8. Limitation of Liability
    </SpacedText>
    <SpacedText>
      To the fullest extent permitted by law, Lorel, its creators, and
      affiliates will not be liable for any damages arising from your use of the
      App, including but not limited to, direct, indirect, incidental, or
      consequential damages.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[8].ref} style={styles.textAccent}>
      9. Changes to the Terms
    </SpacedText>
    <SpacedText>
      We reserve the right to modify these Terms at any time. Your continued use
      of the App after changes are made will constitute acceptance of the new
      terms.
    </SpacedText>
    <View style={styles.divider}></View>

    <SpacedText ref={sections[9].ref} style={styles.textAccent}>
      10. Contact Us
    </SpacedText>
    <SpacedText>
      If you have any questions or requests about these Terms and Conditions,
      please contact us.
    </SpacedText>
    <SpacedText style={styles.textSmall}>
      Alsje Lourens, Product Owner
    </SpacedText>
    <SpacedText style={styles.textBold}>alsje.lourens@code.berlin</SpacedText>
    <SpacedText style={styles.textSmall}>
      Massimiliano Ricci, Product Owner
    </SpacedText>
    <SpacedText style={styles.textBold}>
      massimiliano.ricci@code.berlin
    </SpacedText>
    <View style={[{ height: 80 }]}></View>
  </>
)

// const UserAgreementsScreen = ({ route }) => {
//   const styles = useGlobalStyles()
//   const initialSelectedTab = route.params?.selectedTab || 'privacy'
//   const [selectedTab, setSelectedTab] = useState(initialSelectedTab)
//   const scrollViewRef = useRef(null)
//   const [sectionPositions, setSectionPositions] = useState({})

//   const privacySections = [
//     { title: '1. Introduction', ref: useRef(null) },
//     { title: '2. Data Collection', ref: useRef(null) },
//     { title: '3. How We Use Your Data', ref: useRef(null) },
//     { title: '4. Legal Basis for Processing Data', ref: useRef(null) },
//     { title: '5. Data Sharing and Disclosure', ref: useRef(null) },
//     { title: '6. Data Retention', ref: useRef(null) },
//     { title: '7. Your Rights Under GDPR', ref: useRef(null) },
//     { title: '8. Data Security', ref: useRef(null) },
//     { title: '9. Changes to this Policy', ref: useRef(null) },
//     { title: '10. Contact Us', ref: useRef(null) }
//   ]
//   const termsSections = [
//     { title: '1. Introduction', ref: useRef(null) },
//     { title: '2. Acceptance of Terms', ref: useRef(null) },
//     { title: '3. Use of the App', ref: useRef(null) },
//     { title: '4. Prohibited Activities', ref: useRef(null) },
//     { title: '5. Termination', ref: useRef(null) },
//     { title: '6. Payment and Fees', ref: useRef(null) },
//     { title: '7. Disclaimer of Warranties', ref: useRef(null) },
//     { title: '8. Limitation of Liability', ref: useRef(null) },
//     { title: '9. Changes to the Terms', ref: useRef(null) },
//     { title: '10. Contact Us', ref: useRef(null) }
//   ]

//   const measureSectionPositions = sections => {
//     const positions = {}
//     sections.forEach((section, index) => {
//       section.ref.current.measure((x, y, width, height) => {
//         positions[index] = y
//         if (Object.keys(positions).length === sections.length) {
//           setSectionPositions(positions)
//         }
//       })
//     })
//   }
//   // works for web
//   // const measureSectionPositions = sections => {
//   //   const positions = {}

//   //   sections.forEach((section, index) => {
//   //     section.ref.current.measureLayout(
//   //       scrollViewRef.current,
//   //       (x, y) => {
//   //         positions[index] = y
//   //         if (Object.keys(positions).length === sections.length) {
//   //           setSectionPositions(positions)
//   //         }
//   //       },
//   //       error => console.error('Error measuring layout:', error)
//   //     )
//   //   })
//   // }

//   useEffect(() => {
//     const sections = selectedTab === 'privacy' ? privacySections : termsSections
//     measureSectionPositions(sections)
//   }, [selectedTab])

//   // const handleScrollToSection = index => {
//   //   const yPosition = sectionPositions[index]
//   //   if (yPosition !== undefined) {
//   //     scrollViewRef.current.scrollTo({ y: yPosition, animated: true })
//   //   }
//   // }
//   const handleScrollToSection = index => {
//     const yPosition = sectionPositions[index]
//     if (yPosition !== undefined) {
//       setTimeout(() => {
//         // This makes sure the scroll happens after the layout is updated
//         scrollViewRef.current.scrollTo({ y: yPosition, animated: true })
//       }, 100) // Add a slight delay
//     }
//   }

//   const handleTabChange = tab => {
//     setSelectedTab(tab)
//     scrollViewRef.current.scrollTo({ y: 0, animated: false })
//   }

//   const renderContent = () => {
//     if (selectedTab === 'privacy') {
//       return <PrivacyPolicy styles={styles} sections={privacySections} />
//     }
//     return <TermsConditions styles={styles} sections={termsSections} />
//   }

//   const renderIndex = () => {
//     const sections = selectedTab === 'privacy' ? privacySections : termsSections
//     return (
//       <View style={[styles.rowWrap, styles.boxShadow, { padding: 10 }]}>
//         {sections.map((section, index) => (
//           <TouchableOpacity
//             key={index}
//             onPress={() => handleScrollToSection(index)}
//             style={styles.buttonSmall}
//           >
//             <Text style={styles.textSmall}>{section.title}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     )
//   }

//   return (
//     <>
//       <View style={[styles.row, { alignSelf: 'center' }]}>
//         <TabButton
//           label="Privacy Policy"
//           isSelected={selectedTab === 'privacy'}
//           onPress={() => handleTabChange('privacy')}
//           styles={styles}
//         />
//         <TabButton
//           label="Terms & Conditions"
//           isSelected={selectedTab === 'terms'}
//           onPress={() => handleTabChange('terms')}
//           styles={styles}
//         />
//       </View>

//       {renderIndex()}

//       <ScrollView
//         ref={scrollViewRef}
//         contentContainerStyle={[styles.containerLeft, { padding: 20 }]}
//       >
//         {renderContent()}
//       </ScrollView>
//     </>
//   )
// }

// export default UserAgreementsScreen

const UserAgreementsScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const initialSelectedTab = route.params?.selectedTab || 'privacy'
  const [selectedTab, setSelectedTab] = useState(initialSelectedTab)
  const scrollViewRef = useRef(null)
  const [sectionPositions, setSectionPositions] = useState({})
  const [isPositionsReady, setIsPositionsReady] = useState(false)

  const privacySections = [
    { title: '1. Introduction', ref: useRef(null) },
    { title: '2. Data Collection', ref: useRef(null) },
    { title: '3. How We Use Your Data', ref: useRef(null) },
    { title: '4. Legal Basis for Processing Data', ref: useRef(null) },
    { title: '5. Data Sharing and Disclosure', ref: useRef(null) },
    { title: '6. Data Retention', ref: useRef(null) },
    { title: '7. Your Rights Under GDPR', ref: useRef(null) },
    { title: '8. Data Security', ref: useRef(null) },
    { title: '9. Changes to this Policy', ref: useRef(null) },
    { title: '10. Contact Us', ref: useRef(null) }
  ]

  const termsSections = [
    { title: '1. Introduction', ref: useRef(null) },
    { title: '2. Acceptance of Terms', ref: useRef(null) },
    { title: '3. Use of the App', ref: useRef(null) },
    { title: '4. Prohibited Activities', ref: useRef(null) },
    { title: '5. Termination', ref: useRef(null) },
    { title: '6. Payment and Fees', ref: useRef(null) },
    { title: '7. Disclaimer of Warranties', ref: useRef(null) },
    { title: '8. Limitation of Liability', ref: useRef(null) },
    { title: '9. Changes to the Terms', ref: useRef(null) },
    { title: '10. Contact Us', ref: useRef(null) }
  ]

  const measureSectionPositions = sections => {
    const positions = {}
    sections.forEach((section, index) => {
      section.ref.current.measure((x, y, width, height) => {
        positions[index] = y
        if (Object.keys(positions).length === sections.length) {
          setSectionPositions(positions)
          setIsPositionsReady(true)
        }
      })
    })
  }

  useEffect(() => {
    const sections = selectedTab === 'privacy' ? privacySections : termsSections
    measureSectionPositions(sections)
  }, [selectedTab])

  const handleScrollToSection = index => {
    if (!isPositionsReady) {
      console.log('Positions are not ready yet')
      return
    }

    const yPosition = sectionPositions[index]
    if (yPosition !== undefined) {
      scrollViewRef.current.scrollTo({ y: yPosition, animated: true }, 100)
    }
  }

  const handleScrollViewLayout = event => {
    const { height } = event.nativeEvent.layout
    scrollViewRef.current.scrollTo({ y: 0 }, 100)
    console.log('ScrollView height:', height)
  }

  const handleTabChange = tab => {
    setSelectedTab(tab)
    setIsPositionsReady(false) // Reset positions on tab change
    scrollViewRef.current.scrollTo({ y: 0, animated: false }, 100)
  }

  const renderContent = () => {
    if (selectedTab === 'privacy') {
      return <PrivacyPolicy styles={styles} sections={privacySections} />
    }
    return <TermsConditions styles={styles} sections={termsSections} />
  }

  const renderIndex = () => {
    const sections = selectedTab === 'privacy' ? privacySections : termsSections
    return (
      <View style={[styles.rowWrap, styles.boxShadow, { padding: 10 }]}>
        {sections.map((section, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleScrollToSection(index)}
            style={styles.buttonSmall}
          >
            <Text style={styles.textSmall}>{section.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  return (
    <>
      <View style={[styles.row, { alignSelf: 'center' }]}>
        <TabButton
          label="Privacy Policy"
          isSelected={selectedTab === 'privacy'}
          onPress={() => handleTabChange('privacy')}
          styles={styles}
        />
        <TabButton
          label="Terms & Conditions"
          isSelected={selectedTab === 'terms'}
          onPress={() => handleTabChange('terms')}
          styles={styles}
        />
      </View>

      {renderIndex()}

      <ScrollView
        ref={scrollViewRef}
        onLayout={handleScrollViewLayout}
        contentContainerStyle={[styles.containerLeft, { padding: 20 }]}
        style={{ flex: 1 }}
      >
        {renderContent()}
      </ScrollView>
    </>
  )
}

export default UserAgreementsScreen
