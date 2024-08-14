import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import ModalScreen from "@/components/ModalScreen";

export default function SignUpLogInModal({ visible, onClose }) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isSignUp, setIsSignUp] = useState(false); 

    const handleFormSubmit = () => {
        if (isSignUp) {
            if (!username || !email || !phoneNumber || !password || !confirmPassword) {
                alert("Please fill in all fields.");
                return;
            }
            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }
            // Handle
        } else {
            if (!email || !password) {
                alert("Please fill in all fields.");
                return;
            }
            // Handle
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
              value={username}
              onChangeText={setUsername}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
