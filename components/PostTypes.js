import React from "react";
import Post from "./Post";
import { View, Image, Text } from "react-native";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { SwiperFlatListWithGestureHandler } from "react-native-swiper-flatlist/WithGestureHandler";
import { CustomPagination } from "./Pagination";

const PostShop = ({ user, media, title, price, caption, description, tags }) => {
  const styles = useGlobalStyles();
  const showPagination = media.length > 1;
  const openPost = () => {
    console.log("PostShop clicked");
  };

  return (
    <View style={styles.postShop}>
      <Post
        user={user}
        title={title}
        price={price}
        caption={caption}
        description={description}
        tags={tags}
      >
        <View style={styles.carouselContainer}>
          <SwiperFlatListWithGestureHandler
            data={media}
            renderItem={({ item, index }) => (
              <View style={styles.slide}>
                <Image
                  style={styles.imageShop}
                  source={{ uri: item.uri }}
                  //testID={`container_swiper_renderItem_screen_${index}`}
                  onPress={openPost}
                ></Image>
              </View>
            )}
            showPagination={showPagination}
            PaginationComponent={CustomPagination}
          />
        </View>
        <View style={styles.rowSpan}>
          {title ? <Text style={styles.text}>{title}</Text> : "Untitled"}
          {price ? <Text style={styles.text}>EUR {price}</Text> : "0"}
        </View>
      </Post>
    </View>
  );
};


const PostContent = ({ user, media, caption, tags }) => {
  const styles = useGlobalStyles();
  const showPagination = media.length > 1;

  return (
    <Post user={user} caption={caption} tags={tags}>
      <View style={styles.carouselContainer}>
        <SwiperFlatListWithGestureHandler
          data={media}
          renderItem={({ item, index }) => (
            <View style={styles.slide}>
              <Image
                style={styles.image}
                source={{ uri: item.uri }}
               // testID={`container_swiper_renderItem_screen_${index}`}
              ></Image>
            </View>
          )}
          showPagination={showPagination}
          PaginationComponent={CustomPagination}
        />
      </View>
    </Post>
  );
};

export { PostShop, PostContent };
