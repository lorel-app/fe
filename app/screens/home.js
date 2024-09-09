import { Button } from "react-native";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { PostShop, PostContent } from "@/components/PostTypes"
import api from "@/utils/api";
import Spacer from "@/components/Spacer";

const HomeScreen = ({ navigation }) => {
  const styles = useGlobalStyles();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.allPosts();
        if (response.success) {
          setPosts(response.data.posts);
          console.log(response);
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Hello, world!</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Press Me</Text>
        </TouchableOpacity>
        {/* Button is deprecated; here for future use to navigate */}
        <Button
          title="Go to Jane's profile"
          onPress={() => navigation.navigate("Profile", { name: "Jane" })}
        />
      </View>

      <View style={styles.scrollView}>
        {posts.map((post, index) => {
          const mediaUrls = post.media.map((m) => ({
            uri: m.url,
            type: m.type,
          }));

          if (post.type === "SHOP") {
            return (
              <React.Fragment key={post.id}>
                <PostShop
                  user={post.user}
                  media={mediaUrls}
                  title={post.title}
                  price={post.price}
                  caption={post.caption}
                  description={post.description}
                  tags={post.tags}
                />
                <Spacer />
              </React.Fragment>
            );
          } else if (post.type === "CONTENT") {
            return (
              <React.Fragment key={post.id}>
                <PostContent
                  user={post.user}
                  media={mediaUrls}
                  caption={post.caption}
                  tags={post.tags}
                />
                <Spacer />
              </React.Fragment>
            );
          }
          return null;
        })}
      </View>
    </ScrollView>
  );
};

export default HomeScreen