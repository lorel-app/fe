import { StyleSheet, Dimensions, Platform } from 'react-native'
import { useState, useEffect } from 'react'
import { useTheme } from '@react-navigation/native'

const windowDimensions = Dimensions.get('window')
const screenDimensions = Dimensions.get('screen')

// test
const shadowStyle = {
  ...(Platform.OS === 'web' && {
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)'
  }),
  ...(Platform.OS === 'ios' && {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  }),
  ...(Platform.OS === 'android' && {
    elevation: 5
  })
}

export const useGlobalStyles = () => {
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions
  })

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        setDimensions({ window, screen })
      }
    )
    return () => subscription?.remove()
  }, [])

  const width = Math.min(dimensions.window.width, 600)
  const fullWidth = dimensions.window.width
  const height = dimensions.window.height

  const { colors } = useTheme()

  return StyleSheet.create({
    boxShadow: {
      ...shadowStyle
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      backgroundColor: colors.background,
      height: 60
    },
    headerItems: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },

    height: {
      height: height - 60
    },

    loader: {
      width: width,
      padding: 50
    },

    container: {
      // ANDROID IS NOT A FAN OF FLEX
      // flex: 1,
      // paddingHo: 16,
      alignItems: 'center',
      width: '100%'
    },
    containerLeft: {
      flex: 1,
      paddingLeft: 10,
      paddingBottom: 10,
      width: '100%'
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
      paddingHorizontal: 10,
      width: '100%',
      ...shadowStyle
    },
    containerGrid: {
      width: fullWidth / 3,
      height: fullWidth / 3,
      padding: 2
    },

    post: {
      width: width * 0.95,
      backgroundColor: colors.card,
      alignItems: 'center',
      borderRadius: 25,
      margin: 15,
      padding: 10,
      flex: 1,
      ...shadowStyle
    },

    card: {
      width: width * 0.95,
      backgroundColor: colors.card,
      alignItems: 'center',
      borderRadius: 10,
      margin: 15,
      padding: 10
    },

    carouselContainer: {
      width: width,
      flexGrow: 1
    },
    slide: {
      width: width,
      alignItems: 'center'
    },
    image: {
      width: width * 0.95,
      minHeight: width,
      resizeMode: 'contain'
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
    textSmall: {
      color: colors.text,
      fontSize: 12,
      padding: 2
    },
    textBold: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '500',
      padding: 0
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
    icon: {
      // required for Android
      fontSize: 26,
      margin: 3
    },
    iconSmall: {
      // required for Android
      fontSize: 18,
      margin: 3
    },
    input: {
      fontSize: 16,
      backgroundColor: colors.background,
      color: colors.text,
      padding: 10,
      borderRadius: 10,
      marginVertical: 10,
      outlineStyle: 'none',
      width: '100%',
      minWidth: '100%'
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
      // can remoe this on Android
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
    modalChildren: {
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center'
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
      flex: 1,
      flexShrink: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start'
    },

    rowWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      margin: 0
    },

    rowEnd: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      alignSelf: 'flex-end',
      marginLeft: 15
    },

    divider: {
      height: 1,
      backgroundColor: colors.primaryTint,
      width: width * 0.9,
      maxWidth: 700,
      margin: 10
    },

    profilePic: {
      margin: 5,
      width: 24,
      height: 24,
      borderRadius: 50,
      backgroundColor: colors.tint
    },

    profilePicLarge: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50,
      top: 150,
      left: '50%',
      transform: [{ translateX: -50 }],
      borderWidth: 3,
      borderColor: colors.secondaryTint,
      backgroundColor: colors.tint
    },
    coverPic: {
      width: fullWidth,
      maxWidth: 900,
      height: 200,
      resizeMode: 'cover',
      marginBottom: 50,
      backgroundColor: colors.card
      // borderBottomWidth: 3
    },
    profileButtons: {
      width: width / 6,
      alignItems: 'center'
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
      width: 200,
      right: 0,
      // make primaryTint lighter for light mode
      backgroundColor: colors.primaryTint,
      borderRadius: 10,
      ...shadowStyle
    },
    editButton: {
      position: 'absolute',
      top: 15,
      right: 15,
      alignSelf: 'center',
      padding: 2,
      borderRadius: 500,
      // make primaryTint lighter for light mode
      //backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backgroundColor: colors.primaryTint,
      ...shadowStyle
    },

    sendBarInput: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 8,
      backgroundColor: colors.tint
    },
    barInput: {
      flex: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: 16,
      backgroundColor: colors.background,
      color: colors.text,
      outlineStyle: 'none'
    }
  })
}
