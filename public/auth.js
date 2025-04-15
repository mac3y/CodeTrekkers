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

import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Set persistence first thing
(async function initAuth() {
  try {
    await setPersistence(auth, browserSessionPersistence);
    console.log("Auth persistence set to session");
  } catch (error) {
    console.error("Error setting auth persistence:", error);
  }
})();

// Improved auth state management
function monitorAuthState(callback) {
  return onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user ? "Logged in" : "Logged out");
    callback(user);
  });
}

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

export { 
  auth, 
  monitorAuthState,
  login,
  logout
};