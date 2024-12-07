document.addEventListener('DOMContentLoaded', () => {
    console.log('Quiz History Page Loaded.');

    const historyList = document.getElementById('history-list');
    const quizModal = document.getElementById('quiz-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    // Load Quiz History from localStorage
    function loadQuizHistory() {
        const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        if (quizHistory.length === 0) {
            historyList.innerHTML = '<p>No quiz history available.</p>';
            return;
        }

        quizHistory.forEach((quiz, index) => {
            const entry = document.createElement('div');
            entry.classList.add('quiz-entry');
            entry.dataset.index = index;

            // Test Identifier (e.g., Date)
            const testIdentifier = document.createElement('div');
            testIdentifier.classList.add('test-identifier');
            const date = new Date(quiz.date);
            testIdentifier.textContent = `Test Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            entry.appendChild(testIdentifier);

            // Score
            const score = document.createElement('div');
            score.classList.add('score');
            score.textContent = `Score: ${quiz.score}/${quiz.questions.length} (${quiz.percentage}%)`;
            entry.appendChild(score);

            // Accessibility Features
            entry.setAttribute('tabindex', '0');
            entry.setAttribute('role', 'button');
            entry.setAttribute('aria-label', `View details for quiz taken on ${date.toLocaleDateString()}`);

            // Event Listener for Click
            entry.addEventListener('click', () => {
                showQuizDetails(index);
            });

            // Event Listener for Keyboard Interaction
            entry.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    showQuizDetails(index);
                    console.log(`Quiz entry ${index + 1} activated via keyboard.`);
                }
            });

            historyList.appendChild(entry);
            console.log(`Loaded quiz entry ${index + 1}`);
        });
    }

    // Show Quiz Details in Modal
    function showQuizDetails(index) {
        const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        const quiz = quizHistory[index];
        if (!quiz) return;

        modalBody.innerHTML = `
            <p><strong>Date:</strong> ${new Date(quiz.date).toLocaleString()}</p>
            <p><strong>Score:</strong> ${quiz.score}/${quiz.questions.length} (${quiz.percentage}%)</p>
            <hr>
            ${quiz.questions.map((q, idx) => `
                <div class="modal-question">
                    <p><strong>Question ${idx + 1}:</strong> ${q.question}</p>
                    <p><strong>Your Answer:</strong> ${q.selectedAnswer}</p>
                    <p><strong>Correct Answer:</strong> ${q.correctAnswer}</p>
                    <p><em>${q.explanation}</em></p>
                </div>
            `).join('')}
        `;
        quizModal.classList.remove('hidden');
        quizModal.style.display = 'flex';
        console.log(`Displayed details for quiz ${index + 1}`);
    }

    // Close Modal Function
    function closeModal() {
        quizModal.classList.add('hidden');
        quizModal.style.display = 'none';
        console.log('Quiz modal closed.');
    }

    // Event Listener for Close Button
    closeButton.addEventListener('click', closeModal);

    // Close Modal when clicking outside the content
    window.addEventListener('click', (e) => {
        if (e.target === quizModal) {
            closeModal();
            console.log('Quiz modal closed by clicking outside.');
        }
    });

    // Load Quiz History on Page Load
    loadQuizHistory();
});
