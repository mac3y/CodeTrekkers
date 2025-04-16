import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  setDoc
} 
from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Comment functions
async function getCountries(renderFun) {
  const countriesRef = collection(db, 'countries');
  const querySnapshot = await getDocs(countriesRef);
  const countries = [];
  querySnapshot.forEach((doc) => {
    countries.push({ id: doc.id, ...doc.data() });
  });
  renderFun(countries);
}

async function getQuizzes(renderFun) {
  const quizzesRef = collection(db, 'quizzes');
  const querySnapshot = await getDocs(quizzesRef);
  const quizzes = [];
  querySnapshot.forEach((doc) => {
    quizzes.push({ id: doc.id, ...doc.data() });
  });
  renderFun(quizzes);
}

async function createQuiz(quizData) {
  try {
    await addDoc(collection(db, "quizzes"), quizData);
    console.log("Quiz created successfully");
  } catch (error) {
    console.error("Error creating quiz:", error);
  }
}

async function deleteQuiz(quizId) {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    await deleteDoc(quizRef);
    console.log("Quiz deleted successfully");
  } catch (error) {
    console.error("Error deleting quiz:", error);
  }
}

async function getCurrencyRates(renderFun) {
  try {
    const response = await fetch('/currencyRates.json');
    const rates = await response.json();
    renderFun(rates);
  } catch (error) {
    console.error("Error fetching currency rates:", error);
  }
}
  
async function addComment({ text, userEmail }) {
  try {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }

    const commentData = {
      text,
      timestamp: serverTimestamp()
    };

    console.log("Saving comment to Firestore:", commentData); // Debug log
    const commentRef = doc(db, `comments`, userEmail); // Use email as document ID
    await setDoc(commentRef, commentData); // Use setDoc to specify the document ID
    console.log("Comment saved with email as ID:", userEmail); // Debug log
    return userEmail;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

async function getComments() {
  try {
    const commentsRef = collection(db, `comments`);
    const q = query(commentsRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id, // The document ID (user's email)
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
  } catch (error) {
    console.error("Error getting comments:", error);
    throw error;
  }
}

  
async function deleteComment(userEmail) {
  try {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }

    if (auth.currentUser.email !== userEmail) {
      throw new Error("User not authorized to delete this comment");
    }

    const commentRef = doc(db, `comments`, userEmail);
    const commentDoc = await getDoc(commentRef);

    if (!commentDoc.exists()) {
      throw new Error("Comment not found");
    }

    await deleteDoc(commentRef);
    console.log(`Comment by ${userEmail} deleted successfully`);
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

console.log("Current user:", auth.currentUser);
  
export { getCountries, getQuizzes, createQuiz, deleteQuiz, getCurrencyRates, getComments, addComment, deleteComment, auth, onAuthStateChanged };