document.addEventListener('DOMContentLoaded', () => {
    console.log('Quiz History Page Loaded.');

    const historyList = document.getElementById('history-list');
    const quizModal = document.getElementById('quiz-modal');
    const modalCloseButton = quizModal.querySelector('.close-button');
    const modalBody = document.getElementById('modal-body');

    // Load quiz history from localStorage
    function loadQuizHistory() {
        const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        if (history.length === 0) {
            historyList.innerHTML = '<p>No quizzes taken yet.</p>';
            return;
        }

        history.forEach((quiz, index) => {
            const quizEntry = document.createElement('div');
            quizEntry.classList.add('quiz-entry');
            quizEntry.setAttribute('tabindex', '0');
            quizEntry.setAttribute('role', 'button');
            quizEntry.setAttribute('aria-label', `View details for quiz taken on ${new Date(quiz.date).toLocaleDateString()}`);
            quizEntry.dataset.index = index; // Optional: to identify the quiz

            const dateP = document.createElement('p');
            dateP.textContent = `Date: ${new Date(quiz.date).toLocaleDateString()} ${new Date(quiz.date).toLocaleTimeString()}`;
            quizEntry.appendChild(dateP);

            const scoreP = document.createElement('p');
            scoreP.textContent = `Score: ${quiz.score}/${quiz.questions.length} (${quiz.percentage}%)`;
            quizEntry.appendChild(scoreP);

            // Add click event to open modal with details
            quizEntry.addEventListener('click', () => {
                displayQuizDetails(quiz);
            });

            // Enable keyboard accessibility
            quizEntry.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    quizEntry.click();
                }
            });

            historyList.appendChild(quizEntry);
            console.log(`Loaded quiz taken on ${quiz.date}`);
        });
    }

    // Display quiz details in modal
    function displayQuizDetails(quiz) {
        modalBody.innerHTML = ''; // Clear previous content

        const scoreP = document.createElement('p');
        scoreP.textContent = `Score: ${quiz.score}/${quiz.questions.length} (${quiz.percentage}%)`;
        modalBody.appendChild(scoreP);

        quiz.questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('modal-question');

            const questionP = document.createElement('p');
            questionP.textContent = `${index + 1}. ${q.question}`;
            questionDiv.appendChild(questionP);

            const answerP = document.createElement('p');
            answerP.textContent = `Your Answer: ${q.selectedAnswer}`;
            answerP.style.color = q.isCorrect ? 'green' : 'red';
            questionDiv.appendChild(answerP);

            const correctP = document.createElement('p');
            correctP.textContent = `Correct Answer: ${q.correctAnswer}`;
            correctP.style.color = 'green';
            questionDiv.appendChild(correctP);

            const explanationP = document.createElement('p');
            explanationP.textContent = q.explanation;
            explanationP.style.fontStyle = 'italic';
            questionDiv.appendChild(explanationP);

            modalBody.appendChild(questionDiv);
        });

        // Show the modal
        quizModal.classList.remove('hidden');
        quizModal.style.display = 'flex';
        console.log('Displayed quiz details in modal.');
    }

    // Close modal when clicking on the close button
    modalCloseButton.addEventListener('click', () => {
        quizModal.classList.add('hidden');
        quizModal.style.display = 'none';
        console.log('Quiz details modal closed.');
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === quizModal) {
            quizModal.classList.add('hidden');
            quizModal.style.display = 'none';
            console.log('Quiz details modal closed by clicking outside.');
        }
    });

    // Initialize
    loadQuizHistory();
});
