import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
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
  Alert,
  Modal,
} from "react-native";

export default function DugnadsDetaljer() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [dugnad, setDugnad] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);

  // 🔥 Hent dugnad fra Firestore
  useEffect(() => {
    const fetchDugnad = async () => {
      try {
        const ref = doc(db, "dugnader", id as string);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          const data = snapshot.data();

          // sørg for at participants alltid er et array
          if (!data.participants) {
            data.participants = [];
          }

          setDugnad(data);
        }
      } catch (err) {
        console.log("Feil ved henting av dugnad:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDugnad();
  }, [id]);

  // 🔥 MELD PÅ
  const handleJoin = async () => {
    if (!user || !dugnad) return;

    const ref = doc(db, "dugnader", id as string);

    await updateDoc(ref, {
      participants: arrayUnion(user.uid),
    });

    setDugnad({
      ...dugnad,
      participants: [...(dugnad.participants || []), user.uid],
    });
  };

  // 🔥 MELD AV
  const handleLeave = async () => {
    if (!user || !dugnad) return;

    const ref = doc(db, "dugnader", id as string);

    await updateDoc(ref, {
      participants: arrayRemove(user.uid),
    });

    setDugnad({
      ...dugnad,
      participants: (dugnad.participants || []).filter(
        (uid: string) => uid !== user.uid
      ),
    });
  };

  // 🔥 SLETT DUGNAD (kun eier)
  const handleDelete = () => {
    if (!user || !dugnad) return;
    if (dugnad.createdByUID !== user.uid) return;

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

  const isOwner = dugnad.createdByUID === user?.uid;
  const isParticipant = (dugnad.participants || []).includes(user?.uid);
  const participantCount = dugnad.participants?.length ?? 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Tilbake */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{"< Tilbake"}</Text>
      </Pressable>

      {/* Bilde */}
      {dugnad.image && (
        <Image source={{ uri: dugnad.image }} style={styles.image} />
      )}

      {/* Tittel + opprettet av */}
      <Text style={styles.title}>{dugnad.title}</Text>
      <Text style={styles.createdBy}>
        Opprettet av: {dugnad.createdByUsername}
      </Text>

      {/* Påmeldingsinfo */}
      <Pressable onPress={() => setShowParticipants(true)}>
        <Text style={styles.participantsText}>
          👥 {participantCount} / {dugnad.volunteerLimit} påmeldt
        </Text>
      </Pressable>

      {/* MELD PÅ / MELD AV – eier kan ikke melde seg på sin egen dugnad (kan endres om du vil) */}
      {!isOwner && (
        <Pressable
          style={isParticipant ? styles.leaveButton : styles.joinButton}
          onPress={isParticipant ? handleLeave : handleJoin}
        >
          <Text style={styles.joinLeaveText}>
            {isParticipant ? "Meld av" : "Meld på"}
          </Text>
        </Pressable>
      )}

      {/* Beskrivelse osv. */}
      <Text style={styles.sectionLabel}>Beskrivelse</Text>
      <Text style={styles.text}>{dugnad.description}</Text>

      <Text style={styles.sectionLabel}>Oppgave</Text>
      <Text style={styles.text}>{dugnad.task}</Text>

      <Text style={styles.sectionLabel}>Dato og tid</Text>
      <Text style={styles.text}>{new Date(dugnad.date).toLocaleString()}</Text>

      {/* 🔥 SLETT-KNAPP KUN FOR EIER */}
      {isOwner && (
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>🗑 Slett dugnad</Text>
        </Pressable>
      )}

      {/* Popup med påmeldte (foreløpig bare UID-er – kan utvides til brukernavn senere) */}
      <Modal visible={showParticipants} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.participantModal}>
            <Text style={styles.modalTitle}>Påmeldte</Text>

            {participantCount > 0 ? (
              dugnad.participants.map((uid: string) => (
                <Text key={uid} style={styles.participantName}>
                  • {uid}
                </Text>
              ))
            ) : (
              <Text>Ingen påmeldte enda</Text>
            )}

            <Pressable
              style={styles.closeModalButton}
              onPress={() => setShowParticipants(false)}
            >
              <Text style={styles.closeModalText}>Lukk</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  container: {
    padding: 20,
    paddingTop: 10,
  },
  backButton: { marginBottom: 20 },
  backText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "500",
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
    marginBottom: 4,
  },
  createdBy: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  participantsText: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "500",
    color: "#333",
  },
  joinButton: {
    backgroundColor: "#2ECC71",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  leaveButton: {
    backgroundColor: "#E67E22",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  joinLeaveText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
  deleteButton: {
    marginTop: 25,
    backgroundColor: "#E74C3C",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  participantModal: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  participantName: { fontSize: 16, marginVertical: 4 },
  closeModalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    alignItems: "center",
  },
  closeModalText: { color: "white", fontWeight: "600" },
});
