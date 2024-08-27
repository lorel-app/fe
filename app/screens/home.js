import { Button } from "react-native";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { PostShop, PostContent } from "@/components/PostTypes"

const HomeScreen = ({ navigation }) => {
  const styles = useGlobalStyles();

  const mockPosts = [
    {
      user: "artist",
      title: "Title1",
      media: require("@/assets/images/MockShop.png"),
      type: "shop",
      price: "45",
      comment: "Lorem ispum",
      tags: [
        { name: "nature", type: 1 },
        { name: "oil", type: 2 },
        { name: "portrait", type: 1 },
        { name: "pencil", type: 2 },
      ],
    },
    {
      user: "arteest",
      title: "",
      media: require("@/assets/images/MockVideo.png"),
      type: "video",
      price: "",
      comment: "Lorem ispum",
      tags: [
        { name: "landscape", type: 1 },
        { name: "watercolor", type: 2 },
      ],
    },
  ];

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
      {mockPosts.map((post, index) => {
        if (post.type === "shop") {
          return (
            <PostShop
              key={index}
              user={post.user}
              media={post.media}
              title={post.title}
              price={post.price}
              comment={post.comment}
              tags={post.tags}
            />
          );
        } else if (post.type === "video") {
          return (
            <PostContent 
              key={index}
              user={post.user}
              media={post.media}
              comment={post.comment}
              tags={post.tags} />
          );
        }
        return null;
      })}
    </View>
    </ScrollView>
  );
};

export default HomeScreen