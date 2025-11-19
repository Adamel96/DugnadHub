import React, { useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";

type SelectImageModalProps = {
  closeModal: () => void;
  setImage: (image: string) => void;
};

export default function SelectImageModal({
  closeModal,
  setImage,
}: SelectImageModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  if (!permission) {
    // kameratilgang er ikke sjekket ennå
    return <View />;
  }

  if (!permission.granted) {
    // kameratilgang ikke gitt ennå
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  let camera: CameraView | null = null;

  // ta bilde med kameraet
  const captureImage = async () => {
    if (cameraRef.current && isCameraReady) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo.uri) {
        setImage(photo.uri);
        closeModal();
      }
    }
  };

  const pickImage = async () => {
    // åpne bildegalleri
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      closeModal();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        onCameraReady={() => setIsCameraReady(true)}
      />
      {/*Velg bilde fra kamerarull, ta bilde på tlf eller avbryt */}

      <View style={styles.overlayButtons}>
        <TouchableOpacity onPress={pickImage}>
          <Text>Velg bilde</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={captureImage}>
          <Text>Snap!</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={closeModal}>
          <Text>Avbryt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    marginBottom: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  overlayButtons: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
