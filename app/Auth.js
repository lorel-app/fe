import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import ModalScreen from "@/components/ModalScreen";
import InputPhoneNumber from "@/components/InputPhoneNumber";
import { signUp, login } from "../utils/api";

export default function SignUpLogInModal({ visible, onClose }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    identity: "",
    phoneCountryCode: "DE",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);

  const handleChange = (key, value) => {
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
  };

  const handleFormSubmit = async () => {
    const { username, email, identity, phone, password, confirmPassword } =
      form;

    if (isSignUp) {
      if (!username || !email || !phone || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      try {
        const response = await signUp({
          username,
          email,
          phone,
          password,
        });
        if (response.success) {
          onSignUp(response.data);
        } else {
          alert(response.error);
        }
      } catch (error) {
        alert(response.error);
      }
    } else {
      if (!identity || !password) {
        alert("Please fill in all fields.");
        return;
      }
      try {
        const response = await login({ identity, password });
        if (response.success) {
          onLogin(response.data);
        } else {
          alert(response.error);
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const onSignUp = (data) => {
    console.log("Sign up successful:", data);
    onClose();
  };

  const onLogin = (data) => {
    console.log("Login successful:", data);
    onClose();
  };
  
  return (
    <ModalScreen visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isSignUp ? "Sign Up (Step 1/3)" : "Log In"}
        </Text>

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
          placeholder={isSignUp ? "Email" : "Username or Email"}
          value={isSignUp ? form.email : form.identity}
          onChangeText={
            isSignUp
              ? (text) => handleChange("email", text)
              : (text) => handleChange("identity", text)
          }
        />

        {isSignUp && (
          <InputPhoneNumber
            phoneNumber={form.phone}
            setPhoneNumber={(text) => handleChange("phone", text)}
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