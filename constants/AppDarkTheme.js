import { DarkTheme } from '@react-navigation/native'
import { Colors } from './Colors'

const AppDarkTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    background: Colors.black,
    card: '#2E2E2E',
    tint: '#171717',
    accent: Colors.red,
    primary: Colors.blue,
    primaryTint: Colors.blueDark,
    secondary: '#B5BBD1',
    secondaryTint: '#5C6483',
    tertiary: '#E88570',
    text: Colors.white,
    textAlt: Colors.white
  }
}

export default AppDarkTheme
