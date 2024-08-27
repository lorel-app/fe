import React from "react";
import Post from "./Post";
import { View, Image } from "react-native";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";

const PostShop = ({ user, title, media, price, comment, tags }) => {
  const styles = useGlobalStyles();
  const handlePress = () => {
    console.log("PostShop clicked");
  };
  return (
    <View style={styles.postShop}>
      <Post user={user} title={title} price={price} comment={comment} tags={tags}>
        <View style={styles.postShopMedia}>
          <Image resizeMode="contain" source={media} onPress={handlePress} />
        </View>
      </Post>
    </View>
  );
};

const PostContent = ({ user, media, comment, tags }) => {
  const styles = useGlobalStyles();
  const handlePress = () => {
    console.log("PostContent clicked");
  };
  return (
    <Post user={user} media={media} comment={comment} tags={tags}>
      <Image
        style={styles.postContentMedia}
        resizeMode="cover"
        source={media}
        onPress={handlePress}
      />
    </Post>
  );
};

export { PostShop, PostContent };
