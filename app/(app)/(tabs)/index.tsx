import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// firebase-funksjoner

import PostForm from "@/components/PostForm";
import { auth, db } from "@/firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// favorittlogikk

const toggleFavorite = async (dugnadId: string) => {
  if (!auth.currentUser) return false;

  const favRef = doc(db, "favorites", auth.currentUser.uid);
  const favSnap = await getDoc(favRef);

  if (!favSnap.exists()) {
    await setDoc(favRef, {
      dugnadIds: [dugnadId],
    });
    return true;
  } else {
    const currentFavs = favSnap.data().dugnadIds || [];
    const isFavorite = currentFavs.includes(dugnadId);

    if (isFavorite) {
      await updateDoc(favRef, {
        dugnadIds: arrayRemove(dugnadId),
      });
      return false;
    } else {
      await updateDoc(favRef, {
        dugnadIds: arrayUnion(dugnadId),
      });
      return true;
    }
  }
};

export default function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // pull to refresh

  const loadPosts = async () => {
    const q = query(collection(db, "dugnader"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPosts(list);
  };

  // kalles når brukeren trekker ned for å oppdatere

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  // Posts listener

  useEffect(() => {
    const q = query(collection(db, "dugnader"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(list);
    });

    return unsubscribe;
  }, []);

  //  Favorite listener

  useEffect(() => {
    if (!auth.currentUser) return;

    const favRef = doc(db, "favorites", auth.currentUser.uid);
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      if (snapshot.exists()) {
        setFavorites(snapshot.data().dugnadIds || []);
      } else {
        setFavorites([]);
      }
    });

    return unsubscribe;
  }, []);

  const handleToggleFavorite = async (dugnadId: string, e: any) => {
    e.stopPropagation();
    await toggleFavorite(dugnadId);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Hjem",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShadowVisible: true,
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
            color: "#2C3E50",
          },
          headerRight: () => (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsModalOpen(true)}
            >
              <AntDesign name="plus" size={28} color="#4A90E2" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Modal for å opprette ny dugnad */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Opprett dugnad</Text>
            <TouchableOpacity onPress={() => setIsModalOpen(false)}>
              <AntDesign name="close" size={28} color="#7F8C8D" />
            </TouchableOpacity>
          </View>

          <PostForm
            onSave={() => {
              setIsModalOpen(false);
            }}
          />
        </View>
      </Modal>

      {/* Hovedliste med dugnader + pull to refresh */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.postList}
        showsVerticalScrollIndicator={false}
      >
        {/* Vis hvis ingen dugnader finnes */}
        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Ingen dugnader ennå</Text>
            <Text style={styles.emptyText}>
              Trykk på + for å opprette din første dugnad
            </Text>
          </View>
        ) : (
          posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/dugnad/[id]",
                  params: { id: post.id },
                })
              }
            >
              {post.image && (
                <Image
                  source={{ uri: post.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              )}

              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={(e) => handleToggleFavorite(post.id, e)}
              >
                <AntDesign
                  name="heart"
                  size={24}
                  color={
                    favorites.includes(post.id)
                      ? "#E74C3C"
                      : "rgba(255, 255, 255, 0.5)"
                  }
                />
              </TouchableOpacity>

              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.title}>{post.title}</Text>
                  <View style={styles.metaInfo}>
                    <Text style={styles.metaText}>
                      📅{" "}
                      {new Date(post.date).toLocaleDateString("nb-NO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>
                      ⏰{" "}
                      {new Date(post.date).toLocaleTimeString("nb-NO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
                <AntDesign name="right" size={20} color="#BDC3C7" />
              </View>

              {/* Beskrivelse + detaljer */}
              <View style={styles.cardContent}>
                <Text style={styles.description} numberOfLines={2}>
                  {post.description}
                </Text>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>📋</Text>
                    <Text style={styles.detailText} numberOfLines={1}>
                      {post.task}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>👥</Text>
                    <Text style={styles.detailText}>
                      {post.volunteerLimit} frivillige
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Åpen for påmelding</Text>
              </View>
            </TouchableOpacity>
          ))
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
  addButton: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  postList: {
    padding: 20,
    paddingBottom: 30,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#E3F2FD",
  },
  favoriteButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  cardHeaderText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    color: "#7F8C8D",
  },
  metaDot: {
    marginHorizontal: 8,
    color: "#BDC3C7",
  },
  cardContent: {
    padding: 16,
  },
  description: {
    fontSize: 15,
    color: "#34495E",
    lineHeight: 22,
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 10,
    borderRadius: 10,
  },
  detailIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "500",
    flex: 1,
  },
  statusBadge: {
    backgroundColor: "#2ECC71",
    paddingVertical: 10,
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
