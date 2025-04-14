import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDoc, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc 
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

async function getComments(renderFun) {
    const commentsRef = collection(db, 'comments');
    const querySnapshot = await getDocs(commentsRef);
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    renderFun(comments);
}
  
async function addComment(commentData) {
    try {
      await addDoc(collection(db, "comments"), commentData);
      console.log("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
}
  
async function deleteComment(commentId) {
    try {
      const commentRef = doc(db, 'comments', commentId);
      await deleteDoc(commentRef);
      console.log("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
}
  
export { getCountries, getQuizzes, createQuiz, deleteQuiz, getCurrencyRates, getComments, addComment, deleteComment };