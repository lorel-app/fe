import React, {useState} from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import LogoSvg from "@/assets/images/LogoMain.svg";
import ButtonSwitch from "@/components/ButtonSwitch";
import ButtonIcon from "@/components/ButtonIcon";
import SignUpLogInModal from "@/app/Auth";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";

export default function Header() {
  const { colors } = useTheme();
  const styles = useGlobalStyles();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.header}>
      <LogoSvg fill={colors.secondary} width={250 / 2.5} height={61 / 2.5} />
      <View style={[styles.headerItems]}>
        <ButtonSwitch />
        <ButtonIcon
          iconName="account-circle"
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
