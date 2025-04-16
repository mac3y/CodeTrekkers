// const firebaseConfig = {
//     apiKey: "AIzaSyDobzEi69_6fx6VsttSEcJCNxTt1-HBEEU",
//     authDomain: "codetrekkerapp.firebaseapp.com",
//     projectId: "codetrekkerapp",
//     storageBucket: "codetrekkerapp.firebasestorage.app",
//     messagingSenderId: "846059095122",
//     appId: "1:846059095122:web:ccb769e315f60aac130b8b",
//     measurementId: "G-TNZYWKBQJE"
// };

// export default firebaseConfig



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDobzEi69_6fx6VsttSEcJCNxTt1-HBEEU",
  authDomain: "codetrekkerapp.firebaseapp.com",
  projectId: "codetrekkerapp",
  storageBucket: "codetrekkerapp.firebasestorage.app",
  messagingSenderId: "846059095122",
  appId: "1:846059095122:web:ccb769e315f60aac130b8b",
  measurementId: "G-TNZYWKBQJE"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth, onAuthStateChanged, signInWithEmailAndPassword, signOut };
// export { auth };
