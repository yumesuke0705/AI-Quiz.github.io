let correctCount = 0;
let incorrectCount = 0;

document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      const questions = parseCSV(content);
      displayQuiz(questions);
    };
    reader.readAsText(file);
  }
});

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const questions = [];
  
  lines.forEach(line => {
    const [question, choicesStr, correctAnswer] = line.split(',');
    if (question && choicesStr && correctAnswer) {
      const choices = choicesStr.split(';');
      questions.push({ question, choices, correctAnswer });
    }
  });

  return questions;
}

function displayQuiz(questions) {
  const container = document.getElementById('quizContainer');
  container.innerHTML = '';
  correctCount = 0;
  incorrectCount = 0;

  questions.forEach((q, index) => {
    const questionElem = document.createElement('div');
    questionElem.innerHTML = `<h3>【問${index + 1}】 ${q.question}</h3>`;
    
    const shuffledChoices = [...q.choices];
    shuffledChoices.sort(() => Math.random() - 0.5);

    shuffledChoices.forEach(choice => {
      const choiceElem = document.createElement('button');
      choiceElem.textContent = choice;
      choiceElem.addEventListener('click', () => checkAnswer(choiceElem, choice, q.correctAnswer));
      questionElem.appendChild(choiceElem);
    });
    
    container.appendChild(questionElem);
  });

  // 結果表示用の要素を追加
  const resultSummary = document.createElement('div');
  resultSummary.id = 'resultSummary';
  resultSummary.innerHTML = `<h3>結果</h3><p>正解数: ${correctCount}</p><p>誤答数: ${incorrectCount}</p>`;
  container.appendChild(resultSummary);
}

function checkAnswer(button, selected, correct) {
  const resultElem = document.createElement('div');
  resultElem.className = 'result';
  
  const normalizedSelected = selected.trim().toLowerCase();
  const normalizedCorrect = correct.trim().toLowerCase();

  if (normalizedSelected === normalizedCorrect) {
    resultElem.textContent = '〇 正解：'+normalizedSelected;
    resultElem.classList.add('correct');
    correctCount++;
  } else {
    resultElem.textContent = '× 不正解：'+normalizedSelected;
    resultElem.classList.add('incorrect');
    incorrectCount++;
  }
  
  const resultContainer = document.createElement('div');
  resultContainer.appendChild(resultElem);

  button.parentElement.appendChild(resultContainer);
  button.disabled = true;

  displayResults();
}


function displayResults() {
  const resultSummary = document.getElementById('resultSummary');
  resultSummary.innerHTML = `<h3>結果</h3><h4>正解数: ${correctCount}</h4><h4>誤答数: ${incorrectCount}</h4>`;
}
