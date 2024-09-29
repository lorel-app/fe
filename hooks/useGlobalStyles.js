import { StyleSheet, Dimensions } from 'react-native'
import { useTheme } from '@react-navigation/native'

const { width } = Dimensions.get('window')

const shadowStyle = {
  // boxShadow for IOS?
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)',
  elevation: 5
}

export const useGlobalStyles = () => {
  const { colors } = useTheme()

  return StyleSheet.create({
    boxShadow: {
      ...shadowStyle
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: colors.background,
      height: 80
    },
    headerItems: {
      flexDirection: 'row',
      alignItems: 'center'
    },

    container: {
      flex: 1,
      padding: 16,
      alignItems: 'center',
      width: '100%'
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
    containerGrid: {
      padding: 100,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    gridPost: {
      flexBasis: '40%',
      maxWidth: 500,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25
    },

    post: {
      width: width * 0.94,
      alignItems: 'center',
      borderRadius: 25,
      margin: 15
    },

    carouselContainer: {
      width: 500,
      //height: width * 0.75,
      flex: 1
    },

    slide: {
      width: 500,
      alignItems: 'center'
    },

    // STILL NEEDS WORK :( image component?
    image: {
      width: '85%',
      maxWidth: width * 0.85,
      minHeight: 300,
      maxHeight: width * 4,
      resizeMode: 'contain',
      marginBottom: 8
    },
    imageGrid: {
      height: 300,
      width: 300,
      marginBottom: 20,
      borderRadius: 25,
      margin: 15,
      padding: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card
    },
    imageFit: {
      width: '100%',
      height: '100%'
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
      borderRadius: 10,
      marginVertical: 10,
      outlineStyle: 'none',
      width: '100%'
    },
    /// think about it
    inputFocused: {
      fontSize: 16,
      backgroundColor: colors.background,
      color: colors.text,
      padding: 10,
      borderRadius: 10,
      margin: 10,
      borderWidth: 2,
      borderColor: colors.primary,
      outlineStyle: 'border'
    },
    inputLight: {
      fontSize: 16,
      backgroundColor: colors.card,
      color: colors.text,
      padding: 10,
      borderRadius: 10,
      marginVertical: 10,
      width: '100%',
      outlineStyle: 'none',
      flexGrow: 1
    },
    inputWithIcon: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      //backgroundColor: colors.background
      borderRadius: 10,
      width: '100%'
      //paddingVertical: 8,
      // paddingHorizontal: 10
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
      width: '80%',
      maxWidth: 500,
      ...shadowStyle
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

    rowScroll: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 10,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: colors.card,
      paddingBottom: 5
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

    switch: {
      width: 50,
      height: 26,
      borderRadius: 15,
      justifyContent: 'center',
      padding: 5,
      borderWidth: 1,
      borderColor: colors.card
    },
    switchOn: {
      backgroundColor: colors.card
    },
    switchOff: {
      backgroundColor: colors.tint
    },
    thumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      position: 'absolute'
    },
    thumbOn: {
      left: 26
    },
    thumbOff: {
      left: 0
    },
    dropdown: {
      position: 'absolute',
      top: 60,
      left: 0,
      right: 0,
      backgroundColor: colors.secondaryTint,
      borderRadius: 5,
      ...shadowStyle
    }
  })
}
