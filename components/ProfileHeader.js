import React from 'react'
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useNavigation, useTheme } from '@react-navigation/native'
import getAllSocialIcons from '@/assets/images/SocialIcons'
import Icon from 'react-native-vector-icons/MaterialIcons'
import useFormatResponse from '@/hooks/useFormatResponse'

const ProfileHeader = ({ user }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const navigation = useNavigation()
  const socialIcons = getAllSocialIcons(28, 28)
  const { truncate } = useFormatResponse()

  const openLink = url => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL: ', err)
    )
  }

  return (
    <>
      <View>
        <Image
          source={{
            uri: user.coverPicture
          }}
          style={styles.coverPic}
        />
        <Image
          source={{
            uri: user.displayPicture
          }}
          style={styles.profilePicLarge}
        />
      </View>
      <View
        style={[styles.rowSpan, { maxWidth: 600 }, { paddingHorizontal: 25 }]}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('UserFollowers', {
              userId: user.id,
              relationship: 'following'
            })
          }
          style={styles.profileButtons}
        >
          <Text style={styles.textSmall}>Following</Text>
          <Text style={styles.textBold}>{user.followingCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('UserFollowers', {
              userId: user.id,
              relationship: 'followers'
            })
          }
          style={styles.profileButtons}
        >
          <Text style={styles.textSmall}>Followers</Text>
          <Text style={styles.textBold}>{user.followersCount}</Text>
        </TouchableOpacity>
        <View style={styles.profileButtons}>
          <Text style={styles.textSmall}>Likes</Text>
          <Text style={styles.textBold}>{user.totalLikes}</Text>
        </View>
      </View>

      {!user.bio || !user.location || !user.occupation ? null : (
        <View style={[styles.post, { borderRadius: 10 }]}>
          {user.bio ? (
            <View style={{ padding: 5 }}>
              <Text style={styles.text}>{user.bio}</Text>
            </View>
          ) : null}

          <View
            style={[
              styles.rowWrap,
              { alignSelf: 'center' },
              { padding: 5 },
              { marginTop: 5 }
            ]}
          >
            {user.location ? (
              <View style={styles.row}>
                <Icon
                  style={styles.iconSmall}
                  name={'place'}
                  color={colors.secondaryTint}
                />
                <Text style={styles.textSmall}>{user.location}</Text>
              </View>
            ) : null}

            {user.location && user.occupation ? (
              <Text style={[styles.textSmall, { paddingHorizontal: 10 }]}>
                |
              </Text>
            ) : null}

            {user.occupation ? (
              <View style={styles.row}>
                <Icon
                  style={styles.iconSmall}
                  name={'hail'}
                  color={colors.secondaryTint}
                />
                <Text style={styles.textSmall}>{user.occupation}</Text>
              </View>
            ) : null}
          </View>
        </View>
      )}

      <View
        style={[
          styles.rowWrap,
          { marginHorizontal: 10 },
          { paddingBottom: 15 }
        ]}
      >
        {user.links?.length > 0
          ? user.links
              .filter(link => link.type.toLowerCase() !== 'personal')
              .map((link, index) => {
                const iconName = link.type.toLowerCase()
                return (
                  <TouchableOpacity
                    style={{ padding: 3 }}
                    key={index}
                    onPress={() => openLink(link.url)}
                  >
                    {socialIcons[iconName]}
                  </TouchableOpacity>
                )
              })
          : null}
      </View>

      {user.links
        ? (() => {
            const personalLink = user.links.find(
              link => link.type.toLowerCase() === 'personal'
            )

            return personalLink ? (
              <View style={{ paddingBottom: 15 }}>
                <TouchableOpacity
                  onPress={() => openLink(personalLink.url)}
                  style={[styles.row, styles.buttonSmallSelected]}
                >
                  <Icon
                    style={styles.icon}
                    name={'link'}
                    color={colors.secondary}
                  />
                  <Text style={[styles.textSmall, { paddingLeft: 3 }]}>
                    {truncate(personalLink.url)}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          })()
        : null}
    </>
  )
}

export default ProfileHeader
