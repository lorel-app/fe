import React from 'react'
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  Circle,
  Polygon
} from 'react-native-svg'
import icons from './icons'

export default function SocialIcon({ icon, width = 32, height = 32 }) {
  const iconData = icons[icon]

  if (!iconData) {
    console.warn(`Icon ${icon} not found.`)
    return null
  }

  return (
    <Svg width={width} height={height} viewBox="0 0 48 48">
      <Defs>
        {iconData.map((element, index) => {
          if (element.type === 'linearGradient') {
            return (
              <LinearGradient key={index} {...element.props}>
                {element.props.stops.map((stop, stopIndex) => (
                  <Stop key={stopIndex} {...stop} />
                ))}
              </LinearGradient>
            )
          } else if (element.type === 'radialGradient') {
            return (
              <RadialGradient key={index} {...element.props}>
                {element.props.stops.map((stop, stopIndex) => (
                  <Stop key={stopIndex} {...stop} />
                ))}
              </RadialGradient>
            )
          }
          return null
        })}
      </Defs>

      {iconData.map((element, index) => {
        if (element.type === 'path') {
          return <Path key={index} {...element.props} />
        } else if (element.type === 'circle') {
          return <Circle key={index} {...element.props} />
        } else if (element.type === 'polygon') {
          // Add handling for polygon
          return <Polygon key={index} {...element.props} />
        }
        return null
      })}
    </Svg>
  )
}
