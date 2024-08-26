import { Button } from "react-native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";

const HomeScreen = ({ navigation }) => {
  const styles = useGlobalStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, world!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Press Me</Text>
      </TouchableOpacity>
      {/* Button is deprecated; here for future use to navigate */}
      <Button
        title="Go to Jane's profile"
        onPress={() => navigation.navigate("Profile", { name: "Jane" })}
      />
    </View>
  );
};

export default HomeScreen