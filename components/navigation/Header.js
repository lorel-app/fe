import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import LogoSvg from "@/assets/images/LogoMain.svg";
import ButtonSwitch from "../ButtonSwitch";
import ButtonIcon from "../ButtonIcon"

export default function Header() {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <LogoSvg fill={colors.text} width={250 / 2.5} height={61 / 2.5} />
      <View style={[styles.buttons]}>
        <ButtonSwitch />
        <ButtonIcon
          iconName="account-circle"
          iconSize={30}
          onPress={() => alert("Will open sign-in/up")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
