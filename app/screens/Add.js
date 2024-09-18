import { View, ScrollView, TouchableOpacity, Text, TextInput, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useState, useEffect, useContext } from "react";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import AuthContext from "@/utils/authContext";
import { useMediaPicker } from "@/hooks/useMediaPicker";
import api from "@/utils/api";
import { useAlertModal } from "@/hooks/useAlertModal";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import UnauthenticatedView from "@/components/UnauthenticatedView";

const AddScreen = () => {
  const styles = useGlobalStyles();
  const showAlert = useAlertModal();
  const { isAuthenticated, user, loadUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState("CONTENT");
  const [form, setForm] = useState({
    type: selectedOption,
    media: "",
    title: "",
    price: "",
    caption: "",
    tags: "",
    description: "",
  });

  useFocusEffect(
    React.useCallback(() => {
      setForm({
        type: selectedOption,
        media: "",
        title: "",
        price: "",
        caption: "",
        tags: "",
        description: "",
      });
    }, [selectedOption])
  );

  const handleChange = (key, value) => {
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
  }

  const handlePost = async () => {
    const { type, media, title, price, caption, tags, description } = form;
    // handle if (!media)
    try {
        // const response = await api.post
        showAlert("success", "tried");
        navigation.navigate("Home");
        return;
    } catch {
        showAlert("error", "tried");
        return;
    }
  }

  return isAuthenticated ? (
    <>
      <ScrollView>
        <Text style={styles.textCenter}>What are you posting?</Text>
        <Picker
          selectedValue={selectedOption}
          style={styles.button}
          onValueChange={(itemValue) => {
            setSelectedOption(itemValue);
            handleChange("type", itemValue);
          }}
        >
          <Picker.Item label="Content" value="CONTENT" />
          <Picker.Item
            style={styles.buttonText}
            label="Item for Sale"
            value="SHOP"
          />
        </Picker>

        <View style={styles.container}>
          <Text>Media input goes here</Text>
          {selectedOption === "SHOP" && (
            <TextInput
              style={styles.inputLight}
              placeholder="Title"
              value={form.title}
              onChangeText={(text) => handleChange("title", text)}
            />
          )}
          {selectedOption === "SHOP" && (
            <TextInput
              style={styles.inputLight}
              placeholder="Price"
              value={form.price}
              onChangeText={(text) => handleChange("price", text)}
              keyboardType="numeric"
            />
          )}
          <TextInput
            style={styles.inputLight}
            placeholder="Caption"
            value={form.caption}
            onChangeText={(text) => handleChange("caption", text)}
            multiline={true}
            maxLength={255}
          />
          <Text>Tag selection goes here</Text>
          {selectedOption === "SHOP" && (
            <TextInput
              style={styles.inputLight}
              placeholder="Description"
              value={form.description}
              onChangeText={(text) => handleChange("description", text)}
              multiline={true}
              maxLength={1000}
              numberOfLines={5}
            />
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.buttonAbsolute} onPress={handlePost}>
        <Text style={styles.buttonText}>
          {selectedOption === "SHOP" ? "Add to Shop" : "Add"}
        </Text>
      </TouchableOpacity>
     </>
      ) : (
        <UnauthenticatedView />
  );
};

export default AddScreen;