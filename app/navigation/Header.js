import React, {useState} from "react";
import { View, Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import LogoSvg from "@/assets/images/LogoMain.svg";
import ButtonSwitch from "@/components/ButtonSwitch";
import ButtonIcon from "@/components/ButtonIcon";
import SignUpLogInModal from "@/app/Auth";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import api from "@/utils/api";

export default function Header() {
  const { colors } = useTheme();
  const styles = useGlobalStyles();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await api.logout();
      if (response.success) {
        Alert.alert("Logged out", "You have been successfully logged out.");
      } else {
        Alert.alert(
          "Logout Failed",
          response.error || "Something went wrong."
        );
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during logout.");
    }
  };

  return (
    <View style={styles.header}>
      <LogoSvg fill={colors.secondary} width={250 / 2.5} height={61 / 2.5} />
      <View style={[styles.headerItems]}>
        <ButtonSwitch />
        <ButtonIcon
          iconName="account-circle"
          onPress={() => setModalVisible(true)}
        />
        <ButtonIcon
          iconName="logout"
          onPress={handleLogout}
        />
      </View>
      <SignUpLogInModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
