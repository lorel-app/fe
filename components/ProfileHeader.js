import React from 'react'
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import SocialIcon from '@/assets/images/SocialIcons'

const ProfileHeader = ({ user }) => {
  const styles = useGlobalStyles()
  console.log(user)
  // bio
  // coverPicture
  // link []
  // location
  // occupation

  // temp
  const mockuser = {
    mocklinks: [
      { type: 'facebook', url: 'https://www.facebook.com/user' },
      { type: 'instagram', url: 'https://www.instagram.com/user' },
      { type: 'linkedIn', url: 'https://www.linkedin.com/in/user' },
      { type: 'tikTok', url: 'https://www.tiktok.com/@user' },
      { type: 'youtube', url: 'https://www.youtube.com/user' }
    ]
  }

  const openLink = url => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL: ', err)
    )
  }

  return (
    <>
      <View>
        <Image source={{ uri: user.displayPicture }} style={styles.coverPic} />
        <Image
          source={{ uri: user.displayPicture }}
          style={styles.profilePicLarge}
        />
      </View>
      <View
        style={[styles.rowSpan, { maxWidth: 600 }, { paddingHorizontal: 25 }]}
      >
        <TouchableOpacity style={styles.profileButtons}>
          <Text style={styles.textBold}>Following</Text>
          <Text style={styles.textBold}>{user.followingCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileButtons}>
          <Text style={styles.textBold}>Followers</Text>
          <Text style={styles.textBold}>{user.followersCount}</Text>
        </TouchableOpacity>
        <View style={styles.profileButtons}>
          <Text style={styles.textBold}>Likes</Text>
          <Text style={styles.textBold}>{user.totalLikes}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        {mockuser.mocklinks && mockuser.mocklinks.length > 0
          ? mockuser.mocklinks.map((link, index) => (
              <TouchableOpacity key={index} onPress={() => openLink(link.url)}>
                <SocialIcon icon={link.type} />
              </TouchableOpacity>
            ))
          : null}
      </View>
    </>
  )
}

export default ProfileHeader
