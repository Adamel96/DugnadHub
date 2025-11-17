import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
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

  useEffect(() => {
    const fetchDugnad = async () => {
      try {
        const ref = doc(db, "dugnader", id as string);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          setDugnad(snapshot.data());
        }
      } catch (err) {
        console.log("Feil ved henting av dugnad:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDugnad();
  }, [id]);

  const handleJoin = async () => {
    if (!user || !dugnad) return;

    const ref = doc(db, "dugnader", id as string);

    await updateDoc(ref, {
      participants: arrayUnion(user.uid),
    });

    setDugnad({
      ...dugnad,
      participants: [...dugnad.participants, user.uid],
    });
  };

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
  const isParticipant = dugnad.participants?.includes(user?.uid);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{"< Tilbake"}</Text>
      </Pressable>

      {dugnad.image && (
        <Image source={{ uri: dugnad.image }} style={styles.image} />
      )}

      <Text style={styles.title}>{dugnad.title}</Text>
      <Text style={styles.createdBy}>Opprettet av: {dugnad.createdByUsername}</Text>

      {/* Påmeldingsinfo */}
      <Pressable onPress={() => setShowParticipants(true)}>
        <Text style={styles.participantsText}>
          👥 {dugnad.participants?.length ?? 0} / {dugnad.volunteerLimit} påmeldt
        </Text>
      </Pressable>

      {/* MELD PÅ / MELD AV */}
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

      <Text style={styles.sectionLabel}>Beskrivelse</Text>
      <Text style={styles.text}>{dugnad.description}</Text>

      <Text style={styles.sectionLabel}>Oppgave</Text>
      <Text style={styles.text}>{dugnad.task}</Text>

      <Text style={styles.sectionLabel}>Dato og tid</Text>
      <Text style={styles.text}>{new Date(dugnad.date).toLocaleString()}</Text>

      {/* Popup med påmeldte */}
      <Modal visible={showParticipants} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.participantModal}>
            <Text style={styles.modalTitle}>Påmeldte</Text>

            {dugnad.participants?.length > 0 ? (
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
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20 },
  backButton: { marginBottom: 20 },
  backText: { fontSize: 18, color: "#007AFF", fontWeight: "500" },

  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },

  title: { fontSize: 26, fontWeight: "bold" },
  createdBy: { marginBottom: 10, color: "#666" },

  participantsText: {
    fontSize: 16,
    marginBottom: 20,
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
    backgroundColor: "#E74C3C",
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

  sectionLabel: { fontSize: 18, fontWeight: "600", marginTop: 16 },
  text: { fontSize: 16, marginTop: 4 },

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

