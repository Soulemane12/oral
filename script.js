document.addEventListener('DOMContentLoaded', () => {
    // Timer functionality
    const timerDisplay = document.getElementById('timer-display');
    const startTimerButton = document.getElementById('start-timer');
    const quadrants = document.querySelectorAll('.quadrant');
    let timerInterval;
    let currentTime = 120; // 2 minutes in seconds
    let currentQuadrant = 0;

    function updateTimer() {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (currentTime % 30 === 0) { // Switch quadrant every 30 seconds
            quadrants.forEach(q => q.classList.remove('active'));
            currentQuadrant = Math.floor((120 - currentTime) / 30);
            if (currentQuadrant < 4) {
                quadrants[currentQuadrant].classList.add('active');
            }
        }
        
        if (currentTime === 0) {
            clearInterval(timerInterval);
            alert('Great job! You\'ve completed your 2-minute brush!');
            resetTimer();
        } else {
            currentTime--;
        }
    }

    function resetTimer() {
        currentTime = 120;
        currentQuadrant = 0;
        quadrants.forEach(q => q.classList.remove('active'));
        timerDisplay.textContent = '2:00';
        startTimerButton.textContent = 'Start Brushing Timer';
        timerInterval = null;
    }

    startTimerButton.addEventListener('click', () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            resetTimer();
        } else {
            startTimerButton.textContent = 'Reset Timer';
            timerInterval = setInterval(updateTimer, 1000);
            quadrants[0].classList.add('active');
        }
    });

    // Tooth diagram interaction
    const toothMap = document.getElementById('tooth-map');
    const toothDescription = document.getElementById('tooth-description');
    
    const toothInfo = {
        'upper-right': 'Upper right quadrant: Contains your upper right molars, premolars, canine, and incisors. Remember to brush the outer, inner, and chewing surfaces.',
        'upper-left': 'Upper left quadrant: Contains your upper left molars, premolars, canine, and incisors. Pay special attention to the hard-to-reach back molars.',
        'lower-left': 'Lower left quadrant: Contains your lower left molars, premolars, canine, and incisors. Don\'t forget to brush along the gum line.',
        'lower-right': 'Lower right quadrant: Contains your lower right molars, premolars, canine, and incisors. Use gentle circular motions when brushing.'
    };

    // Create interactive tooth map
    Object.keys(toothInfo).forEach(quadrant => {
        const div = document.createElement('div');
        div.className = 'tooth-quadrant';
        div.dataset.quadrant = quadrant;
        div.addEventListener('click', () => {
            document.querySelectorAll('.tooth-quadrant').forEach(q => q.style.background = '#e0e0e0');
            div.style.background = '#4CAF50';
            div.style.color = 'white';
            toothDescription.textContent = toothInfo[quadrant];
        });
        toothMap.appendChild(div);
    });

    // Daily tracking functionality
    const saveProgressButton = document.getElementById('save-progress');
    const trackingInputs = document.querySelectorAll('.tracker-item input');

    function saveProgress() {
        const today = new Date().toISOString().split('T')[0];
        const progress = {
            date: today,
            tasks: {}
        };
        
        trackingInputs.forEach(input => {
            progress.tasks[input.id] = input.checked;
        });
        
        // Save to localStorage
        const history = JSON.parse(localStorage.getItem('oralHygieneHistory') || '{}');
        history[today] = progress;
        localStorage.setItem('oralHygieneHistory', JSON.stringify(history));
        
        showSaveConfirmation();
    }

    function showSaveConfirmation() {
        const oldButton = saveProgressButton.textContent;
        saveProgressButton.textContent = '✓ Saved!';
        saveProgressButton.style.background = '#45a049';
        setTimeout(() => {
            saveProgressButton.textContent = oldButton;
            saveProgressButton.style.background = '#4CAF50';
        }, 2000);
    }

    function loadTodayProgress() {
        const today = new Date().toISOString().split('T')[0];
        const history = JSON.parse(localStorage.getItem('oralHygieneHistory') || '{}');
        
        if (history[today]) {
            Object.entries(history[today].tasks).forEach(([id, checked]) => {
                const input = document.getElementById(id);
                if (input) input.checked = checked;
            });
        }
    }

    saveProgressButton.addEventListener('click', saveProgress);
    loadTodayProgress(); // Load today's progress on page load

    // Tab functionality for learn section
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show correct content
            tabContents.forEach(content => {
                content.style.display = content.id === `${tab}-content` ? 'block' : 'none';
            });
        });
    });

    // Quiz functionality
    const quizButton = document.getElementById('quizButton');
    const quizContainer = document.getElementById('quizContainer');
    const quizForm = document.getElementById('quizForm');
    const quizResult = document.getElementById('quizResult');

    quizButton.addEventListener('click', () => {
        quizContainer.classList.toggle('hidden');
        if (!quizContainer.classList.contains('hidden')) {
            quizButton.textContent = 'Hide Quiz';
        } else {
            quizButton.textContent = 'Take the Quiz';
        }
    });

    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let score = 0;
        const answers = quizForm.querySelectorAll('input[type="radio"]:checked');
        
        answers.forEach((answer) => {
            if (answer.value === 'correct') score++;
        });

        const total = 2; // Total number of questions
        const percentage = (score / total) * 100;
        
        let message = `You scored ${score} out of ${total} (${percentage}%)! `;
        if (percentage === 100) {
            message += '🌟 Perfect score! You\'re a dental hygiene expert!';
        } else if (percentage >= 50) {
            message += '👍 Good job! Keep learning to improve your score.';
        } else {
            message += '📚 Keep learning! Review the material and try again.';
        }

        quizResult.textContent = message;
        quizResult.classList.remove('hidden');
        
        // Scroll to result
        quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});