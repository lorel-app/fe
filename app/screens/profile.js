import { View, TouchableOpacity, Text, Alert, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { useMediaPicker } from "@/hooks/useMediaPicker";
import api from "@/utils/api";
import SignUpLogInModal from "@/app/Auth";
import AuthContext from "@/utils/authContext";
import { useAlertModal } from "@/hooks/useAlertModal";

const ProfileScreen = () => {
  const styles = useGlobalStyles();
  const showAlert = useAlertModal();
  const [displayPicture, setDisplayPicture] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { isAuthenticated, user, loadUser } = useContext(AuthContext);
  const { image, pickImage } = useMediaPicker();

  const fetchUser = useCallback(async () => {
    if (isAuthenticated && user) {
      setDisplayPicture(user.displayPictureThumb);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

  useEffect(() => {
    const uploadImage = async () => {
      if (image) {
        try {
          const response = await api.updateProfilePic(image);
          if (response.success) {
            const newDisplayPicture = response.data.displayPicture.medium;
            setDisplayPicture(newDisplayPicture);
          } else {
            showAlert("error", response.data.message);
          }
        } catch (error) {
          console.error("Error uploading profile image:", error);
        }
      }
    };

    uploadImage();
  }, [image, fetchUser]);

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <View style={styles.rowSpan}>
          <TouchableOpacity style={styles.row}>
            {displayPicture ? (
              <Image
                source={{ uri: displayPicture }}
                resizeMode="cover"
                style={styles.myProfilePic}
              />
            ) : (
              <Icon name="circle" size={100} style={styles.myProfilePic} />
            )}
            {user ? <Text style={styles.text}>{user.username}</Text> : null}
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={pickImage}>
            <Text>Edit Profile Picture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Please log in or create an account</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Sign Up / Log In</Text>
          </TouchableOpacity>
        </View>
      )}
      <SignUpLogInModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLoginSuccess={loadUser}
      />
    </View>
  );
};

export default ProfileScreen;