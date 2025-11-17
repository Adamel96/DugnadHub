import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

// Dette gjør det enkelt å hente context
export const useAuth = () => {
  return useContext(AuthContext);
};
