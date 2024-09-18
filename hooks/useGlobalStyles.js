import { StyleSheet, Dimensions } from 'react-native'
import { useTheme } from '@react-navigation/native'

const { width } = Dimensions.get('window')

const shadowStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5 // For Android shadow
}

export const useGlobalStyles = () => {
  const { colors } = useTheme()

  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: colors.background
    },
    headerItems: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    // temp - add containerLeft/containerCenter?
    container: {
      flex: 1,
      padding: 16,
      alignItems: 'center',
      width: width
    },
    containerLeft: {
      flex: 1,
      paddingLeft: 10,
      paddingBottom: 10,
      width: width
    },
    containerFull: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    },
    containerSticky: {
      position: 'absolute',
      zIndex: 1000,
      paddingVertical: 0,
      width: width,
      ...shadowStyle
    },
    title: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '500',
      textAlign: 'center'
    },
    textAccent: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: '500'
    },
    text: {
      color: colors.text,
      fontSize: 14,
      padding: 2
    },
    textCenter: {
      color: colors.text,
      fontSize: 14,
      padding: 2,
      textAlign: 'center'
    },
    textLight: {
      color: colors.secondary,
      fontSize: 12,
      padding: 2
    },
    errorText: {
      color: colors.accent
    },
    buttonText: {
      color: colors.textAlt,
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center'
    },
    link: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center'
    },
    // add states fro additional styling: onFocus, onBlur, onInputError?
    // https://stackoverflow.com/questions/34087459/focus-style-for-textinput-in-react-native
    input: {
      fontSize: 16,
      backgroundColor: colors.background,
      color: colors.text,
      padding: 10,
      //borderColor: colors.primaryTint,
      borderRadius: 10,
      width: '100%'
    },
    inputLight: {
      fontSize: 16,
      backgroundColor: colors.card,
      color: colors.text,
      padding: 10,
      // borderColor: colors.primaryTint,
      borderRadius: 10,
      width: '100%'
    },
    inputWithIcon: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 10,
      width: '100%'
    },
    button: {
      backgroundColor: colors.primary,
      padding: 10,
      margin: 5,
      borderRadius: 25,
      width: 150,
      height: 'auto',
      alignSelf: 'center',
      ...shadowStyle
    },
    buttonSmall: {
      backgroundColor: colors.tint,
      borderRadius: 5,
      paddingHorizontal: 5,
      paddingVertical: 3,
      margin: 3,
      height: 'auto'
    },
    buttonSmallSelected: {
      backgroundColor: colors.card,
      borderRadius: 5,
      paddingHorizontal: 5,
      paddingVertical: 3,
      margin: 3,
      height: 'auto'
    },
    buttonAbsolute: {
      position: 'absolute',
      bottom: 15,
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 25,
      width: 150,
      alignSelf: 'center',
      ...shadowStyle
    },
    closeButton: {
      position: 'absolute',
      margin: 10,
      top: 5,
      right: 5,
      zIndex: 1
    },
    modalView: {
      backgroundColor: colors.card,
      margin: 20,
      borderRadius: 20,
      padding: 25,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      width: '80%',
      maxWidth: 500
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    countryPicker: {
      // primaryColor: colors.primary,
      backgroundColor: colors.card,
      onBackgroundTextColor: colors.text,
      fontSize: 16,
      // fontFamily: "Roboto",
      filterPlaceholderTextColor: colors.primary,
      // activeOpacity: 0.1,
      itemHeight: 50
    },
    // make responsive
    scrollView: {
      alignItems: 'center'
    },

    rowScroll: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 10,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: colors.card,
      paddingBottom: 5
    },
    // make responsive
    post: {
      width: '100%',
      maxWidth: 500,
      alignItems: 'center'
    },

    rowSpan: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: 10
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start'
    },

    rowFlex: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexShrink: 1
    },

    rowFit: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 0,
      margin: 2
      //minWidth: "20%",
    },

    profilePic: {
      margin: 5,
      width: 24,
      height: 24,
      borderRadius: 50
    },
    myProfilePic: {
      margin: 5,
      width: 100,
      height: 100,
      borderRadius: 50
    },
    postShop: {
      backgroundColor: colors.card,
      alignItems: 'center',
      width: width * 0.94,
      maxWidth: 500,
      borderRadius: 25
    },

    carouselContainerShop: {
      width: width,
      height: width * 0.75,
      flex: 1
    },
    carouselContainer: {
      width: width,
      height: width * 0.75,
      flex: 1
    },

    slide: {
      width: width,
      alignItems: 'center'
    },
    imageShop: {
      width: width * 0.8,
      height: width * 0.75,
      resizeMode: 'contain',
      justifyContent: 'flex-end',
      marginBottom: 8,
      ...shadowStyle
    },
    image: {
      width: width,
      height: width * 0.8,
      resizeMode: 'contain',
      justifyContent: 'flex-end',
      marginBottom: 8
    },

    paginationContainer: {
      bottom: 0,
      position: 'relative',
      alignSelf: 'center'
    },
    pagination: {
      borderRadius: 20,
      width: 8,
      height: 8,
      marginHorizontal: 4
    }
  })
}
