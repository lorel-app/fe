import { View, Button, Text } from "react-native";

const ProfileScreen = ({ navigation, route }) => {
  return (
    <View>
      <Text>This is {route.params.name}'s profile</Text>
      <Button
        title="Go to Jane's Homepage"
        onPress={() => navigation.navigate("Home", { name: "Jane" })}
      />
    </View>
  );
};

export default ProfileScreen
