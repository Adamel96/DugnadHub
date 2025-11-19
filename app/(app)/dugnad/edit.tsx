import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Alert,
} from "react-native";
import { db } from "@/firebase";
import { EvilIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import SelectImageModal from "@/components/SelectImageModal";
import { uploadImage } from "@/api/uploadImage";

// rediger dugnad-side
export default function EditDugnad() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dugnad, setDugnad] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [task, setTask] = useState("");
  const [volunteerLimit, setVolunteerLimit] = useState("");
  const [date, setDate] = useState(new Date());

  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // henter dugnaddata ved lasting av siden
  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "dugnader", id as string);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        Alert.alert("Feil", "Kunne ikke laste dugnaden.");
        router.back();
        return;
      }

      // oppdater state med hentede data
      const data = snap.data();

      setDugnad(data);
      setTitle(data.title);
      setDescription(data.description);
      setTask(data.task);
      setVolunteerLimit(String(data.volunteerLimit));
      setDate(new Date(data.date));
      setImage(data.image || null);

      setLoading(false);
    };

    load();
  }, [id]);

  // datoendring fra picker
  const onChangeDate = (_e: any, selected?: Date) => {
    setShowPicker(false);
    if (selected) setDate(selected);
  };

  // enkel validering av alle felt
  const validate = () => {
    if (!title.trim()) {
      Alert.alert("Manglende tittel", "Skriv en tittel.");
      return false;
    }
    if (!description.trim()) {
      Alert.alert("Manglende beskrivelse", "Skriv en beskrivelse.");
      return false;
    }
    if (!task.trim()) {
      Alert.alert("Manglende oppgave", "Skriv en oppgave.");
      return false;
    }
    if (!volunteerLimit.trim() || Number(volunteerLimit) <= 0) {
      Alert.alert("Ugyldig antall", "Skriv antall frivillige.");
      return false;
    }
    return true;
  };

  // lagring av endringer
  const handleSave = async () => {
    if (!validate()) return;

    let newImageUrl = dugnad.image;

    if (image && image !== dugnad.image) {
      try {
        newImageUrl = await uploadImage(image);
      } catch (err) {
        console.log("Feil ved opplasting av bilde", err);
      }
    }

    // oppdater dugnad i databasen
    const ref = doc(db, "dugnader", id as string);

    await updateDoc(ref, {
      title,
      description,
      task,
      volunteerLimit: Number(volunteerLimit),
      date: date.toISOString(),
      image: newImageUrl,
    });

    router.back(); // går tilbake til detaljsiden
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Laster...</Text>
      </View>
    );
  }

  // hoved-UI
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rediger dugnad</Text>

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

      <TextInput
        style={styles.input}
        placeholder="Tittel"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 90 }]}
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

      <Pressable style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <EvilIcons name="calendar" size={28} color="gray" />
        <Text style={{ marginLeft: 8 }}>{date.toLocaleString()}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker mode="datetime" value={date} onChange={onChangeDate} />
      )}

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lagre endringer</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addImageBox: {
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 15,
  },
  previewImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
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
    backgroundColor: "#2980B9",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});
