import DugnadCard from "@/components/DugnadCard";
import { auth, db } from "@/firebase";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useRouter } from "expo-router";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// skjerm for viste deltatte dugnader
export default function DeltatteDugnaderScreen() {
  const [participatedPosts, setParticipatedPosts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "dugnader"),
      where("participants", "array-contains", auth.currentUser.uid)
    );

    // realtime lytter for deltatte dugnader
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setParticipatedPosts(list);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Deltatte dugnader",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
            color: "#2C3E50",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingHorizontal: 12 }}
            >
              <AntDesign name="left" size={26} color="#2C3E50" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.list}>
        {participatedPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>Ingen deltatte dugnader</Text>
            <Text style={styles.emptyText}>
              Du har ikke meldt deg på noen dugnader ennå.
            </Text>
          </View>
        ) : (
          participatedPosts.map((post) => <DugnadCard key={post.id} dugnad={post} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
  },
});