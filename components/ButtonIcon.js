import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";

const ButtonIcon = ({
  onPress,
  iconName,
  iconSize,
  iconColor,
  style,
}) => {
    const { colors } = useTheme();
    const effectiveIconColor = iconColor || colors.primary;
    const effectiveIconSize = iconSize || 30;

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Icon
        name={iconName}
        size={effectiveIconSize}
        color={effectiveIconColor}
      />
    </TouchableOpacity>
  );
};

export default ButtonIcon;
