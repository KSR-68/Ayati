const questions = [
    {
        question: "Which subjects do you feel most confident in?",
        type: "multiSelect",
        options: ["Mathematics", "Science", "English", "Social Studies", "Languages", "Arts"]
    },
    {
        question: "How would you rate your skills in Mathematics?",
        type: "scale",
        min: 1,
        max: 10
    },
    {
        question: "Can you describe a recent project or assignment in [subject] that you enjoyed or did well in?",
        type: "text"
    },
    {
        question: "How comfortable are you with solving problems or experiments in Mathematics/Science? Can you give an example of a problem or experiment you enjoyed?",
        type: "textplusScale",
        min: 1,
        max: 10
    },
    {
        question: "How do you feel about reading, writing, or discussing topics in English or Social Studies? What topics excite you the most?",
        type: "text"
    },
    {
        question: "Do you enjoy solving puzzles, riddles, or logical problems? Can you share an example of a puzzle or problem you found interesting?",
        type: "text"
    },
    { 
        question: "What do you enjoy doing in your free time?", 
        type: "text" 
    },
    {
        question: "Are there any activities you regularly participate in outside of school (e.g., sports, music, art, coding, drama)?",
        type: "text"
    },
    {
        question: "Have you ever been a part of any clubs, teams, or extracurricular groups? If yes, what role did you play and what did you learn?",
        type: "text"
    },
    {
        question: "Do you have any creative hobbies like painting, writing, or playing an instrument? What do you enjoy about these activities?",
        type: "text"
    },
    { 
        question: "Is there a subject or hobby you wish to learn more about even if it's not part of your school curriculum? Why?", 
        type: "text" 
    },
    { 
        question: "How do you think your favorite school subject or activity relates to what you enjoy doing outside school?", 
        type: "text" 
    },
    { 
        question: "Imagine you could combine your favorite subject with your hobby—what would that look like?", 
        type: "text" 
    },
    // Add more questions from the provided list
];

let currentQuestion = 0;
let answers = {};

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
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion(currentQuestion);
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
    const question = questions[index];
    const questionText = document.getElementById('question-text');
    const answerOptions = document.getElementById('answer-options');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');

    questionText.textContent = question.question;
    answerOptions.innerHTML = '';

    // Update progress bar
    const progress = ((index + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Update navigation buttons
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === questions.length - 1 ? 'Finish' : 'Next';

    // Create appropriate input based on question type
    switch (question.type) {
        case 'multiSelect':
            question.options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'btn btn-outline-secondary mb-2';
                button.textContent = option;
                button.onclick = () => {
                    button.classList.toggle('selected');
                };
                answerOptions.appendChild(button);
            });
            break;
        case 'scale':
            const scaleContainer = document.createElement('div');
            scaleContainer.className = 'scale-container mt-3';
            
            const rangeLabels = document.createElement('div');
            rangeLabels.className = 'd-flex justify-content-between mb-2';
            
            const minLabel = document.createElement('span');
            minLabel.textContent = 'Low';
            const maxLabel = document.createElement('span');
            maxLabel.textContent = 'High';
            
            rangeLabels.appendChild(minLabel);
            rangeLabels.appendChild(maxLabel);
            
            const rangeInput = document.createElement('input');
            rangeInput.type = 'range';
            rangeInput.min = question.min;
            rangeInput.max = question.max;
            rangeInput.value = Math.floor((question.max - question.min) / 2);
            rangeInput.className = 'form-range';
            
            const rangeValue = document.createElement('div');
            rangeValue.className = 'text-center mt-2';
            rangeValue.textContent = `Selected value: ${rangeInput.value}`;
            
            scaleContainer.appendChild(rangeLabels);
            scaleContainer.appendChild(rangeInput);
            scaleContainer.appendChild(rangeValue);
            
            rangeInput.addEventListener('input', () => {
                rangeValue.textContent = `Selected value: ${rangeInput.value}`;
            });
            
            answerOptions.appendChild(scaleContainer);
            break;
        case 'text':
            const textArea = document.createElement('textarea');
            textArea.className = 'form-control';
            textArea.rows = 4;
            answerOptions.appendChild(textArea);
            break;
        case 'textplusScale':
            const textArea2 = document.createElement('textarea');
            textArea2.className = 'form-control mb-3';
            textArea2.rows = 4;
            answerOptions.appendChild(textArea2);

            const scaleContainer2 = document.createElement('div');
            scaleContainer2.className = 'scale-container mt-3';
            
            const rangeLabels2 = document.createElement('div');
            rangeLabels2.className = 'd-flex justify-content-between mb-2';
            
            const minLabel2 = document.createElement('span');
            minLabel2.textContent = 'Low';
            const maxLabel2 = document.createElement('span');
            maxLabel2.textContent = 'High';
            
            rangeLabels2.appendChild(minLabel2);
            rangeLabels2.appendChild(maxLabel2);
            
            const rangeInput2 = document.createElement('input');
            rangeInput2.type = 'range';
            rangeInput2.min = question.min;
            rangeInput2.max = question.max;
            rangeInput2.value = Math.floor((question.max - question.min) / 2);
            rangeInput2.className = 'form-range';
            
            const rangeValue2 = document.createElement('div');
            rangeValue2.className = 'text-center mt-2';
            rangeValue2.textContent = `Selected value: ${rangeInput2.value}`;
            
            scaleContainer2.appendChild(rangeLabels2);
            scaleContainer2.appendChild(rangeInput2);
            scaleContainer2.appendChild(rangeValue2);
            
            rangeInput2.addEventListener('input', () => {
                rangeValue2.textContent = `Selected value: ${rangeInput2.value}`;
            });
            
            answerOptions.appendChild(scaleContainer2);
            break;
    }
}