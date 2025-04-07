const questions = [
    {
        section: "Interests (RIASEC)",
        questions: [
            {
                question: "I enjoy working with my hands to build or fix things.",
                type: "likert",
                category: "Realistic"
            },
            {
                question: "I like to think about how things work and solve puzzles.",
                type: "likert",
                category: "Investigative"
            },
            {
                question: "I enjoy creating art, music, or writing stories.",
                type: "likert",
                category: "Artistic"
            },
            {
                question: "I like helping people and working with others.",
                type: "likert",
                category: "Social"
            },
            {
                question: "I am good at persuading others and taking charge.",
                type: "likert",
                category: "Enterprising"
            },
            {
                question: "I prefer tasks that are organized and follow clear rules.",
                type: "likert",
                category: "Conventional"
            }
        ]
    },
    {
        section: "Personality Traits",
        questions: [
            {
                question: "I feel comfortable talking to new people.",
                type: "likert",
                category: "Extroversion"
            },
            {
                question: "I enjoy being part of group activities.",
                type: "likert",
                category: "Extroversion"
            },
            {
                question: "I always finish my homework on time.",
                type: "likert",
                category: "Conscientiousness"
            },
            {
                question: "I keep my things neat and organized.",
                type: "likert",
                category: "Conscientiousness"
            },
            {
                question: "I like learning about different cultures and ideas.",
                type: "likert",
                category: "Openness"
            },
            {
                question: "I enjoy trying new foods or activities.",
                type: "likert",
                category: "Openness"
            }
        ]
    },
    {
        section: "Values",
        questions: [
            {
                question: "I want a career where I can be creative and innovative.",
                type: "likert",
                category: "Values"
            },
            {
                question: "I prefer a job that involves working with people rather than alone.",
                type: "likert",
                category: "Values"
            },
            {
                question: "I value having a stable and secure job.",
                type: "likert",
                category: "Values"
            },
            {
                question: "I want my work to make a difference in the world.",
                type: "likert",
                category: "Values"
            }
        ]
    },
    {
        section: "Self-Assessed Skills",
        questions: [
            {
                question: "I am good at math and enjoy solving problems.",
                type: "likert",
                category: "Skills"
            },
            {
                question: "I can easily understand and remember what I read.",
                type: "likert",
                category: "Skills"
            },
            {
                question: "I have good coordination and can do well in sports or crafts.",
                type: "likert",
                category: "Skills"
            },
            {
                question: "I am comfortable using computers and learning new software.",
                type: "likert",
                category: "Skills"
            }
        ]
    },
    {
        section: "Profile Questions",
        questions: [
            {
                question: "What Do you Enjoy Doing in your free Time?",
                type: "text",
                category: "Profile"
            },
            {
                question: "Are there any activities you regularly participate in or outside schools?",
                type: "text",
                category: "Profile"
            },
            {
                question: "Do you have creative hobbies like painting, dance, music etc. If you have then what do you enjoy about them?",
                type: "text",
                category: "Profile"
            },
            {
                question: "Is there is anything you want to learn about which you find interesting and it is not part of your school curriculum?",
                type: "text",
                category: "Profile"
            },
            {
                question: "What are your favourite subjects in School and Why do find them Favourite?",
                type: "text",
                category: "Profile"
            },
            {
                question: "What are the things you're most curious about?",
                type: "text",
                category: "Profile"
            },
            {
                question: "What drives you and Inspires you?",
                type: "text",
                category: "Profile"
            },
            {
                question: "What is your Dream, what is your long term goal?",
                type: "text",
                category: "Profile"
            }
        ]
    }
];

// Flatten the questions array for easier navigation
const flattenedQuestions = questions.reduce((acc, section) => {
    return acc.concat(section.questions.map(q => ({...q, section: section.section})));
}, []);

let currentQuestion = 0;
let answers = {
    responses: []
};

document.addEventListener('DOMContentLoaded', function () {
    const nameForm = document.getElementById('nameForm');
    const nameSection = document.getElementById('name-section');
    const quizSection = document.getElementById('quiz-section');

    nameForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const studentName = document.getElementById('studentName').value;
        if (studentName.trim()) {
            answers.name = studentName;
            nameSection.classList.add('d-none');
            quizSection.classList.remove('d-none');
            showQuestion(currentQuestion);
        }
    });

    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    nextBtn.addEventListener('click', () => {
        saveAnswer(currentQuestion);
        if (currentQuestion < flattenedQuestions.length - 1) {
            currentQuestion++;
            showQuestion(currentQuestion);
        } else {
            // Send answers to backend
            submitResponses();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    });
});

function showQuestion(index) {
    if (index >= flattenedQuestions.length) return;
    
    const question = flattenedQuestions[index];
    const questionText = document.getElementById('question-text');
    const answerOptions = document.getElementById('answer-options');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const sectionHeader = document.getElementById('section-header');

    // Update section header
    if (index === 0 || flattenedQuestions[index - 1].section !== question.section) {
        sectionHeader.textContent = question.section;
        sectionHeader.style.display = 'block';
    } else {
        sectionHeader.style.display = 'none';
    }

    // Update question text
    questionText.textContent = question.question;

    // Clear previous answer options
    answerOptions.innerHTML = '';

    // Create question container
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';

    if (question.type === 'likert') {
        // Create Likert scale container
        const likertContainer = document.createElement('div');
        likertContainer.className = 'likert-container d-flex justify-content-between align-items-start';

        const likertOptions = [
            { value: 1, label: 'Strongly Disagree' },
            { value: 2, label: 'Disagree' },
            { value: 3, label: 'Neutral' },
            { value: 4, label: 'Agree' },
            { value: 5, label: 'Strongly Agree' }
        ];

        likertOptions.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'likert-option';

            const button = document.createElement('button');
            button.className = 'likert-button';
            button.setAttribute('type', 'button');
            
            // Check if this option was previously selected
            const previousAnswer = answers.responses[index]?.answer;
            if (previousAnswer === option.value) {
                button.classList.add('selected');
            }

            button.innerHTML = `<span>${option.value}</span>`;
            
            button.onclick = (e) => {
                // Remove selected class from all buttons
                likertContainer.querySelectorAll('.likert-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                // Add selected class to clicked button
                button.classList.add('selected');
            };

            const label = document.createElement('div');
            label.className = 'likert-label';
            label.textContent = option.label;

            optionDiv.appendChild(button);
            optionDiv.appendChild(label);
            likertContainer.appendChild(optionDiv);
        });

        questionContainer.appendChild(likertContainer);
    } else if (question.type === 'text') {
        const textArea = document.createElement('textarea');
        textArea.className = 'form-control profile-answer';
        textArea.rows = 4;
        textArea.placeholder = 'Type your answer here...';
        
        // Load previous answer if exists
        const previousAnswer = answers.responses[index]?.answer;
        if (previousAnswer) {
            textArea.value = previousAnswer;
        }

        questionContainer.appendChild(textArea);
    }

    answerOptions.appendChild(questionContainer);

    // Update progress bar
    const progress = ((index + 1) / flattenedQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);

    // Update navigation buttons
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === flattenedQuestions.length - 1 ? 'Finish' : 'Next';
}

function saveAnswer(questionIndex) {
    const question = flattenedQuestions[questionIndex];
    const answerOptions = document.getElementById('answer-options');
    
    let response = {
        section: question.section,
        question: question.question,
        category: question.category,
        type: question.type,
        answer: null
    };

    if (question.type === 'likert') {
        const selectedButton = answerOptions.querySelector('.likert-button.selected');
        if (selectedButton) {
            response.answer = parseInt(selectedButton.textContent);
        }
    } else if (question.type === 'text') {
        const textArea = answerOptions.querySelector('.profile-answer');
        if (textArea) {
            response.answer = textArea.value.trim();
        }
    }

    // Only save valid responses
    if (response.answer !== null) {
        answers.responses[questionIndex] = response;
    }
}

async function submitResponses() {
    try {
        // Show loading screen, hide quiz section
        document.getElementById('quiz-section').classList.add('d-none');
        document.getElementById('loading-section').classList.remove('d-none');
        
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answers)
        });
        
        const result = await response.json();
        
        // Hide loading screen, show results
        document.getElementById('loading-section').classList.add('d-none');
        showResults(result);
    } catch (error) {
        console.error('Error:', error);
        // Hide loading screen, show error message
        document.getElementById('loading-section').classList.add('d-none');
        alert('An error occurred while analyzing your responses. Please try again.');
    }
}

function showResults(result) {
    const resultsSection = document.getElementById('results-section');
    const analysisResult = document.getElementById('analysis-result');
    
    resultsSection.classList.remove('d-none');
    analysisResult.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Recommended Career Paths</h5>
                <div class="card-text">
                    ${result.suggestion.replace(/\n/g, '<br>')}
                </div>
            </div>
        </div>
    `;
}