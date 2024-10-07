import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import React from "react";

import Button from "./Button";

const FileInput = ({
  setImage,
  title = null,
  disable = false,
  aspect = true,
}) => {
  async function handler() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
        aspect: aspect ? [4, 3] : undefined,
      });

      if (result?.assets[0]) {
        const image = result.assets[0];
        const imageUri = "file:///" + image.uri.split("file:/").join("");
        setImage({
          uri: imageUri,
          type: mime.getType(imageUri),
          name: imageUri.split("/").pop(),
        });
      }
    } catch (error) {}
  }

  return (
    <Button
      style={{ width: 150 }}
      onPress={handler}
      disabled={disable}
      title={title || "Choose Image"}
    />
  );
};

export default FileInput;
