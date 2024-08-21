import React, { useState, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import PhoneInput from "react-native-phone-input";
import CountryPicker from "react-native-country-picker-modal";

const InputPhoneNumber = ({ phoneNumber, setPhoneNumber, setCountryCode }) => {
  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false);
  const phoneInput = useRef(null);

  const handleCountrySelect = (country) => {
    const newPhoneNumber = `+${country.callingCode[0]}`;
    setPhoneNumber(newPhoneNumber);
    setCountryCode(country.cca2);
    if (phoneInput.current) {
      phoneInput.current.selectCountry(country.cca2.toLowerCase());
      phoneInput.current.setValue(newPhoneNumber);
    }
    setShowPhoneCountryPicker(false);
  };

  return (
      <View style={styles.phoneInput}>
        <PhoneInput
          ref={phoneInput}
          style={styles.input}
          initialCountry="de"
          onPressFlag={() => setShowPhoneCountryPicker(true)}
          onChangePhoneNumber={setPhoneNumber}
        />
        <CountryPicker
          visible={showPhoneCountryPicker}
          onSelect={handleCountrySelect}
          onClose={() => setShowPhoneCountryPicker(false)}
          withFlagButton={false}
          withCallingCode
          renderFlagButton={() => null}
        />
        <Text style={styles.errorText}>
          {phoneInput.current?.isValidNumber()
            ? ""
            : "Please enter a valid number"}
        </Text>
      </View>
  );
};

const styles = StyleSheet.create({
  phoneInput: {
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: "red",
  },
});

export default InputPhoneNumber;
