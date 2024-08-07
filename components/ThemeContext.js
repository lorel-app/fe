import React from "react";

import { Appearance } from "react-native";

const defaultMode = Appearance.getColorScheme();

export default ThemeContext = React.createContext({
  theme: defaultMode,
});
