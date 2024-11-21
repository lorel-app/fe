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

function renderIcon(iconData, width = 28, height = 28) {
  if (!iconData) return null

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
          return <Polygon key={index} {...element.props} />
        }
        return null
      })}
    </Svg>
  )
}

export default function getAllSocialIcons(width, height) {
  const renderedIcons = {}

  Object.keys(icons).forEach(iconName => {
    const iconData = icons[iconName]
    renderedIcons[iconName] = renderIcon(iconData, width, height)
  })

  return renderedIcons
}
