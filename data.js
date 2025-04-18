import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
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
from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
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
  
async function addComment(commentText) {
  try {
    const commentData = {
      text: commentText,
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, "comments"), commentData);
    console.log("Comment added successfully");
  } catch (error) {
    console.error("Error adding comment:", error);
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

  
async function deleteComment(commentId) {
  try {
    if (!auth.currentUser) throw new Error("User not authenticated");

    const commentRef = doc(db, "comments", commentId);
    const commentDoc = await getDoc(commentRef);

    if (!commentDoc.exists()) throw new Error("Comment not found");

    // Check if the comment belongs to the current user
    if (auth.currentUser.uid !== commentDoc.data().userId) {
      throw new Error("Not authorized to delete this comment");
    }

    await deleteDoc(commentRef);
    console.log("Comment deleted successfully");
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

async function renderComments() {
  const container = document.getElementById('global-comments-list');
  container.innerHTML = ''; // Clear the container

  try {
    const commentsRef = collection(db, "comments");
    const q = query(commentsRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      container.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
      return;
    }

    querySnapshot.forEach((doc) => {
      const comment = doc.data();
      const commentElement = `
        <div class="comment-card">
          <div class="comment-body">${comment.text}</div>
          <div class="comment-footer">
            <span class="comment-time">${comment.timestamp?.toDate().toLocaleString() || "Just now"}</span>
          </div>
        </div>
      `;
      container.innerHTML += commentElement;
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

console.log("Current user:", auth.currentUser);
  
export { getCountries, getQuizzes, createQuiz, deleteQuiz, getCurrencyRates, getComments, addComment, deleteComment, renderComments };