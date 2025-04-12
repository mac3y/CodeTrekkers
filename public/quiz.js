const questionEl = document.getElementById("question");
const flagEl = document.getElementById("flag");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("scoreDisplay");
const quizSection = document.getElementById("quizSection");
const progressEl = document.getElementById("progress");
const questionNumberEl = document.getElementById("questionNumber");
const currentScoreEl = document.getElementById("currentScore");

const continentSelect = document.getElementById("continentSelect");
const continentDropdown = document.getElementById("continentDropdown");
const startBtn = document.getElementById("startBtn");

let countries = [];
let currentQuestion = {};
let score = 0;
let totalQuestions = 10;
let questionCount = 0;
let questionPool = [];
let reviewLog = [];

startBtn.addEventListener("click", () => {
  const selectedContinent = continentDropdown.value;
  if (!selectedContinent) {
    alert("Please select a continent.");
    return;
  }
  fetchCountries(selectedContinent);
});

async function fetchCountries(continent) {
  const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,region");
  const data = await res.json();
  countries = data.filter(c => c.name && c.flags && c.region === continent);

  if (countries.length === 0) {
    alert("No countries found for selected continent.");
    return;
  }

  continentSelect.style.display = "none";
  quizSection.style.display = "block";
  startQuiz();
}

function startQuiz() {
  score = 0;
  questionCount = 0;
  reviewLog = [];
  questionPool = [...countries];
  shuffleArray(questionPool);
  scoreDisplay.innerText = "";
  nextBtn.disabled = true;
  restartBtn.style.display = "none";
  loadQuestion();
}

function loadQuestion() {
  questionNumberEl.innerText = `(${questionCount + 1} of ${totalQuestions})`;
  currentScoreEl.innerText = `(Score: ${score})`;
  nextBtn.disabled = true;
  feedbackEl.innerText = "";
  optionsEl.innerHTML = "";
  flagEl.style.display = "none";

  const correct = questionPool.pop(); // grab and remove next question
  if (!correct) {
    endQuiz();
    return;
  }

  questionCount++;
  currentQuestion = { correct };

  // pick 3 wrong options that are not the correct one
  const incorrect = countries.filter(c => c.name.common !== correct.name.common);
  shuffleArray(incorrect);
  const choices = [correct, ...incorrect.slice(0, 3)];

  shuffleArray(choices);

  questionEl.innerText = "Which country does this flag belong to?";
  flagEl.src = correct.flags.svg;
  flagEl.style.display = "block";

  choices.forEach(c => createOptionButton(c.name.common, c.name.common));
}

function createOptionButton(label, countryName) {
  const btn = document.createElement("button");
  btn.innerText = label;
  btn.onclick = () => checkAnswer(countryName);
  optionsEl.appendChild(btn);
}

function checkAnswer(selectedName) {
  const correctName = currentQuestion.correct.name.common;
  const buttons = optionsEl.querySelectorAll("button");

  buttons.forEach(btn => btn.disabled = true);

  const isCorrect = selectedName === correctName;

  if (isCorrect) {
    score++;
    feedbackEl.innerText = "✅ Correct!";
  } else {
    feedbackEl.innerText = `❌ Wrong! Correct answer: ${correctName}`;
  }

  // ✅ Update score display after scoring
  currentScoreEl.innerText = `(Score: ${score})`;

  reviewLog.push({
    flag: currentQuestion.correct.flags.svg,
    yourAnswer: selectedName,
    correctAnswer: correctName,
    isCorrect: isCorrect
  });

  nextBtn.disabled = false;
}

function nextQuestion() {
  if (questionCount < totalQuestions) {
    loadQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  questionEl.innerText = "Quiz Complete!";
  flagEl.style.display = "none";
  optionsEl.innerHTML = "";
  feedbackEl.innerText = `Your score: ${score} / ${totalQuestions}`;
  scoreDisplay.innerText = "";
  nextBtn.disabled = true;
  nextBtn.style.display = "none";
  restartBtn.style.display = "inline-block";

  // Create review table
  const table = document.createElement("table");
  table.style.margin = "20px auto";
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.innerHTML = `
    <tr>
      <th>Flag</th>
      <th>Your Answer</th>
      <th>Correct Answer</th>
    </tr>
  `;

  reviewLog.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${entry.flag}" style="width: 50px; border: 1px solid #0F0E47;"></td>
      <td style="color: ${entry.isCorrect ? 'green' : 'red'}">${entry.yourAnswer}</td>
      <td>${entry.correctAnswer}</td>
    `;
    table.appendChild(row);
  });

  optionsEl.appendChild(table);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", () => {
  quizSection.style.display = "none";
  continentSelect.style.display = "block";
});