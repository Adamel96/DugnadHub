import { EvilIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import SelectImageModal from "./SelectImageModal";

import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function PostForm({ onSave }: { onSave: () => void }) {
  const { user } = useAuth();

  // lagring av skjema-verdier
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [task, setTask] = useState("");
  const [volunteerLimit, setVolunteerLimit] = useState("");

  // styrer datovelger
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  // oppdaterer dato når bruker velger ny
  const onChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  // enkel validering av inputfeltene
  const validate = () => {
    if (!title.trim()) {
      Alert.alert("Manglende tittel", "Du må skrive en tittel.");
      return false;
    }

    if (!description.trim()) {
      Alert.alert("Manglende beskrivelse", "Du må skrive en beskrivelse.");
      return false;
    }

    if (!task.trim()) {
      Alert.alert("Manglende oppgave", "Du må skrive hva som skal gjøres.");
      return false;
    }

    if (!volunteerLimit.trim() || Number(volunteerLimit) <= 0) {
      Alert.alert(
        "Ugyldig antall",
        "Du må skrive hvor mange frivillige som trengs."
      );
      return false;
    }

    if (!image) {
      Alert.alert("Mangler bilde", "Du må legge til et bilde.");
      return false;
    }

    return true;
  };

  // lagrer dugnaden i firestore
  const handleSave = async () => {
    if (!user) {
      Alert.alert("Feil", "Du må være logget inn for å opprette en dugnad.");
      return;
    }

    // sjekk at alt er riktig utfylt
    if (!validate()) return;

    // henter brukernavn til oppretter
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const username = snap.exists() ? snap.data().username : "Ukjent bruker";

    // objektet som lagres i databasen
    const docData = {
      title,
      description,
      task,
      volunteerLimit: Number(volunteerLimit),
      date: date.toISOString(),
      image,
      createdAt: serverTimestamp(),
      createdByUID: user.uid,
      createdByEmail: user.email,
      createdByUsername: username,
      participants: [],
    };

    await addDoc(collection(db, "dugnader"), docData);

    // lukk modalen etter lagring
    onSave();
  };

  return (
    <View style={styles.container}>
      {/* Bildevelger */}
      <Modal visible={isCameraOpen} animationType="slide">
        <SelectImageModal
          closeModal={() => setIsCameraOpen(false)}
          setImage={setImage}
        />
      </Modal>

      <Pressable
        onPress={() => setIsCameraOpen(true)}
        style={styles.addImageBox}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <EvilIcons name="image" size={80} color="gray" />
        )}
      </Pressable>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Tittel"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 84 }]}
        placeholder="Beskrivelse"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Oppgave"
        value={task}
        onChangeText={setTask}
      />

      <TextInput
        style={styles.input}
        placeholder="Antall frivillige"
        keyboardType="numeric"
        value={volunteerLimit}
        onChangeText={setVolunteerLimit}
      />

      {/* Dato */}
      <Pressable style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <EvilIcons name="calendar" size={28} color="gray" />
        <Text style={{ marginLeft: 8 }}>{date.toLocaleString()}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker value={date} mode="datetime" onChange={onChange} />
      )}

      {/* Lagre */}
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lagre</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", padding: 20 },
  addImageBox: {
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 12,
  },
  previewImage: {
    resizeMode: "cover",
    width: "100%",
    height: 300,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
