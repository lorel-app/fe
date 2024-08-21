import React, {useState} from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import LogoSvg from "@/assets/images/LogoMain.svg";
import ButtonSwitch from "@/components/ButtonSwitch";
import ButtonIcon from "@/components/ButtonIcon";
import SignUpLogInModal from "@/app/Auth";

export default function Header() {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <LogoSvg fill={colors.text} width={250 / 2.5} height={61 / 2.5} />
      <View style={[styles.buttons]}>
        <ButtonSwitch />
        <ButtonIcon
          iconName="account-circle"
          iconSize={30}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <SignUpLogInModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
