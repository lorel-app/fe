import React, { useContext } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
// import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useAlertModal } from '@/hooks/useAlertModal'
import { useConfirmModal } from '@/hooks/useConfirmModal'
import AuthContext from '@/utils/authContext'
import DropDownMenu from '@/components/DropDownMenu'

const ButtonPostOptions = ({ postId, post, userId, onDeletePost }) => {
  const showAlert = useAlertModal()
  const showConfirm = useConfirmModal()
  const { user: me } = useContext(AuthContext)
  const navigation = useNavigation()
  const isPostOwner = userId === me.id

  const options = isPostOwner
    ? [
        { label: 'Edit post', value: 'edit_post', icon: 'edit' },
        { label: 'Delete post', value: 'delete_post', icon: 'delete' }
      ]
    : [
        { label: 'Message', value: 'message', icon: 'message' },
        { label: 'Report', value: 'report', icon: 'priority-high' }
      ]

  const handleOptionSelect = value => {
    const actionsMap = {
      message: () => navigation.navigate('Message', { userId }),
      report: () => unImplemented(),
      edit_post: () => navigation.navigate('EditPost', { post }),
      delete_post: () => {
        showConfirm('Are you sure you want to delete this post?', async () => {
          await onDeletePost(postId)
        })
      }
    }

    const action = actionsMap[value]
    if (action) {
      action()
    } else {
      showAlert('error', 'Something went wrong, please try again later')
    }
  }

  const unImplemented = () => {
    showAlert('error', 'This will be available in a future release')
  }

  return (
    <View>
      <DropDownMenu
        options={options}
        hasIconButton={'more-vert'}
        onSelect={handleOptionSelect}
      />
    </View>
  )
}

export default ButtonPostOptions
