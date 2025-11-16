import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import PostForm from "@/components/PostForm";

export default function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View style={styles.titleContainer}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              style={{ paddingRight: 16 }}
              onPress={() => setIsModalOpen(true)} // åpner modal for nytt innlegg
            >
              <AntDesign name="plus-square" size={24} />
            </Pressable>
          ),
        }}
      />

      {/* modal for nytt innlegg */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <PostForm />
            <Pressable onPress={() => setIsModalOpen(false)}>
              <Text style={{ color: "#412E25" }}>Avbryt</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
  },
  modalContent: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    textAlign: "center",
  },
});
