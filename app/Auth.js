import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import ModalScreen from "@/components/ModalScreen";
import InputPhoneNumber from "@/components/InputPhoneNumber";
import ButtonIcon from "@/components/ButtonIcon"
import Spacer from "@/components/Spacer";
import api from "../utils/api";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";

export default function SignUpLogInModal({ visible, onClose }) {
  const styles = useGlobalStyles();
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
  const [passwordVisible, setPasswordVisible] = useState(false);

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
        const response = await api.signUp({
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
        const response = await api.login({ identity, password });
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

        <View style={styles.inputWithIcon}>
          <TextInput
            style={styles.text}
            placeholder="Password"
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry={!passwordVisible}
          />
          <ButtonIcon
            onPress={() => setPasswordVisible(!passwordVisible)}
            iconName={passwordVisible ? "visibility-off" : "visibility"}
            iconSize={24}
          />
        </View>

        {isSignUp && (
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.text}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
              secureTextEntry={!passwordVisible}
            />
            <ButtonIcon
              onPress={() => setPasswordVisible(!passwordVisible)}
              iconName={passwordVisible ? "visibility-off" : "visibility"}
              iconSize={24}
            />
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
          <Text style={styles.buttonText}>
            {isSignUp ? "Sign Up" : "Log In"}
          </Text>
        </TouchableOpacity>
        <Spacer />
        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.link}>
            {isSignUp ? "I already have an account" : "Create an account"}
          </Text>
        </TouchableOpacity>
      </View>
    </ModalScreen>
  );
}