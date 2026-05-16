import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmY-JKwjs7pJtIoOnSGIKLxLA4boaQeR8",
  authDomain: "shernicollection-9b1be.firebaseapp.com",
  projectId: "shernicollection-9b1be",
  storageBucket: "shernicollection-9b1be.firebasestorage.app",
  messagingSenderId: "610252838048",
  appId: "1:610252838048:web:407057d36fa94b023da5c5",
  measurementId: "G-16FDK055J6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);