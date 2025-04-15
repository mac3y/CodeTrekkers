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

async function getComments(cardType) {
  try {
    const commentsRef = collection(db, `comments-${cardType}`);
    const q = query(commentsRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
  } catch (error) {
    console.error("Error getting comments:", error);
    throw error;
  }
}
  
async function addComment({ cardType, text, userEmail, userId }) {
  try {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }

    const commentData = {
      text,
      userEmail,
      userId,
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, `comments-${cardType}`), commentData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

  
async function deleteComment(cardType, commentId) {
  try {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }

    const commentRef = doc(db, `comments-${cardType}`, commentId);
    const commentDoc = await getDoc(commentRef);

    if (!commentDoc.exists()) {
      throw new Error("Comment not found");
    }
    if (commentDoc.data().userId !== auth.currentUser.uid) {
      throw new Error("User not authorized to delete this comment");
    }

    await deleteDoc(commentRef);
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

console.log("Current user:", auth.currentUser);
  
export { getCountries, getQuizzes, createQuiz, deleteQuiz, getCurrencyRates, getComments, addComment, deleteComment, auth, onAuthStateChanged };