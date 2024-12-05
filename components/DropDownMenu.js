import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useFocusEffect } from '@react-navigation/native'

const DropDownMenu = ({
  options,
  selectedValue,
  onSelect,
  hasIconButton = null
}) => {
  const { colors } = useTheme()
  const styles = useGlobalStyles()

  const [isOpen, setIsOpen] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setIsOpen(false)
    }, [])
  )

  const handleSelect = value => {
    onSelect(value)
    setIsOpen(false)
  }

  return (
    <View>
      {!hasIconButton ? (
        <TouchableOpacity
          style={[styles.button, styles.rowSpan]}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={[styles.buttonText, { marginLeft: 5 }]}>
            {options.find(option => option.value === selectedValue)?.label ||
              'Select'}
          </Text>
          <Icon
            style={styles.icon}
            name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color={colors.textAlt}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Icon
            style={styles.icon}
            name={isOpen ? 'close' : hasIconButton}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}

      {isOpen && (
        <View style={styles.dropdown}>
          <FlatList
            data={options}
            ItemSeparatorComponent={() => (
              <View style={{ backgroundColor: colors.tint, height: 1 }} />
            )}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[{ padding: 15 }]}
                onPress={() => handleSelect(item.value)}
              >
                <View style={styles.row}>
                  {item.icon ? (
                    <Icon
                      style={[styles.iconSmall, { paddingRight: 5 }]}
                      name={item.icon}
                      size={18}
                      color={
                        item.icon === 'delete'
                          ? colors.tertiary
                          : colors.textAlt
                      }
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.textBold,
                      {
                        color:
                          item.icon === 'delete'
                            ? colors.tertiary
                            : colors.textAlt
                      }
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  )
}

export default DropDownMenu
