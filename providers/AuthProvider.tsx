import { createContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface UserProfile {
  username: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // ---- HENT PROFIL ----
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          // ---- LAG PROFIL HVIS FØRSTE GANG ----
          await setDoc(ref, {
            email: firebaseUser.email,
            username: firebaseUser.displayName ?? "Ukjent bruker",
            photoURL: firebaseUser.photoURL ?? null,
          });
          setProfile({
            email: firebaseUser.email!,
            username: firebaseUser.displayName ?? "Ukjent bruker",
            photoURL: firebaseUser.photoURL ?? undefined,
          });
        } else {
          setProfile(snap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
