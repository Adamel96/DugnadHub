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
import { useAuth } from "@/hooks/useAuth";

// api
import { uploadImage } from "@/api/uploadImage";
import { createPost } from "@/api/createPost";

export default function PostForm({ onSave }: { onSave: () => void }) {
  const { user } = useAuth();

  // lokalt state for alle inputfelt
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [task, setTask] = useState("");
  const [volunteerLimit, setVolunteerLimit] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  // datoendring fra picker
  const onChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  // enkel validering av alle felt
  const validate = () => {
    if (!title.trim()) {
      Alert.alert("Mangler tittel", "Du må skrive en tittel.");
      return false;
    }

    if (!description.trim()) {
      Alert.alert("Mangler beskrivelse", "Du må skrive en beskrivelse.");
      return false;
    }

    if (!task.trim()) {
      Alert.alert("Mangler oppgave", "Du må skrive hva som skal gjøres.");
      return false;
    }

    if (!volunteerLimit.trim() || Number(volunteerLimit) <= 0) {
      Alert.alert("Ugyldig verdi", "Du må skrive et gyldig antall frivillige.");
      return false;
    }

    if (!image) {
      Alert.alert("Mangler bilde", "Du må legge til et bilde.");
      return false;
    }

    return true;
  };

  // lagring av dugnad
  const handleSave = async () => {
    if (!user) {
      Alert.alert("Feil", "Du må være logget inn for å opprette en dugnad.");
      return;
    }

    // stopp hvis validering feiler
    if (!validate()) return;

    let uploadedUrl: string | null = null;

    // opplasting av bilde
    if (image) {
      try {
        uploadedUrl = await uploadImage(image);
      } catch (e) {
        Alert.alert("Feil", "Kunne ikke laste opp bilde.");
        return;
      }
    }

    // opprett dugnaden
    try {
      await createPost({
        title,
        description,
        task,
        volunteerLimit: Number(volunteerLimit),
        date: date.toISOString(),
        image: uploadedUrl,

        createdByUID: user.uid,
        createdByEmail: user.email,
        createdByUsername: user.email?.split("@")[0] || "ukjent",
      });

      onSave();
    } catch (e) {
      Alert.alert("Feil", "Kunne ikke opprette dugnaden.");
    }
  };

  return (
    <View style={styles.container}>
      {/* bildevelger */}
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

      {/* inputfelt */}
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

      {/* dato */}
      <Pressable style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <EvilIcons name="calendar" size={28} color="gray" />
        <Text style={{ marginLeft: 8 }}>{date.toLocaleString()}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker value={date} mode="datetime" onChange={onChange} />
      )}

      {/* lagre */}
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
