let currentAnswer = "";
let score = 0;
let currentQuestionIndex = 0;
const startButton = document.getElementById("start-button");

const questions = await getQuestions();
const randomQuestions = getRandomQuestions(questions, 10);
const game = document.getElementById("game-contents");

startButton.addEventListener("click", () =>
    displayQuestion(randomQuestions[0])
);

const discountCodes = [
    "quiz-2",
    "quiz-4",
    "quiz-6",
    "quiz-8",
    "quiz-10",
    "quiz-12",
    "quiz-14",
    "quiz-16",
    "quiz-18",
    "quiz-20"
  ]

async function getQuestions() {
    // question got from https://opentdb.com/
    const response = await fetch(
        "https://opentdb.com/api.php?amount=30&category=22&difficulty=medium&type=multiple",
        {
            method: "GET",
        }
    );

    if (!response.ok) {
        throw new Error("Unable to get questions from the api");
    }

    const responseJSON = await response.json();
    const questions = [];

    for (let question of responseJSON.results) {
        questions.push({
            question: question.question,
            correctAnswer: question["correct_answer"],
            options: [
                question["correct_answer"],
                ...question["incorrect_answers"],
            ],
        });
    }

    return questions;
}

function getRandomQuestions(questions, amount) {
    const randomQuestions = [];
    while (randomQuestions.length < amount) {
        const randomIndex = Math.floor(Math.random() * (questions.length));
        const randomQuestion = questions[randomIndex];
        if (!randomQuestions.includes(randomQuestion)) {
            randomQuestions.push(randomQuestion);
        }
    }

    return randomQuestions;
}

function generateHeading(text) {
    const heading = document.createElement("h1");
    heading.classList.add(
        "display-1",
        "p-2",
        "text-center",
        "text-white",
        "z-3"
    );
    heading.textContent = text;
    return heading;
}

function generateParagraph(text) {
    const paragraph = document.createElement("p");
    paragraph.classList.add("text-white", "text-center", "z-3");
    paragraph.innerHTML = text;
    return paragraph;
}

function generateButton(text) {
    const button = document.createElement("button");
    button.classList.add("btn", "z-3");
    if (text) {
        button.innerHTML = text;
    }
    return button;
}

function generateOptionButton(text, submitButton) {
    const button = generateButton(text);
    button.classList.add("btn", "btn-primary", "z-3", "w-50", "my-1", "options");
    button.addEventListener("click", () => handleOptionClick(text, submitButton))
    button.dataset.answer = text;
    return button;
}

function handleOptionClick(text, button) {
    currentAnswer = text
    button.disabled = false;
}

function generateSubmitButton(question) {
    const button = generateButton();
    button.textContent = "Submit";
    button.id = "submit";
    button.disabled = true;
    button.addEventListener("click", () => checkAnswer(question, button));
    button.classList.add("btn-success");
    return button;
}

function generateNextButton() {
    const button = generateButton();
    button.classList.add("btn-success");
    button.textContent = "Next";
    currentQuestionIndex += 1;
    button.addEventListener("click", () =>
        displayQuestion(randomQuestions[currentQuestionIndex])
    );
    return button;
}

function checkAnswer(question, button) {
    game.removeChild(button)
    const options = document.getElementsByClassName("options");
    for (let option of options) {
        option.disabled = true;
    }
    const answerButton = document.querySelector(
        `button[data-answer="${currentAnswer}"]`
    );
    if (currentAnswer === question.correctAnswer) {
        score += 1;
        answerButton.classList.remove("btn-primary");
        answerButton.classList.add("btn-success");
    } else {
        answerButton.classList.remove("btn-primary");
        answerButton.classList.add("btn-danger");
        const correctAnswerbutton = document.querySelector(
            `button[data-answer="${question.correctAnswer}"]`
        );
        correctAnswerbutton.classList.remove("btn-primary");
        correctAnswerbutton.classList.add("btn-success");
    }
    const nextButton = generateNextButton("Next");
    game.appendChild(nextButton);
}

function displayQuestion(question) {
    if (currentQuestionIndex < randomQuestions.length) {
        game.replaceChildren();
        const questionText = generateHeading(
            `Question ${currentQuestionIndex + 1} / 10`
        );
        questionText.classList.add("fs-1");
        game.appendChild(questionText);
        const paragraph = generateParagraph(question.question);
        paragraph.classList.add("display-4");
        game.appendChild(paragraph);
        const submitButton = generateSubmitButton(question);
        for (let option of question.options) {
            const optionButton = generateOptionButton(option, submitButton);
            game.appendChild(optionButton);
        }
        game.appendChild(submitButton)
    }
    else{
        gameover()
    }
}

function gameover() {
    let paragraph;
    game.replaceChildren();
    const scoreText = generateHeading(
        `Score ${score} / 10`
    );
    game.appendChild(scoreText)
    const code = discountCodes[score]
    if(score > 0) {
        paragraph = generateParagraph("Congratulations on the result your discount code is");
    }
    else {
        paragraph = generateParagraph("Unfortunately, you have not answered any correct, but heres a discount code for trying");
    }
    game.appendChild(paragraph)
    const codeText = document.createElement("h4");
    codeText.classList.add("text-white")
    codeText.textContent = code;
    game.appendChild(codeText)

}