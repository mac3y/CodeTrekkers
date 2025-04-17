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

import { firebaseConfig } from "./firebaseConfig.js";

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


function updateAuthUI(user) {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (loginBtn && logoutBtn) {
    const isLoggedIn = !!user;
    loginBtn.style.display = isLoggedIn ? 'none' : 'block';
    logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
  }
}

function initAuthUI() {

  updateAuthUI(auth.currentUser);

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      sessionStorage.setItem('redirectAfterLogin', window.location.href);
      window.location.href = 'login.html';
    });
  }
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await logout();
        window.location.reload();
      } catch (error) {
        console.error('Logout error:', error);
      }
    });
  }
}


function monitorAuthState(callback) {
  return onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user ? "Logged in" : "Logged out");
    updateAuthUI(user);
    if (callback) callback(user);
  });
}


async function login(email, password) {
  try {
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

document.addEventListener('DOMContentLoaded', initAuthUI);

export { auth, monitorAuthState, login, logout, register , updateAuthUI};