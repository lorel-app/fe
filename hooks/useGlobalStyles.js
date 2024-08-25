import { StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export const useGlobalStyles = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      backgroundColor: colors.background,
    },
    headerItems: {
      flexDirection: "row",
      alignItems: "center",
    },
    // temp - add containerLeft/containerCenter?
    container: {
      flex: 1,
      // backgroundColor: colors.elevate,
      padding: 16,
      alignItems: "center",
      width: "100%",
    },
    title: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "500",
      marginBottom: 20,
      textAlign: "center",
    },
    text: {
      color: colors.text,
      fontSize: 16,
      width: "100%",
    },
    errorText: {
      color: colors.accent,
    },
    buttonText: {
      color: colors.textAlt,
      fontSize: 16,
      fontWeight: "500",
      textAlign: "center",
    },
    link: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "500",
      textAlign: "center",
    },
    // add states fro additional styling: onFocus, onBlur, onInputError?
    // https://stackoverflow.com/questions/34087459/focus-style-for-textinput-in-react-native
    input: {
      fontSize: 16,
      backgroundColor: colors.background,
      color: colors.text,
      padding: 10,
      marginBottom: 15,
      // borderColor: colors.primaryTint,
      borderRadius: 10,
      width: "100%",
    },
    inputWithIcon: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: 10,
      marginBottom: 15,
      paddingVertical: 8,
      paddingHorizontal: 10,
      width: "100%",
    },
    button: {
      backgroundColor: colors.primary,
      padding: 10,
      margin: 5,
      borderRadius: 25,
      width: 150,
      alignSelf: "center",
    },
    closeButton: {
      position: "absolute",
      margin: 10,
      top: 5,
      right: 5,
      zIndex: 1,
    },
    modalView: {
      backgroundColor: colors.card,
      margin: 20,
      borderRadius: 20,
      padding: 25,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      width: "80%",
      maxWidth: 500,
    },
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    icon: {
      margin: 5,
    },
    countryPicker: {
      // primaryColor: colors.primary,
      backgroundColor: colors.card,
      onBackgroundTextColor: colors.text,
      fontSize: 16,
      // fontFamily: "Roboto",
      filterPlaceholderTextColor: colors.primary,
      // activeOpacity: 0.1,
      itemHeight: 50,
    },
  });
};
