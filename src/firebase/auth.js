import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./config";

// GOOGLE

const googleProvider =
  new GoogleAuthProvider();

export async function loginWithGoogle() {

  return await signInWithPopup(
    auth,
    googleProvider
  );
}

// SIGNUP

export async function signupUser(
  email,
  password
) {

  return await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
}

// LOGIN

export async function loginUser(
  email,
  password
) {

  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

// LOGOUT

export async function logoutUser() {

  return await signOut(auth);
}