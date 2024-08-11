import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";

const ButtonIcon = ({
  onPress,
  iconName,
  iconSize = 30,
  iconColor,
  style,
}) => {
    const { colors } = useTheme();
    const effectiveIconColor = iconColor || colors.text;

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Icon name={iconName} size={iconSize} color={effectiveIconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});

export default ButtonIcon;
