import React, { useState, useRef } from 'react'
import { View, Text, Platform } from 'react-native'
import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'
import { useTheme } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'

const InputPhoneNumber = ({ phoneNumber, setPhoneNumber, setCountryCode }) => {
  const { colors } = useTheme()
  const styles = useGlobalStyles()
  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false)
  const phoneInput = useRef(null)

  const handleCountrySelect = country => {
    const newPhoneNumber = `+${country.callingCode[0]}`
    setPhoneNumber(newPhoneNumber)
    setCountryCode(country.cca2)
    if (phoneInput.current) {
      phoneInput.current.selectCountry(country.cca2.toLowerCase())
      phoneInput.current.setValue(newPhoneNumber)
    }
    setShowPhoneCountryPicker(false)
  }

  return (
    <View style={styles.inputWithIcon}>
      {/* Fix isFocus state to hide border */}
      {/* https://www.npmjs.com/package/react-native-phone-input */}
      <PhoneInput
        style={[styles.input, { paddingLeft: 10 }, { paddingVertical: 0 }]}
        textStyle={{
          color: colors.text,
          fontSize: 16,
          height: 44,
          borderRadius: 10,
          marginHorizontal: 5,
          outlineStyle: 'none'
        }}
        ref={phoneInput}
        initialCountry="de"
        onPressFlag={() => setShowPhoneCountryPicker(true)}
        onChangePhoneNumber={setPhoneNumber}
        allowZeroAfterCountryCode={false}
        // Doesn't work with initCountry
        // textProps={{
        //   placeholder: "Phone Number",
        // }}
      />
      <CountryPicker
        {...(Platform.OS === 'web' && {
          ariaHideApp: false
        })}
        visible={showPhoneCountryPicker}
        onSelect={handleCountrySelect}
        onClose={() => setShowPhoneCountryPicker(false)}
        renderFlagButton={() => null}
        withEmoji={true}
        withFlag={true}
        theme={styles.countryPicker}
      />
      {/* handle isFocus state */}
      {/* <Text style={styles.errorText}>
        {phoneInput.current?.isValidNumber()
          ? ''
          : 'Please enter a valid number'}
      </Text> */}
    </View>
  )
}

export default InputPhoneNumber
