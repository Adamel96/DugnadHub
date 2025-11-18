import DugnadCard from "@/components/DugnadCard";
import { auth, db } from "@/firebase";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useRouter } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
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

export default function MineDugnaderScreen() {
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "dugnader"),
      where("createdBy", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyPosts(list);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Mine dugnader",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
            color: "#2C3E50",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(app)/(tabs)/profilePage")}
              style={{ paddingHorizontal: 12 }}
            >
              <AntDesign name="left" size={26} color="#2C3E50" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.list}>
        {myPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Ingen dugnader opprettet</Text>
            <Text style={styles.emptyText}>
              Du har ikke opprettet noen dugnader ennå.
            </Text>
          </View>
        ) : (
          myPosts.map((post) => <DugnadCard key={post.id} dugnad={post} />)
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
