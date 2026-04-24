import React, { useState } from "react";
import { View, Button, Image, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

function Upload({ onUpload }) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // Pede permissão para aceder à galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Erro", "Precisamos de permissão para aceder às tuas fotos!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    
    // No React Native, o FormData precisa de um objeto especial para ficheiros
    formData.append("image", {
      uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      // ATENÇÃO: Substitua '192.168.X.X' pelo seu IP real do computador!
      await axios.post("http://192.168.0.20:3001/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      Alert.alert("Sucesso", "Foto do possante enviada!");
      setImage(null);
      onUpload();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "O servidor não respondeu. Verificaste o IP?");
    }
  };

  return (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Button title="Selecionar Foto do Carro" onPress={pickImage} />
      {image && (
        <Image 
          source={{ uri: image.uri }} 
          style={{ width: 200, height: 200, marginVertical: 20, borderRadius: 10 }} 
        />
      )}
      <Button title="Fazer Upload" onPress={handleUpload} color="green" disabled={!image} />
    </View>
  );
}

export default Upload;