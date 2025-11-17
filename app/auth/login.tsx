import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      // Prøv å logge inn i Firebase
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log("Innlogging OK:", cred.user.uid);
  
      // Når innlogging er vellykket → gå til hoved-appen (tabs)
      router.replace("/");
    } catch (err: any) {
      console.log("Login error:", err?.code || err);
      setError("Feil e-post eller passord");
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Logo / Tittel */}
      <Text style={styles.title}>DugnadHub</Text>

      {/* Input-felter */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="E-post"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Passord"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Login-knapp */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Logg inn</Text>
      </TouchableOpacity>

      {/* Registrer deg */}
      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={styles.registerText}>
          Har du ikke konto? Registrer deg
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFA726", // varm dugnad-oransje
    marginBottom: 50,
    letterSpacing: 1.5,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1c1c1c",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "#333",
  },
  loginButton: {
    backgroundColor: "#FFA726",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  loginText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    color: "#FFA726",
    fontSize: 16,
    marginTop: 5,
  },
  errorText: {
    color: "#FF5252",
    marginBottom: 10,
    fontSize: 14,
  },
});
