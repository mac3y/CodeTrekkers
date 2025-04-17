import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { 
  getAuth, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence, 
  browserSessionPersistence,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

import {firebaseConfig} from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


(async function initAuth() {
  try {
    await setPersistence(auth, browserSessionPersistence);
    console.log("Authentication persistence set to session");
  } catch (error) {
    console.error("Error setting auth persistence:", error);
  }
})();

async function login(email, password) {
  try {
    await setPersistence(auth, browserSessionPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function register(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

async function logout() {
  try {
    await signOut(auth);
    console.log("User signed out");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export { auth, onAuthStateChanged, signOut };