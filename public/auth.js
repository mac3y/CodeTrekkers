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

const auth = getAuth(app);


(async function initAuth() {
  try {
    await setPersistence(auth, browserSessionPersistence);
    console.log("Auth persistence set to session");
  } catch (error) {
    console.error("Error setting auth persistence:", error);
  }
})();

function setAuthListeners(onLogin, onLogout){
  onAuthStateChanged(auth, user => {
    if (user) {
      onLogin();
    } else {
      onLogout();
    }
  });
}

// Improved auth state management
function monitorAuthState(callback) {
  return onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user ? "Logged in" : "Logged out");
    callback(user);
  });
}

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (user) {
    // User is logged in
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
  } else {
    // User is logged out
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
  }
});

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

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await signOut(auth);
    alert('You have been logged out successfully.');
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error during logout. Please try again.');
  }
});

export { auth, monitorAuthState, login, logout, setAuthListeners };