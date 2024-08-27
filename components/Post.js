import Icon from "react-native-vector-icons/MaterialIcons";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { useTheme } from "@react-navigation/native";
import ButtonIcon from "./ButtonIcon";

const Post = ({ user, title, price, comment, tags, children }) => {
  const styles = useGlobalStyles();
  const { colors } = useTheme();
  return (
    // Needs margin around this view; wait to implement responsiveness
    <View style={styles.post}>
      <View style={styles.rowSpan}>
        <TouchableOpacity style={styles.row}>
          <Icon name="circle" size={30} style={styles.profilePic} />
          {user ? <Text style={styles.text}>{user}</Text> : null}
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall}>
          <Text style={styles.text}>Follow</Text>
        </TouchableOpacity>
      </View>

      {children}

      {/* temp */}
      <Icon name="more-horiz" size={30}></Icon>

      <View style={styles.rowSpan}>
        {title ? <Text style={styles.text}>{title}</Text> : null}
        {price ? <Text style={styles.text}>EUR {price}</Text> : null}
      </View>

      {comment ? <Text style={styles.text}>{comment}</Text> : null}

      <View style={styles.rowSpan}>
        <View style={styles.row}>
          {tags?.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.buttonSmall}>
              <Text
                style={{
                  color: tag.type === 1 ? colors.tertiary : colors.secondary,
                }}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>3</Text>
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

