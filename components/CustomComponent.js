import * as React from "react";

import { useTheme } from "@react-navigation/native";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import SwitchButton from "./SwitchButton";

export default function CustomComponent() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View>
        <Text style={{ fontSize: 16, color: colors.text }}>
          We are working with Dark Mode?!
        </Text>
        <SwitchButton />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
