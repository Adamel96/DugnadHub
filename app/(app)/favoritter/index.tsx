import { auth, db } from "@/firebase";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useRouter } from "expo-router";
import {
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// skjerm for å vise favoritt-dugnader
export default function FavoritterPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    // referanse til favorittlisten for gjeldende bruker
    const favRef = doc(db, "favorites", auth.currentUser.uid);

    // lytter etter endringer i favorittlisten
    const unsubscribe = onSnapshot(favRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const dugnadIds = data.dugnadIds || [];

        // henter dugnaddata for hver favoritt
        const dugnadPromises = dugnadIds.map(async (id: string) => {
          const dugnadRef = doc(db, "dugnader", id);
          const dugnadSnap = await getDoc(dugnadRef);
          if (dugnadSnap.exists()) {
            return { id: dugnadSnap.id, ...dugnadSnap.data() };
          }
          return null;
        });

        // venter på at alle dugnader skal hentes
        const dugnader = await Promise.all(dugnadPromises);
        // filtrerer ut eventuelle null-verdier
        setFavorites(dugnader.filter((d) => d !== null));
      } else {
        // ingen favoritter funnet
        setFavorites([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // visning av favoritt-dugnader
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Laster...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header-oppsett */}
      <Stack.Screen
        options={{
          title: "Favoritter",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShadowVisible: true,
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
      {/*  Scroll-visning av favorittene */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyTitle}>Ingen favoritter ennå</Text>
            <Text style={styles.emptyText}>
              Merk dugnader som favoritter for å se dem her
            </Text>
          </View>
        ) : (
          favorites.map((dugnad) => (
            <TouchableOpacity
              key={dugnad.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/dugnad/[id]",
                  params: { id: dugnad.id },
                })
              }
            >
              {/* Bilde */}
              {dugnad.image && (
                <Image
                  source={{ uri: dugnad.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              )}

              {/* Header med tittel og dato */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.title}>{dugnad.title}</Text>
                  <View style={styles.metaInfo}>
                    <Text style={styles.metaText}>
                      📅{" "}
                      {new Date(dugnad.date).toLocaleDateString("nb-NO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>
                      ⏰{" "}
                      {new Date(dugnad.date).toLocaleTimeString("nb-NO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
                <AntDesign name="right" size={20} color="#BDC3C7" />
              </View>

              {/* Innhold */}
              <View style={styles.cardContent}>
                <Text style={styles.description} numberOfLines={2}>
                  {dugnad.description}
                </Text>

                {/*  Ekstrainfo */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>📋</Text>
                    <Text style={styles.detailText} numberOfLines={1}>
                      {dugnad.task}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>👥</Text>
                    <Text style={styles.detailText}>
                      {dugnad.volunteerLimit} frivillige
                    </Text>
                  </View>
                </View>
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
  scrollContent: {
    padding: 20,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#7F8C8D",
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
});