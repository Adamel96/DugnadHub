import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const toggleFavorite = async (dugnadId: string, userId: string) => {
  if (!userId) return false;

  const favRef = doc(db, "favorites", userId);
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

export default function DugnadsDetaljer() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [dugnad, setDugnad] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const [participantProfiles, setParticipantProfiles] = useState<any[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 🔥 Hent dugnad + deltakere
  useEffect(() => {
    const fetchDugnad = async () => {
      try {
        const ref = doc(db, "dugnader", id as string);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
          setLoading(false);
          return;
        }

        const data = snapshot.data();
        const participants = data.participants || [];

        setDugnad({ ...data, participants });

        // 🔥 HENT BRUKERNAVN FOR DELTAKERE
        const profiles: any[] = [];
        for (let uid of participants) {
          const userRef = doc(db, "users", uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            profiles.push({
              uid,
              username: userSnap.data().username,
              email: userSnap.data().email,
            });
          }
        }

        setParticipantProfiles(profiles);
      } catch (err) {
        console.log("Feil ved henting av dugnad:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDugnad();
  }, [id]);

  // 🔥 Sjekk om dugnad er favoritt
  useEffect(() => {
    if (!user) return;

    const favRef = doc(db, "favorites", user.uid);
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      if (snapshot.exists()) {
        const favorites = snapshot.data().dugnadIds || [];
        setIsFavorite(favorites.includes(id as string));
      } else {
        setIsFavorite(false);
      }
    });

    return unsubscribe;
  }, [user, id]);

  const handleToggleFavorite = async () => {
    if (!user) return;
    await toggleFavorite(id as string, user.uid);
  };

  // 🔥 Påmelding
  const handleJoin = async () => {
    if (!user || !dugnad) return;

    const ref = doc(db, "dugnader", id as string);

    await updateDoc(ref, {
      participants: arrayUnion(user.uid),
    });

    // hent profil for den som meldte seg på
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    const username = userSnap.exists()
      ? userSnap.data().username
      : "Ukjent bruker";

    setDugnad({
      ...dugnad,
      participants: [...dugnad.participants, user.uid],
    });

    setParticipantProfiles([
      ...participantProfiles,
      {
        uid: user.uid,
        username,
        email: user.email,
      },
    ]);
  };

  // 🔥 Avmelding
  const handleLeave = async () => {
    if (!user || !dugnad) return;

    const ref = doc(db, "dugnader", id as string);

    await updateDoc(ref, {
      participants: arrayRemove(user.uid),
    });

    setDugnad({
      ...dugnad,
      participants: dugnad.participants.filter((uid: string) => uid !== user.uid),
    });

    setParticipantProfiles(
      participantProfiles.filter((p) => p.uid !== user.uid)
    );
  };

  // 🔥 Slett dugnad
  const handleDelete = () => {
    Alert.alert(
      "Slett dugnad",
      "Er du sikker på at du vil slette denne dugnaden?",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Slett",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "dugnader", id as string));
            router.replace("/(app)/(tabs)");
          },
        },
      ]
    );
  };

  const isOwner = dugnad?.createdByUID === user?.uid;
  const isParticipant = dugnad?.participants?.includes(user?.uid);
  const participantCount = dugnad?.participants?.length || 0;

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!dugnad) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Kunne ikke finne dugnaden.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER MED TILBAKE OG FAVORITT */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>{"< Tilbake"}</Text>
        </Pressable>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <AntDesign
            name="heart"
            size={28}
            color={isFavorite ? "#E74C3C" : "#BDC3C7"}
          />
        </TouchableOpacity>
      </View>

      {/* BILDE */}
      {dugnad.image && (
        <Image source={{ uri: dugnad.image }} style={styles.image} />
      )}

      {/* TITTEL */}
      <Text style={styles.title}>{dugnad.title}</Text>

      {/* Opprettet av */}
      <Text style={styles.createdBy}>Opprettet av: {dugnad.createdByUsername}</Text>

      {/* Påmeldte */}
      <Pressable onPress={() => setIsPopupOpen(true)} style={styles.participantBox}>
        <Text style={styles.participantText}>
          👥 {participantCount} av {dugnad.volunteerLimit} påmeldt
        </Text>
      </Pressable>

      {/* Påmeldingsknapp */}
      {!isParticipant ? (
        <Pressable style={styles.joinButton} onPress={handleJoin}>
          <Text style={styles.joinButtonText}>Meld meg på</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.leaveButton} onPress={handleLeave}>
          <Text style={styles.leaveButtonText}>Meld meg av</Text>
        </Pressable>
      )}

      {/* Slette-knapp for eier */}
      {isOwner && (
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>🗑 Slett dugnad</Text>
        </Pressable>
      )}

      {/* INFO */}
      <Text style={styles.sectionLabel}>Beskrivelse</Text>
      <Text style={styles.text}>{dugnad.description}</Text>

      <Text style={styles.sectionLabel}>Oppgave</Text>
      <Text style={styles.text}>{dugnad.task}</Text>

      <Text style={styles.sectionLabel}>Dato og tid</Text>
      <Text style={styles.text}>{new Date(dugnad.date).toLocaleString()}</Text>

      {/* POPUP MED PÅMELDTE */}
      <Modal visible={isPopupOpen} animationType="slide" transparent>
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>Påmeldte</Text>

            {participantProfiles.length === 0 ? (
              <Text style={styles.noParticipants}>Ingen påmeldte enda</Text>
            ) : (
              participantProfiles.map((p) => (
                <Text key={p.uid} style={styles.participantName}>
                  • {p.username}
                </Text>
              ))
            )}

            <TouchableOpacity
              style={styles.closePopup}
              onPress={() => setIsPopupOpen(false)}
            >
              <Text style={styles.closePopupText}>Lukk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20, paddingTop: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {},
  backText: { fontSize: 18, color: "#007AFF", fontWeight: "500" },
  favoriteButton: {
    padding: 8,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
  },
  createdBy: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },
  participantBox: {
    padding: 12,
    backgroundColor: "#ECF0F1",
    borderRadius: 8,
    marginBottom: 15,
  },
  participantText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  joinButton: {
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  joinButtonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  leaveButton: {
    backgroundColor: "#E67E22",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  leaveButtonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  deleteText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 17,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 4,
  },
  text: { fontSize: 16, color: "#333", lineHeight: 22 },

  // POPUP
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBox: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  participantName: {
    fontSize: 16,
    marginBottom: 6,
  },
  noParticipants: {
    fontSize: 15,
    color: "#888",
    marginBottom: 10,
  },
  closePopup: {
    marginTop: 20,
    backgroundColor: "#3498DB",
    padding: 12,
    borderRadius: 8,
  },
  closePopupText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});