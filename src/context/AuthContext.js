import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  auth,
} from "../firebase/config";

// CONTEXT

const AuthContext =
  createContext();

// PROVIDER

export function AuthProvider({
  children,
}) {

  const [currentUser, setCurrentUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // AUTH LISTENER

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {

          setCurrentUser(user);

          setLoading(false);
        }
      );

    return unsubscribe;

  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >

      {!loading &&
        children}

    </AuthContext.Provider>
  );
}

// HOOK

export function useAuth() {

  return useContext(
    AuthContext
  );
}