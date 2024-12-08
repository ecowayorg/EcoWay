const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');

let shuffledQuestions, currentQuestionIndex;

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  setNextQuestion();
});

function startGame() {
  startButton.classList.add('hide');
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove('hide');
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    const img = document.createElement('img');
    img.src = answer.image;
    img.alt = answer.text;
    img.style.width = '100px';
    img.style.height = 'auto';

    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.appendChild(img);
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  clearStatusClass(questionContainerElement);
  nextButton.classList.add('hide');
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target.closest('button');
  const correct = selectedButton.dataset.correct === 'true'; 

  // Muda a cor do botão pressionado
  setStatusClass(selectedButton, correct);
  
  // Atualiza a cor de todos os botões restantes
  Array.from(answerButtonsElement.children).forEach(button => {
    const isCorrect = button.dataset.correct === 'true';
    setStatusClass(button, isCorrect);
  });

  // Reproduz o áudio dependendo da resposta
  if (correct) {
    playAudio('audio/points.mp3');
  } else {
    playAudio('audio/errado.mp3');
  }

  // Exibe o botão "Próxima" ou "Recomeçar"
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    startButton.innerText = 'Recomeçar';
    startButton.classList.remove('hide');
  }
}

function setStatusClass(element, correct) {
  // Limpa qualquer classe anterior
  clearStatusClass(element);
  
  if (correct) {
    element.classList.add('correct');
  } else {
    element.classList.add('wrong');
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
}

function playAudio(audioPath) {
  const audio = new Audio(audioPath);
  audio.play();
}

const questions = [
  {
    question: 'Selecione a melhor opção',
    answers: [
      { text: '4', correct: true, image: 'img/bicycle.png' },
      { text: '22', correct: false, image: 'img/air-pollution.png' }
    ]
  },
  {
    question: 'Selecione a melhor opção',
    answers: [
      { text: 'Web Dev Simplified', correct: false, image: 'img/trash.png' },
      { text: 'Traversy Media', correct: true, image: 'img/recycle-bin.png' }
    ]
  },
  {
    question: 'Selecione a melhor opção',
    answers: [
      { text: 'Kinda', correct: false, image: 'img/water-tap.png' },
      { text: 'YES!!!', correct: true, image: 'img/water-tap2.png' }
    ]
  },
  {
    question: 'Selecione a melhor opção',
    answers: [
      { text: '6', correct: true, image: 'img/solar-panel.png' },
      { text: '8', correct: false, image: 'img/factory.png' }
    ]
  }
];
