// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig: getDefaultExpoConfig } = require('expo/metro-config')
const { mergeConfig, getDefaultConfig } = require('@react-native/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const expoConfig = getDefaultExpoConfig(__dirname)
const defaultConfig = getDefaultConfig(__dirname)

let sentryConfig = {
  transformer: {},
  resolver: {
    assetExts: expoConfig.resolver.assetExts,
    sourceExts: expoConfig.resolver.sourceExts
  }
}

if (['dev', 'prod'].includes(process.env.EXPO_PUBLIC_ENV)) {
  const { getSentryExpoConfig } = require('@sentry/react-native/metro')
  sentryConfig = getSentryExpoConfig(__dirname, expoConfig)
}

const { assetExts, sourceExts } = sentryConfig.resolver

const customConfig = {
  transformer: {
    ...sentryConfig.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo')
  },
  resolver: {
    ...sentryConfig.resolver,
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg']
  }
}

module.exports = mergeConfig(defaultConfig, expoConfig, customConfig)
