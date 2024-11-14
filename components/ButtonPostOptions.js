import React, { useContext, useState } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAlertModal } from '@/hooks/useAlertModal'
import { useConfirmModal } from '@/hooks/useConfirmModal'
import AuthContext from '@/utils/authContext'
import DropDownMenu from '@/components/DropDownMenu'
import ReportModal from '@/components/Report'

const ButtonPostOptions = ({
  postId,
  post,
  postIndex,
  userId,
  onDeletePost
}) => {
  const showAlert = useAlertModal()
  const showConfirm = useConfirmModal()
  const { user: me } = useContext(AuthContext)
  const navigation = useNavigation()
  const isPostOwner = userId === me.id
  const [isReportModalVisible, setIsReportModalVisible] = useState(false)

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
      report: () => setIsReportModalVisible(true),
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

  return (
    <View>
      <DropDownMenu
        options={options}
        hasIconButton={'more-vert'}
        onSelect={handleOptionSelect}
      />
      <ReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        id={postId}
        type="POST"
        postIndex={postIndex}
      />
    </View>
  )
}

export default ButtonPostOptions
