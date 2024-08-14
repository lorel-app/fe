import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import ModalScreen from "@/components/ModalScreen";

export default function SignUpModal({ visible, onClose }) {
  return (
    <ModalScreen visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        {/* Add your sign-in/sign-up form or buttons here */}
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
});
