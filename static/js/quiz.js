let currentAnswer = "";
let score = 0;
let currentQuestionIndex = 0;
let randomQuestions;
let startButton;
const game = document.getElementById("game-contents");

async function loadStartPage() {
    try {
        const questions = await getQuestions();
        randomQuestions = getRandomQuestions(questions, 10);

        // get the start button and add a click event to display the first question
        startButton = document.getElementById("start-button");
        startButton.addEventListener("click", () =>
            displayQuestion(randomQuestions[0])
        );
    } catch {
        // remove the start button so we can display the error
        game.replaceChildren()

        // if there is an error with the API, give the user the chance to reload and explain the issue
        let heading = generateHeading("Ooooops");
        game.appendChild(heading);

        let paragraph = generateParagraph("Unable to get questions from API");
        game.appendChild(paragraph);

        let subParagraph = generateParagraph(
            "The API is rate limited, so please click the button below to try again"
        );
        game.appendChild(subParagraph);

        let button = generateButton("Reload");
        button.addEventListener("click", () => {
            window.location.reload();
        });
        game.appendChild(button);
    }
}
// since we are using an async function from a top level module, we need to wrap it in an anonymous async function
(async function() {
    await loadStartPage()
  })();

// an array of the discount codes that the user can win
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
    "quiz-20",
];

async function getQuestions() {
    // question got from https://opentdb.com/
    const response = await fetch(
        "https://opentdb.com/api.php?amount=30&category=22&difficulty=medium&type=multiple",
        {
            method: "GET",
        }
    );
    // Throw an error if there is not a good response from the server
    if (!response.ok) {
        throw new Error("Unable to get questions from the api");
    }
    // Get the body of the response as  JSON
    const responseJSON = await response.json();
    const questions = [];

    // Loop through the JSON body and populate eac question object , with a question, correct answer and there options
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
    // Loop through the questions until the amount required is fulfilled
    while (randomQuestions.length < amount) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const randomQuestion = questions[randomIndex];
        // ensure that each question in the array is unique
        if (!randomQuestions.includes(randomQuestion)) {
            randomQuestions.push(randomQuestion);
        }
    }

    return randomQuestions;
}

function generateHeading(text) {
    const heading = document.createElement("h1");
    heading.classList.add("p-2", "text-center", "text-white", "z-3");
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
    // helper function to create a button 
    const button = generateButton(text);
    button.classList.add("btn", "z-3", "my-1", "options", "w-50");
    // the submit button is passed as it should only be enabled after an option is selected
    button.addEventListener("click", () =>
        handleOptionClick(text, submitButton)
    );
    button.dataset.answer = text;
    return button;
}

function handleOptionClick(text, button) {
    // after an option is selected, we set the current answer to this and also enable the submit button
    currentAnswer = text;
    button.disabled = false;
}

function generateSubmitButton(question) {
    // helper function to generate a submit button
    const button = generateButton();
    button.textContent = "Submit";
    button.id = "submit";
    button.disabled = true;
    // we call the checkAnswer function when it is clicked
    button.addEventListener("click", () => checkAnswer(question, button));
    button.classList.add("btn-success", "mt-3");
    return button;
}

function generateNextButton() {
    // helper function to generate the next button
    const button = generateButton();
    button.classList.add("btn-success", "mt-3");
    button.textContent = "Next";
    currentQuestionIndex += 1;
    button.addEventListener("click", () =>
        displayQuestion(randomQuestions[currentQuestionIndex])
    );
    return button;
}

function checkAnswer(question, button) {
    // remove the submit button , stop double submits
    game.removeChild(button);
    // disable options to stop a user changing their answer
    const options = document.getElementsByClassName("options");
    for (let option of options) {
        option.disabled = true;
    }

    // get the button that has the text of the current answer
    const answerButton = document.querySelector(
        `button[data-answer="${currentAnswer}"]`
    );
    if (currentAnswer === question.correctAnswer) {
        score += 1;
        // if the answer is correct we add a green background
        answerButton.classList.remove("btn-primary");
        answerButton.classList.add("btn-success");
    } else {
        answerButton.classList.remove("btn-primary");
        answerButton.classList.add("btn-danger");
        // if it is incorrect we add a red background
        const correctAnswerbutton = document.querySelector(
            `button[data-answer="${question.correctAnswer}"]`
        );
        // show the correct answer with a reen background
        correctAnswerbutton.classList.remove("btn-primary");
        correctAnswerbutton.classList.add("btn-success");
    }
    // Add the next button to generate the next question
    const nextButton = generateNextButton("Next");
    game.appendChild(nextButton);
}

function displayQuestion(question) {
    // check to see if there are more questions to ask
    if (currentQuestionIndex < randomQuestions.length) {
        // clear the gameboard
        game.replaceChildren();
        // display current question number
        const questionNumberDisplay = generateHeading(
            `Question ${currentQuestionIndex + 1} / ${randomQuestions.length}`
        );
        questionNumberDisplay.classList.add("fs-1");
        game.appendChild(questionNumberDisplay);
        // display the question
        const paragraph = generateParagraph(question.question);
        game.appendChild(paragraph);

        const submitButton = generateSubmitButton(question);

        // display the four options 
        for (let option of question.options) {
            const optionButton = generateOptionButton(option, submitButton);
            game.appendChild(optionButton);
        }
        // display the submit button - had to create it before I appended it to the body,
        // as I need to pass it to the options to enable the submit button
        game.appendChild(submitButton);
    } else {
        gameover();
    }
}

function gameover() {
    let paragraph;
    // clear the game board
    game.replaceChildren();
    // display the score
    const scoreText = generateHeading(
        `Score ${score} / ${randomQuestions.length}`
    );
    game.appendChild(scoreText);
    // get the discount code, using the score as an index
    const code = discountCodes[score];
    if (score > 0) {
        paragraph = generateParagraph(
            "Congratulations on the result your discount code is"
        );
    } else {
        paragraph = generateParagraph(
            "Unfortunately, you have not answered any correct, but heres a discount code for trying"
        );
    }
    game.appendChild(paragraph);
    const codeText = document.createElement("h4");
    codeText.classList.add("text-white");
    codeText.textContent = code;
    game.appendChild(codeText);

    // check to see if there is a previous code, if there is not, or else it is a lower code, we set the new entry
    let previousCode = localStorage.getItem("code");
    if (
        // check to see if this code has a higher index to give the user the biggest discount
        !previousCode ||
        discountCodes.indexOf(previousCode) < discountCodes.indexOf(code)
    ) {
        localStorage.setItem("code", code);
    }

    const codeParagraph = generateParagraph(
        "We have saved this code in your browser and will populate the form with it, so don't worry if you forget it!"
    );
    game.appendChild(codeParagraph);

    // create a replay button to allow the user the chance to play again
    const button = generateButton("Replay");
    button.addEventListener("click", () => {
        window.location = "quiz.html";
    });
    game.appendChild(button);
}
