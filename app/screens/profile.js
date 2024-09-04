import { View, TouchableOpacity, Text, Alert, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useEffect, useState, useCallback } from "react";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { useMediaPicker } from "@/hooks/useMediaPicker";
import api from "@/utils/api";
import SignUpLogInModal from "@/app/Auth";

const ProfileScreen = () => {
  const styles = useGlobalStyles();
  const [user, setUser] = useState(null);
   const [displayPicture, setDisplayPicture] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { image, pickImage } = useMediaPicker();

  const fetchUser = useCallback(async () => {
    const me = await api.getMe();
    console.log(me);
    if (me) {
      setUser(me.username);
      setDisplayPicture(me.displayPicture);
    } else {
      setModalVisible(true);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

    useEffect(() => {
      const uploadImage = async () => {
        if (image) {
          try {
            const response = await api.updateProfilePic(image);
            if (response.success) {
              Alert.alert("Success", "Profile picture updated successfully");
              fetchUser(); 
            } else {
              Alert.alert(
                "Error",
                response.error || "Failed to update profile picture"
              );
            }
          } catch (error) {
            Alert.alert("Error", "An error occurred during the upload");
          }
        }
      };

      uploadImage();
    }, [image]);

  return (
    <View style={styles.post}>
      <View style={styles.rowSpan}>
        <TouchableOpacity style={styles.row}>
          {displayPicture ? (
            <Image source={{ uri: displayPicture }} resizeMode="cover" style={styles.myProfilePic} />
          ) : (
            <Icon name="circle" size={100} style={styles.myProfilePic} />
          )}
          {user ? <Text style={styles.text}>{user}</Text> : null}
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={pickImage}>
          <Text>Edit Profile Picture</Text>
        </TouchableOpacity>
      </View>
      <SignUpLogInModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLoginSuccess={fetchUser}
      />
    </View>
  );
};

export default ProfileScreen
