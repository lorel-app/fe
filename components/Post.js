import Icon from "react-native-vector-icons/MaterialIcons";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { useTheme } from "@react-navigation/native";
import ButtonIcon from "./ButtonIcon";

const Post = ({ user, caption, tags, children }) => {
  const styles = useGlobalStyles();
  const { colors } = useTheme();
  return (
    // Needs margin around this view; wait to implement responsiveness
    <View style={styles.post}>
      <View style={styles.rowSpan}>
        <TouchableOpacity style={styles.row}>
          {user.displayPictureThumb ? (
            <Image
              source={{ uri: user.displayPictureThumb }}
              resizeMode="cover"
              style={styles.profilePic}
            />
          ) : (
            <Icon name="circle" size={24} style={styles.profilePic} />
          )}
        <Text style={styles.text}>{user.username}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall}>
          <Text style={styles.text}>Follow</Text>
        </TouchableOpacity>
      </View>

      {children}

      {caption ? <Text style={styles.text}>{caption}</Text> : null}

      <View style={styles.rowSpan}>
        <View style={styles.rowFlex}>
          {tags?.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.buttonSmall}>
              <Text
                style={{
                  color: tag.type === "SUBJECT" ? colors.tertiary : colors.secondary,
                }}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.rowFit}>
          <Text style={styles.text}>999</Text>
          <ButtonIcon
            iconName="chat-bubble-outline"
            onPress={console.log("hi")}
          />
          <ButtonIcon iconName="bookmark-outline" onPress={console.log("hi")} />
          <ButtonIcon iconName="favorite-outline" onPress={console.log("hi")} />
        </View>
      </View>
    </View>
  );
};

export default Post

