import React from "react";
import Svg, { Path } from "react-native-svg";

export default function LogoSvg({ fill="black", width, height }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 1000 244">
      <Path fill={fill} d="M10 10h80v80H10z" />
    </Svg>
  );
}
