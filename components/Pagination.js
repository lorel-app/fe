import React from 'react'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import { Pagination } from 'react-native-swiper-flatlist'

export const CustomPagination = ({ currentIndex, ...props }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  return (
    <Pagination
      {...props}
      currentIndex={currentIndex}
      paginationStyle={styles.paginationContainer}
      paginationStyleItem={styles.pagination}
      paginationDefaultColor={colors.primaryTint}
      paginationActiveColor={colors.primary}
    />
  )
}
