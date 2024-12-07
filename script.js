document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed.');

    /* ------------------------------
       Utility Function to Get CSS Variables
    ------------------------------ */
    function getCSSVariable(variable) {
        const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
        console.log(`CSS Variable ${variable}: ${value}`);
        return value;
    }

    /* ------------------------------
       Hamburger Menu Toggle
    ------------------------------ */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !expanded);
        navLinks.classList.toggle('active');
        console.log(`Menu toggled. Expanded: ${!expanded}`);
    });

    // Enable keyboard accessibility for the menu toggle
    menuToggle.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            menuToggle.click();
            console.log(`Menu toggled via keyboard. Key pressed: ${e.key}`);
        }
    });

    /* ------------------------------
       Dropdown Menu Functionality
    ------------------------------ */
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownMenu = toggle.nextElementSibling;
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isExpanded);
            dropdownMenu.classList.toggle('active');
            console.log(`Dropdown toggled. Expanded: ${!isExpanded}`);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target)) {
                toggle.setAttribute('aria-expanded', 'false');
                const dropdownMenu = toggle.nextElementSibling;
                dropdownMenu.classList.remove('active');
                console.log('Dropdown closed by clicking outside.');
            }
        });

        // Enable keyboard accessibility for dropdown
        toggle.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                toggle.click();
                console.log(`Dropdown toggled via keyboard. Key pressed: ${e.key}`);
            }
        });
    });

    /* ------------------------------
       Timer Functionality
    ------------------------------ */
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
        console.log(`Timer updated: ${minutes}:${seconds.toString().padStart(2, '0')}`);

        if (currentTime % 30 === 0 && currentTime !== 0) { // Switch quadrant every 30 seconds
            quadrants.forEach(q => q.classList.remove('active'));
            currentQuadrant = Math.floor((120 - currentTime) / 30);
            if (currentQuadrant < quadrants.length) {
                quadrants[currentQuadrant].classList.add('active');
                console.log(`Switched to quadrant ${currentQuadrant + 1}: ${quadrants[currentQuadrant].textContent}`);
            }
        }

        if (currentTime === 0) {
            clearInterval(timerInterval);
            alert('Great job! You\'ve completed your 2-minute brush!');
            console.log('Timer completed.');
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
        startTimerButton.setAttribute('aria-pressed', 'false');
        timerInterval = null;
        console.log('Timer reset.');
    }

    startTimerButton.addEventListener('click', () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            resetTimer();
            console.log('Timer stopped by user.');
        } else {
            startTimerButton.textContent = 'Reset Timer';
            startTimerButton.setAttribute('aria-pressed', 'true');
            timerInterval = setInterval(updateTimer, 1000);
            quadrants[0].classList.add('active');
            console.log('Timer started.');
        }
    });

    /* ------------------------------
       Tooth Diagram Interaction
    ------------------------------ */
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
        div.setAttribute('tabindex', '0');
        div.setAttribute('role', 'button');
        div.setAttribute('aria-pressed', 'false');
        div.setAttribute('aria-label', `Click to learn about the ${quadrant.replace('-', ' ')} quadrant`);
        
        div.addEventListener('click', () => {
            console.log(`Quadrant clicked: ${quadrant}`);
            document.querySelectorAll('.tooth-quadrant').forEach(q => {
                q.style.background = getCSSVariable('--background-light');
                q.style.color = getCSSVariable('--text-dark');
                q.setAttribute('aria-pressed', 'false');
            });
            div.style.background = getCSSVariable('--primary-color');
            div.style.color = getCSSVariable('--text-light');
            div.setAttribute('aria-pressed', 'true');
            toothDescription.textContent = toothInfo[quadrant];
            console.log(`Displayed information for ${quadrant}: ${toothInfo[quadrant]}`);
        });

        div.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                div.click();
                console.log(`Quadrant toggled via keyboard: ${quadrant}`);
            }
        });

        toothMap.appendChild(div);
    });

    /* ------------------------------
       Daily Tracking Functionality
    ------------------------------ */
    const saveProgressButton = document.getElementById('save-progress');
    const trackingInputs = document.querySelectorAll('.tracker-item input');
    const progressTracking = document.getElementById('progress-tracking');
    const progressHistory = document.getElementById('progress-history');

    function saveProgress() {
        console.log('Saving progress...');
        const today = new Date().toISOString().split('T')[0];
        const progress = {
            date: today,
            tasks: {}
        };
        
        trackingInputs.forEach(input => {
            progress.tasks[input.id] = input.checked;
            console.log(`Task ${input.id}: ${input.checked}`);
        });
        
        // Save to localStorage under 'oralHygieneHistory'
        const hygieneHistory = JSON.parse(localStorage.getItem('oralHygieneHistory') || '{}');
        hygieneHistory[today] = progress;
        localStorage.setItem('oralHygieneHistory', JSON.stringify(hygieneHistory));
        console.log('Progress saved to localStorage:', hygieneHistory);

        showSaveConfirmation();
        updateProgressHistory();
        awardBadges();
    }

    function showSaveConfirmation() {
        console.log('Showing save confirmation.');
        const oldButton = saveProgressButton.textContent;
        saveProgressButton.textContent = '✓ Saved!';
        saveProgressButton.style.background = '#45a049';
        setTimeout(() => {
            saveProgressButton.textContent = 'Save Today\'s Progress';
            saveProgressButton.style.background = getCSSVariable('--primary-color');
            console.log('Save confirmation reset.');
        }, 2000);
    }

    function loadTodayProgress() {
        console.log('Loading today\'s progress...');
        const today = new Date().toISOString().split('T')[0];
        const hygieneHistory = JSON.parse(localStorage.getItem('oralHygieneHistory') || '{}');
        console.log('Retrieved hygieneHistory from localStorage:', hygieneHistory);
        
        if (hygieneHistory[today]) {
            Object.entries(hygieneHistory[today].tasks).forEach(([id, checked]) => {
                const input = document.getElementById(id);
                if (input) {
                    input.checked = checked;
                    console.log(`Loaded task ${id}: ${checked}`);
                }
            });
        } else {
            console.log('No progress found for today.');
        }
    }

    function updateProgressHistory() {
        console.log('Updating progress history...');
        const hygieneHistory = JSON.parse(localStorage.getItem('oralHygieneHistory') || '{}');
        const sortedDates = Object.keys(hygieneHistory).sort((a, b) => new Date(b) - new Date(a));
        progressHistory.innerHTML = ''; // Clear existing history
        console.log('Sorted dates:', sortedDates);

        sortedDates.forEach(date => {
            const progress = hygieneHistory[date];
            const li = document.createElement('li');
            li.textContent = `${date}: ${Object.values(progress.tasks).filter(v => v).length} tasks completed`;
            progressHistory.appendChild(li);
            console.log(`Added to history list: ${li.textContent}`);
        });

        if (sortedDates.length > 0) {
            progressTracking.classList.remove('hidden');
            console.log('Progress tracking section is now visible.');
        } else {
            progressTracking.classList.add('hidden');
            console.log('No progress history to display.');
        }
    }

    /* ------------------------------
       Badge Functionality
    ------------------------------ */
    function awardBadges() {
        console.log('Checking for badge awards...');
        const badges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
        const hygieneHistory = JSON.parse(localStorage.getItem('oralHygieneHistory') || '{}');
        const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        const totalDays = Object.keys(hygieneHistory).length;
        console.log(`Total days tracked: ${totalDays}`);
        console.log(`Total quizzes taken: ${quizHistory.length}`);

        // Example Badge: Consistent Tracking (e.g., 7 days)
        if (totalDays >= 7 && !badges.includes('Consistent Tracker')) {
            badges.push('Consistent Tracker');
            localStorage.setItem('earnedBadges', JSON.stringify(badges));
            displayBadge('Consistent Tracker');
            console.log('Awarded badge: Consistent Tracker');
        }

        // Example Badge: Quiz Master (e.g., score >= 80%)
        if (quizHistory.length > 0) {
            const lastQuiz = quizHistory[quizHistory.length - 1];
            console.log('Last quiz score:', lastQuiz.score);
            if (lastQuiz.score >= 80 && !badges.includes('Quiz Master')) {
                badges.push('Quiz Master');
                localStorage.setItem('earnedBadges', JSON.stringify(badges));
                displayBadge('Quiz Master');
                console.log('Awarded badge: Quiz Master');
            }
        }
    }

    function displayBadge(badge) {
        console.log(`Displaying badge: ${badge}`);
        const badgesSection = document.getElementById('badges');
        if (!badgesSection) {
            console.warn('Badges section not found.');
            return; // Prevent errors if badges section doesn't exist
        }

        const badgeContainer = badgesSection.querySelector('.badge-container') || createBadgeContainer(badgesSection);
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge';
        badgeElement.textContent = badge;
        badgeContainer.appendChild(badgeElement);
        badgesSection.classList.remove('hidden');
        console.log(`Badge ${badge} added to the UI.`);
    }

    function createBadgeContainer(parent) {
        console.log('Creating badge container.');
        const container = document.createElement('div');
        container.className = 'badge-container';
        parent.appendChild(container);
        return container;
    }

    function loadBadges() {
        const badges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
        if (badges.length > 0) {
            badges.forEach(badge => {
                displayBadge(badge);
                console.log(`Loaded badge: ${badge}`);
            });
        } else {
            console.log('No badges earned yet.');
        }
    }

    /* ------------------------------
       Tab Functionality for Learn Section
    ------------------------------ */
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            console.log(`Tab clicked: ${tab}`);
            
            // Update active button
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            // Show correct content
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            const activeContent = document.getElementById(`${tab}-content`);
            if (activeContent) {
                activeContent.classList.add('active');
                console.log(`Displayed content for tab: ${tab}`);
            }
        });
    });

    /* ------------------------------
       Quiz Functionality
    ------------------------------ */
    const quizSection = document.querySelector('#quiz');
    const quizButton = document.getElementById('quizButton');
    const quizResult = document.getElementById('quizResult');

    // Create Quiz Container
    const quizContainerElement = document.createElement('div');
    quizContainerElement.id = 'quizContainer';
    quizContainerElement.classList.add('quiz-container', 'hidden');
    quizSection.appendChild(quizContainerElement);
    console.log('Quiz container initialized.');

    const quizForm = document.createElement('form');
    quizForm.id = 'quizForm';
    quizContainerElement.appendChild(quizForm);
    console.log('Quiz form created and appended.');

    // Initialize MutationObserver after quizContainer exists
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (quizContainerElement.classList.contains('hidden')) {
                    resetQuiz();
                    console.log('Quiz hidden. Resetting quiz.');
                }
            }
        }
    });

    observer.observe(quizContainerElement, { attributes: true });

    // 10 Quiz Questions
    const questions = [
        {
            question: "How long should you brush your teeth?",
            options: [
                { text: "30 seconds", value: "incorrect", explanation: "Brushing for only 30 seconds is insufficient to clean all tooth surfaces thoroughly." },
                { text: "1 minute", value: "incorrect", explanation: "One minute is better, but the recommended duration is two minutes for optimal cleaning." },
                { text: "2 minutes", value: "correct", explanation: "Brushing for two minutes ensures that all areas of your teeth are properly cleaned." },
                { text: "3 minutes", value: "incorrect", explanation: "While 3 minutes is thorough, two minutes is the recommended duration for effective brushing." }
            ]
        },
        {
            question: "How often should you floss your teeth?",
            options: [
                { text: "Once a week", value: "incorrect", explanation: "Flossing once a week is not frequent enough to remove plaque between teeth." },
                { text: "Daily", value: "correct", explanation: "Daily flossing helps remove plaque and food particles that brushing alone can't reach." },
                { text: "Twice a month", value: "incorrect", explanation: "Twice a month is insufficient for maintaining optimal interdental hygiene." },
                { text: "Never", value: "incorrect", explanation: "Not flossing can lead to plaque buildup, cavities, and gum disease." }
            ]
        },
        {
            question: "What tool is best for removing plaque between teeth?",
            options: [
                { text: "Toothbrush", value: "incorrect", explanation: "While toothbrushes clean tooth surfaces, floss is more effective for interdental areas." },
                { text: "Dental Floss", value: "correct", explanation: "Dental floss effectively removes plaque and food particles between teeth where toothbrushes can't reach." },
                { text: "Mouthwash", value: "incorrect", explanation: "Mouthwash can reduce bacteria but doesn't remove plaque mechanically like flossing does." },
                { text: "Toothpicks", value: "incorrect", explanation: "Toothpicks are less effective and can sometimes damage gums compared to dental floss." }
            ]
        },
        {
            question: "Which of the following is a common symptom of gum disease?",
            options: [
                { text: "Tooth sensitivity", value: "incorrect", explanation: "Tooth sensitivity can be caused by various factors, not exclusively gum disease." },
                { text: "Swollen gums", value: "correct", explanation: "Swollen gums are a common symptom of gum disease, indicating inflammation." },
                { text: "Bad breath", value: "incorrect", explanation: "While bad breath can be associated with gum disease, it's not as direct as swollen gums." },
                { text: "All of the above", value: "incorrect", explanation: "Only swollen gums are directly indicative of gum disease among the options." }
            ]
        },
        {
            question: "How often should you replace your toothbrush?",
            options: [
                { text: "Every month", value: "incorrect", explanation: "Replacing your toothbrush monthly is more frequent than necessary." },
                { text: "Every 3-4 months", value: "correct", explanation: "It's recommended to replace your toothbrush every 3-4 months or sooner if the bristles are frayed." },
                { text: "Once a year", value: "incorrect", explanation: "Waiting a year to replace your toothbrush can reduce its effectiveness." },
                { text: "Every two weeks", value: "incorrect", explanation: "Replacing your toothbrush every two weeks is unnecessarily frequent." }
            ]
        },
        {
            question: "What is the primary purpose of fluoride in toothpaste?",
            options: [
                { text: "To freshen breath", value: "incorrect", explanation: "While fluoride can contribute to overall oral health, its primary purpose is not to freshen breath." },
                { text: "To whiten teeth", value: "incorrect", explanation: "Fluoride does not have whitening properties; it's used for strengthening teeth." },
                { text: "To strengthen enamel", value: "correct", explanation: "Fluoride helps strengthen tooth enamel and prevent cavities." },
                { text: "To kill bacteria", value: "incorrect", explanation: "While fluoride has some antibacterial properties, its main role is enamel strengthening." }
            ]
        },
        {
            question: "Which of the following foods can contribute to tooth decay?",
            options: [
                { text: "Apples", value: "incorrect", explanation: "Apples are generally healthy, but excessive consumption can contribute to decay due to natural sugars." },
                { text: "Cheese", value: "incorrect", explanation: "Cheese can actually help neutralize acids in the mouth and protect teeth." },
                { text: "Candy", value: "correct", explanation: "Candy, especially sticky and sugary types, can contribute significantly to tooth decay." },
                { text: "Carrots", value: "incorrect", explanation: "Carrots are healthy for teeth as they stimulate saliva production." }
            ]
        },
        {
            question: "How does smoking affect oral health?",
            options: [
                { text: "Increases risk of gum disease", value: "correct", explanation: "Smoking significantly increases the risk of developing gum disease." },
                { text: "Causes tooth discoloration", value: "correct", explanation: "Smoking can cause teeth to become stained and discolored over time." },
                { text: "Reduces the ability to taste", value: "correct", explanation: "Smoking can dull the taste buds, reducing the ability to taste properly." },
                { text: "All of the above", value: "correct", explanation: "All listed effects are ways smoking negatively impacts oral health." }
            ]
        },
        {
            question: "What role does saliva play in oral health?",
            options: [
                { text: "Neutralizes acids in the mouth", value: "correct", explanation: "Saliva helps neutralize acids produced by bacteria, protecting tooth enamel." },
                { text: "Removes food particles", value: "correct", explanation: "Saliva aids in washing away food particles and debris from the mouth." },
                { text: "Provides essential minerals for teeth", value: "correct", explanation: "Saliva contains minerals like calcium and phosphate that help remineralize teeth." },
                { text: "All of the above", value: "correct", explanation: "Saliva plays multiple crucial roles in maintaining oral health." }
            ]
        },
        {
            question: "Which vitamin is essential for maintaining healthy gums?",
            options: [
                { text: "Vitamin A", value: "incorrect", explanation: "Vitamin A is important for vision and immune function, but not specifically for gums." },
                { text: "Vitamin C", value: "correct", explanation: "Vitamin C is essential for the maintenance and repair of gum tissue." },
                { text: "Vitamin D", value: "incorrect", explanation: "Vitamin D helps in calcium absorption but isn't directly linked to gum health." },
                { text: "Vitamin B12", value: "incorrect", explanation: "Vitamin B12 is important for nerve function, not specifically for gums." }
            ]
        }
    ];

    // Create Quiz Questions
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('quiz-question');

        const questionP = document.createElement('p');
        questionP.textContent = `${index + 1}. ${q.question}`;
        questionDiv.appendChild(questionP);

        q.options.forEach(option => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question${index}`;
            input.value = option.value;
            label.appendChild(input);
            label.appendChild(document.createTextNode(option.text));
            questionDiv.appendChild(label);
        });

        // Create a feedback div for each question
        const feedbackDiv = document.createElement('div');
        feedbackDiv.classList.add('feedback', 'hidden');
        questionDiv.appendChild(feedbackDiv);

        quizForm.appendChild(questionDiv);
        console.log(`Added question ${index + 1}: ${q.question}`);
    });

    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit Quiz';
    submitButton.classList.add('cta-button', 'primary-button');
    quizForm.appendChild(submitButton);
    console.log('Submit button added to quiz form.');

    // Toggle Quiz Visibility
    quizButton.addEventListener('click', (e) => {
        e.preventDefault();
        const expanded = quizButton.getAttribute('aria-expanded') === 'true';
        quizButton.setAttribute('aria-expanded', !expanded);
        quizContainerElement.classList.toggle('hidden');
        if (!expanded) {
            quizButton.textContent = 'Hide Quiz';
            console.log('Quiz container shown.');
        } else {
            quizButton.textContent = 'Take the Quiz';
            console.log('Quiz container hidden.');
            resetQuiz(); // Reset the quiz when hidden
        }
    });

    // Handle Quiz Submission
    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Quiz submitted.');
        let score = 0;
        const quizDetails = {
            date: new Date().toISOString(),
            score: 0,
            percentage: 0,
            questions: []
        };

        questions.forEach((q, index) => {
            const selected = quizForm.querySelector(`input[name="question${index}"]:checked`);
            const feedbackDiv = quizForm.querySelectorAll('.feedback')[index];
            const correctOption = q.options.find(opt => opt.value === 'correct');
            const userAnswer = selected ? selected.parentElement.textContent.trim() : "No answer selected";
            const isCorrect = selected && selected.value === 'correct';

            if (isCorrect) {
                score++;
                feedbackDiv.textContent = `✅ Correct! ${correctOption.explanation}`;
                feedbackDiv.style.color = 'green';
                console.log(`Question ${index + 1}: Correct`);
            } else {
                const selectedOption = selected ? q.options.find(opt => opt.text === selected.parentElement.textContent.trim()) : null;
                feedbackDiv.textContent = selectedOption ? `❌ Incorrect. ${selectedOption.explanation}` : `⚠️ No answer selected. ${correctOption.explanation}`;
                feedbackDiv.style.color = selected ? 'red' : 'orange';
                console.log(`Question ${index + 1}: Incorrect`);
            }

            feedbackDiv.classList.remove('hidden');

            // Save question details for history
            quizDetails.questions.push({
                question: q.question,
                selectedAnswer: userAnswer,
                correctAnswer: correctOption.text,
                isCorrect: isCorrect,
                explanation: correctOption.explanation
            });
        });

        const percentage = (score / questions.length) * 100;
        console.log(`Quiz score: ${score}/${questions.length} (${percentage}%)`);

        quizDetails.score = score;
        quizDetails.percentage = percentage;

        // Update the quizResult element with overall score
        let overallMessage = `You scored ${score} out of ${questions.length} (${percentage}%)!`;
        if (percentage === 100) {
            overallMessage += ' 🌟 Perfect score! You\'re a dental hygiene expert!';
            console.log('User achieved a perfect score.');
        } else if (percentage >= 80) {
            overallMessage += ' 👍 Great job! Keep up the good work.';
            console.log('User scored 80% or above.');
        } else if (percentage >= 50) {
            overallMessage += ' 😊 Good effort! There\'s room for improvement.';
            console.log('User scored between 50% and 79%.');
        } else {
            overallMessage += ' 📚 Keep learning! Review the material and try again.';
            console.log('User scored below 50%.');
        }

        quizResult.textContent = overallMessage;
        quizResult.classList.remove('hidden'); // Remove the 'hidden' class to make it visible
        quizResult.style.display = 'block'; // Ensure it's displayed
        quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Scroll into view
        console.log('Quiz result displayed.');

        // Save quiz details to history in localStorage under 'quizHistory'
        const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        quizHistory.push(quizDetails);
        localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
        console.log('Quiz details saved to quizHistory:', quizDetails);

        // Save last quiz score for badge awarding
        const lastQuiz = {
            score: percentage
        };
        localStorage.setItem('lastQuiz', JSON.stringify(lastQuiz));
        console.log('Last quiz score saved to localStorage:', lastQuiz);

        // Award badges if applicable
        awardBadges();
    });

    /* ------------------------------
       Reset Quiz Function
    ------------------------------ */
    function resetQuiz() {
        if (quizForm) {
            quizForm.reset();
            // Hide all feedback messages
            const feedbacks = quizForm.querySelectorAll('.feedback');
            feedbacks.forEach(feedback => {
                feedback.classList.add('hidden');
                feedback.textContent = '';
            });
            // Hide overall result
            if (quizResult) {
                quizResult.classList.add('hidden');
                quizResult.textContent = '';
            }
            console.log('Quiz has been reset.');
        }
    }

    /* ------------------------------
       Badge Display Function
    ------------------------------ */
    // Already defined above to avoid duplication

    /* ------------------------------
       Load Badges on Page Load
    ------------------------------ */
    loadBadges();

    /* ------------------------------
       Load Today's Progress and Update History
    ------------------------------ */
    saveProgressButton.addEventListener('click', saveProgress);
    loadTodayProgress(); // Load today's progress on page load
    updateProgressHistory(); // Update progress history on page load
});
