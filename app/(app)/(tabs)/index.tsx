import PostForm from "@/components/PostForm";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <Stack.Screen
        options={{
          title: "Hjem",
          headerRight: () => (
            <TouchableOpacity
              style={{ paddingRight: 16 }}
              onPress={() => setIsModalOpen(true)}
            >
              <AntDesign name="plus-square" size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* MODAL */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalContent}>
          <PostForm
            onSave={(postData) => {
              setPosts((prev) => [...prev, postData]);
              setIsModalOpen(false);
            }}
          />

          <TouchableOpacity
            onPress={() => setIsModalOpen(false)}
            style={{ marginTop: 15 }}
          >
            <Text style={{ color: "#412E25" }}>Avbryt</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* LISTE MED POSTER */}
      <ScrollView contentContainerStyle={styles.postList}>
        {posts.map((post, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/dugnad/[id]",
                params: {
                  id: index.toString(),
                  data: JSON.stringify(post),
                },
              })
            }
          >
            {post.image && (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>📸 Bilde lastet opp</Text>
              </View>
            )}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{post.title}</Text>
                <Text>{post.description}</Text>
                <Text>Oppgave: {post.task}</Text>
                <Text>Antall frivillige: {post.volunteerLimit}</Text>
                <Text style={{ marginTop: 6, color: "#777" }}>
                  Dato: {new Date(post.date).toLocaleString()}
                </Text>
              </View>

              {/* PIL SOM VISER AT DEN ER TRYKKBAR */}
              <Text style={styles.arrow}>{">"}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    width: "100%",
    padding: 20,
    marginTop: 50 
  },
  postList: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  arrow: {
    fontSize: 26,
    color: "#888",
    marginLeft: 12,
  },
});
