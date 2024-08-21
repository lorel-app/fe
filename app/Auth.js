import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import ModalScreen from "@/components/ModalScreen";
import InputPhoneNumber from "@/components/InputPhoneNumber";

export default function SignUpLogInModal({ visible, onClose }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneCountryCode: "DE",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);

  const handleChange = (key, value) => {
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
  };

  const handleFormSubmit = () => {
    const { username, email, phoneNumber, password, confirmPassword } = form;

    if (isSignUp) {
      if (
        !username ||
        !email ||
        !phoneNumber ||
        !password ||
        !confirmPassword
      ) {
        alert("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      // Handle Sign Up
    } else {
      if (!email || !password) {
        alert("Please fill in all fields.");
        return;
      }
      // Handle Log In
    }
    // onClose();
  };

  return (
    <ModalScreen visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>{isSignUp ? "Sign Up" : "Log In"}</Text>

        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={form.username}
            onChangeText={(text) => handleChange("username", text)}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {isSignUp && (
          <InputPhoneNumber
            phoneNumber={form.phoneNumber}
            setPhoneNumber={(text) => handleChange("phoneNumber", text)}
            setCountryCode={(code) => handleChange("phoneCountryCode", code)}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          secureTextEntry
        />

        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
            secureTextEntry
          />
        )}

        <Button
          title={isSignUp ? "Sign Up" : "Log In"}
          onPress={handleFormSubmit}
        />

        <Button
          title={isSignUp ? "Switch to Log In" : "Switch to Sign Up"}
          onPress={() => setIsSignUp(!isSignUp)}
        />

        <Button title="Close" onPress={onClose} />
      </View>
    </ModalScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
});

