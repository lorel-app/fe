# Welcome to Lorel's Frontend 👋

Lorel is a cross-platform React Native [Expo](https://expo.dev) app.

- 🐛 See known bugs: ["Bug List"](https://fair-bunny-6a8.notion.site/30cb87a8564d4a33ae322b51e0f6ac56?v=ce7d72da1f8c4565a6928e8373eb13c5)
  <br/>

## Sitemap

See ["Diagrams"](https://fair-bunny-6a8.notion.site/30cb87a8564d4a33ae322b51e0f6ac56?v=ce7d72da1f8c4565a6928e8373eb13c5) > "Sitemap".
<br/>

## View Web

- [Lorel dev](https://dev.lorel.app)
- [Lorel prod](https://lorel.app)
  <br/>

## View Native

_Built with [EAS](https://docs.expo.dev/build/setup/)_

#### Android

1. 🚧 [Download prod apk](https://dev.lorel.app)
2. 🚧

#### ios

1. 🚧 [Download prod apk](https://dev.lorel.app)
2. 🚧 <br/>

## Run locally

1.  Install dependencies

```bash
npm ci
```

<hr/>
2. Fix country-picker-modal package issue (typo in package.json referencing the wrong folder)

- _on linux / windows with wsl_

```bash
sed -i 's/"module": "[^"]*"/"module": "dist\/react-async-hook.esm.js"/' node_modules/react-native-country-picker-modal/node_modules/react-async-hook/package.json
```

- _on mac_

```bash
sed -i '' 's|"module": "[^"]*"|"module": "dist/react-async-hook.esm.js"|' node_modules/react-native-country-picker-modal/node_modules/react-async-hook/package.json
```

<hr/>
3. Setup environment variables

_see env.template_

<hr/>
4. Start app

#### **Browser**

4.1 Open in new tab

```bash
npm run web
```

_Lorel beta is designed for mobile screen sizes_

#### **Expo Go**

4.1 Install [Expo Go](https://expo.dev/go)
4.2 Start server

```bash
npx expo start
```

4.3 Press 's', then scan the QR code in the terminal
_in the Expo Go app on Android or with the camera on ios_
<br/>

## Run e2e Tests Manually

1. Start local server
   _See previous section_

```bash
npx expo start
```

2. Open a new terminal

Run all tests

```bash
npm run cypress:run
```

Choose specs to test

```bash
npm run cypress
```
