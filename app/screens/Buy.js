import React, { useContext, useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import HeaderStack from '../navigation/HeaderStack'
import api from '@/utils/api'
import AuthContext from '@/utils/authContext'
import useFormatResponse from '@/hooks/useFormatResponse'

const BuyScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { post = {}, user = {}, showHeader = true } = route.params || {}
  const { user: me } = useContext(AuthContext)
  const [soldStatus, setSoldStatus] = useState(post.sold)
  const { formatDate } = useFormatResponse()

  const handleMarkAsSold = async () => {
    const updatedSoldStatus = !soldStatus
    const response = await api.editPost(post.id, { sold: updatedSoldStatus })
    if (response.success) {
      setSoldStatus(updatedSoldStatus)
    }
  }

  return (
    <>
      {showHeader && (
        <HeaderStack title={`buy from ${user.username}`} user={user} />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: 20 },
          { marginBottom: 70 }
        ]}
      >
        <View style={styles.card}>
          <View style={styles.rowSpan}>
            <Text style={styles.title}>{post.title}</Text>
            <View style={[styles.row, soldStatus && { opacity: 0.5 }]}>
              <Text style={styles.textAccent}>
                {post.price ? post.price : 'No price'}
              </Text>
              <Icon
                name="sell"
                style={[styles.textAccent, { paddingLeft: 5 }]}
              />
            </View>
          </View>
          <View style={[{ width: '100%' }, { padding: 10 }]}>
            <Text style={styles.textBold}>{post.description}</Text>
            <View style={styles.divider}></View>
            <Text style={styles.textBold}>{post.caption}</Text>
          </View>
          <View style={styles.rowWrap}>
            {post.tags?.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.buttonSmall}>
                <Text
                  style={{
                    color:
                      tag.type === 'SUBJECT'
                        ? colors.tertiary
                        : tag.type === 'MEDIUM'
                          ? colors.primary
                          : colors.secondary
                  }}
                >
                  {tag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {post.media.map((item, index) => (
          <View key={index}>
            <Image source={{ uri: item.url }} style={styles.image} />
          </View>
        ))}
        <View style={styles.divider}></View>

        <View style={[styles.rowSpan, { paddingBottom: 0 }, { maxWidth: 500 }]}>
          <Text style={styles.textSmall}>Owner</Text>
          <Text style={styles.textSmall}>Last Edited</Text>
        </View>

        <View
          style={[styles.rowSpan, { paddingBottom: 20 }, { maxWidth: 500 }]}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('User', { user })}
            style={styles.row}
          >
            <Image
              source={{ uri: user.displayPictureThumb }}
              resizeMode="cover"
              style={styles.profilePic}
            />
            <Text style={styles.textBold}>{user.username}</Text>
          </TouchableOpacity>
          <Text style={styles.textBold}>
            {formatDate(post.createdAt, true)}
          </Text>
        </View>

        {me.id === user.id ? (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: soldStatus
                  ? colors.primaryTint
                  : colors.primary
              }
            ]}
            onPress={handleMarkAsSold}
          >
            <View style={[styles.row, { alignSelf: 'center' }]}>
              <Text style={styles.buttonText}>
                {soldStatus ? 'Sold' : 'Mark as sold'}
              </Text>
              <Icon
                name={soldStatus ? 'check-box' : 'check-box-outline-blank'}
                style={styles.iconSmall}
                color={colors.textAlt}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.buttonAbsolute,
          {
            backgroundColor: soldStatus ? colors.primaryTint : colors.primary
          }
        ]}
      >
        <Text style={styles.buttonText}>{soldStatus ? 'Sold' : 'Buy'}</Text>
      </TouchableOpacity>
    </>
  )
}

export default BuyScreen
