# Welcome to Lorel's Frontend 👋

Lorel is a cross-platform React Native [Expo](https://expo.dev) app.

- 🐛 See known bugs: ["Bug List"](https://fair-bunny-6a8.notion.site/30cb87a8564d4a33ae322b51e0f6ac56?v=ce7d72da1f8c4565a6928e8373eb13c5)
  <br/>

## Sitemap

See ["Diagrams"](https://fair-bunny-6a8.notion.site/30cb87a8564d4a33ae322b51e0f6ac56?v=ce7d72da1f8c4565a6928e8373eb13c5) > "Sitemap".
<br/>

## Structure Overview

- **\_android**: Contains the Android-specific build files and configurations required for running the app on Android devices. Managed automatically by Expo for native builds.

- **\_ios**: Holds iOS-specific build files and configurations necessary for running the app on iOS devices. Similar to `_android`, this is managed by Expo during the build process.

- **\_app**: This is the core of the application where most of the app's logic resides.

  - **screens**: Contains individual screen components representing various app views.
  - **navigation**: Includes navigators (stack, header, tab, etc.) and configuration files for handling app navigation.
  - **screens_static**: Stores static screens that require minimal dynamic interaction used by several entry pages.
  - **web_only_navigation**: Contains navigation files and logic specifically for the web version of the app.
  - **index (and other entry pages)**: Acts as entry points for various sections of the app or for platform-specific entry logic.

- **\_assets**: Holds static assets such as images, fonts, icons, and other media files used throughout the app.

- **\_components**: Houses reusable UI components, including buttons, cards, modals, and other building blocks for the app's user interface.

- **\_constants**: Contains files for theming/colors.

- **\_cypress**: Directory for end-to-end (E2E) tests, including test files and configurations for the Cypress testing framework.

- **\_hooks**: Includes custom React hooks that encapsulate reusable logic. This folder also contains contexts for managing global state and shared functionality.

- **\_utils**: A collection of utility functions and helper modules.
  - **api**: Functions for interacting with Backend.
  - **authContext**: Handles authentication-related logic and context management.
  - **websocket**: Manages real-time communication using WebSocket protocols (interacts with Chat).
    <br/>

## 🌐 View Web

- [Lorel dev](https://dev.lorel.app)
- [Lorel prod](https://lorel.app)
  <br/>

## 📱 View Native

_Built with [EAS](https://docs.expo.dev/build/setup/)_

#### Android

1. [Download this apk](https://dev.lorel.app)
2. 🚧

#### ios

1. Download TestFlight on the App Store
2. [Use this link to access it](https://testflight.apple.com/join/cTU1hbTf)
   <br/>

## 🏠 Run locally

1. Install dependencies

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

_a sandbox that enables you to quickly experiment with building native and web apps_

4.1 Install [Expo Go](https://expo.dev/go)
4.2 Start server

```bash
npx expo start
```

4.3 Press 's', then scan the QR code in the terminal
_in the Expo Go app on Android or with the camera on ios_

**See [ all available options](https://docs.expo.dev/get-started/set-up-your-environment/)**
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
