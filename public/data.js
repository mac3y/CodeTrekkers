import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDoc, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

async function getComments(cardType, renderFun) {
  const commentsRef = collection(db, `comments-${cardType}`);
  const q = query(commentsRef, orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  const comments = [];
  querySnapshot.forEach((doc) => {
    comments.push({ 
      id: doc.id, 
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    });
  });
  renderFun(comments);
}
  
async function addComment(commentData) {
  try {
    const { cardType, ...comment } = commentData;
    await addDoc(collection(db, `comments-${cardType}`), {
      ...comment,
      timestamp: new Date()
    });
    console.log("Comment added successfully to", cardType);
  } catch (error) {
    console.error("Error adding comment:", error);
  }
  
  await addDoc(collection(db, "comments-country-info"), {
    text: "Test comment",
    userId: "testUser123",
    userEmail: "test@example.com",
    timestamp: new Date()
  });
}
  
async function deleteComment(cardType, commentId) {
  try {
    const commentRef = doc(db, `comments-${cardType}`, commentId);
    await deleteDoc(commentRef);
    console.log("Comment deleted successfully from", cardType);
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
}

console.log("Current user:", auth.currentUser);
  
export { getCountries, getQuizzes, createQuiz, deleteQuiz, getCurrencyRates, getComments, addComment, deleteComment };