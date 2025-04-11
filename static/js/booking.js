let discount = 0;
let totalCost = 0;
let numberOfPeople = 1;
let route;
let fullname;
let withLunch = false;
let date;
let email;
let total = document.getElementById("total-cost");
total.textContent = "Please select route to see price calculation";

let validatedObject = {
    route: false,
    fullname: false,
    date: false,
    email: false,
    number: true,
};

// define the fullnameInput and add an on change event listener
const fullnameInput = document.getElementById("fullname");
if (fullnameInput) {
    fullnameInput.addEventListener("change", () =>
        validateFullname(fullnameInput.value)
    );
} else {
    createAlert("Unable to calculate total, contact support", "error");
}

// define the emailInput and add an on change event listener
const emailInput = document.getElementById("email");
if (emailInput) {
    emailInput.addEventListener("change", () =>
        validateEmail(emailInput.value)
    );
} else {
    createAlert("Unable to calculate total, contact support", "error");
}

// define the numberInput and add an on change event listener
const numberInput = document.getElementById("number");
if (numberInput) {
    numberInput.addEventListener("change", () =>
        validateNumber(numberInput.value)
    );
} else {
    createAlert("Unable to calculate total, contact support", "error");
}

// get both lunch radio buttons and apply an event listener so on click it sets lunch to its value
const lunchOptions = document.querySelectorAll('input[name="lunch"]');
if (lunchOptions.length === 2) {
    for (let option of lunchOptions) {
        option.addEventListener("click", () => validateLunch(option.value));
    }
} else {
    createAlert("Unable to calculate total, contact support", "error");
}

// define the routeInput and add an on change event listener
const routeInput = document.getElementById("route");
if (routeInput) {
    routeInput.addEventListener("change", () =>
        validateRoute(routeInput.value)
    );
} else {
    createAlert("Unable to calculate total, contact support", "error");
}

// define the routeInput and add an on change event listener
const discountInput = document.getElementById("discount-code");
if (discountInput) {
    discountInput.addEventListener("change", () =>
        validateDiscount(discountInput.value)
    );
} else {
    createAlert("Unable to calculate total, contact support", "error");
}

// define the dateInput and add an on change event listener
const dateInput = document.getElementById("date");
if (dateInput) {
    dateInput.addEventListener("change", () => validateDate(dateInput.value));
} else {
    createAlert("Unable to calculate total, contact support", "error");
}

// define the form and handle the submit
const form = document.getElementById("booking-form");
if (form) {
    form.addEventListener("submit", (event) => handleSubmit(event));
} else {
    createAlert("Unable to calculate total, contact support", "error");
}

const routeToPriceObject = {
    1: {
        name: "Tralee - Kinsale",
        cost: 200,
    },
    2: {
        name: "Killarney - Galway",
        cost: 300,
    },
    3: {
        name: "Ennis - Sligo",
        cost: 250,
    },
    4: {
        name: "Galway - Letterkenny",
        cost: 250,
    },
};

function calculateTotalCost() {
    try {
        if (route && numberOfPeople) {
            // get the route and price object nested inside the the number key and filter the result by the matching name
            const routeWithPrice = Object.values(routeToPriceObject).filter(
                (routeToPrice) => {
                    console.log(routeToPrice);
                    console.log(route);
                    return routeToPrice.name === route;
                }
            );

            if (routeWithPrice.length === 1) {
                let basePrice = routeWithPrice[0].cost;
                let groupPrice = basePrice * numberOfPeople;
                if (withLunch) {
                    groupPrice = groupPrice + numberOfPeople * 10;
                }
                if (discount) {
                    groupPrice = groupPrice - groupPrice * (discount / 100);
                }
                total.textContent = groupPrice;
            } else {
                throw new Error("Route Selected Not Valid");
            }
        }
    } catch (error) {
        createAlert(error, "error");
    }
}

const discountCodes = {
    "quiz-2": 2,
    "quiz-4": 4,
    "quiz-6": 6,
    "quiz-8": 8,
    "quiz-10": 10,
    "quiz-12": 12,
    "quiz-14": 14,
    "quiz-16": 16,
    "quiz-18": 18,
    "quiz-20": 20,
};

/*
 * alert that can be used for errors and success messages
 * pass in a bootstrap utility theme like warning error or success
 * to style the alert accordingly
 */

function createAlert(message, type) {
    const div = document.createElement("div");
    div.classList.add(
        "alert",
        `alert-${type}`,
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "w-25"
    );
    div.setAttribute("role", "alert");
    document.body.appendChild(div);

    let span = document.createElement("span");
    span.textContent = message;
    div.appendChild(span);

    const button = document.createElement("button");
    button.textContent = "X";
    button.classList.add("btn", `btn-${type}`, "text-black");
    button.addEventListener("click", () => document.body.removeChild(div));
    div.appendChild(button);
}

function validateFullname(enteredFullname) {
    // remove old errors if present
    let fullnameErrorDiv = document.getElementById("fullname-error");
    if (fullnameErrorDiv) {
        fullnameErrorDiv.textContent = ""
    }
    // ensure the name is longer than 3
    if (enteredFullname.length >= 3) {
        fullname = enteredFullname;
        validatedObject.fullname = true;
    } else {
        // attempt to set the error message in the error div under the import
        if (fullnameErrorDiv) {
            fullnameErrorDiv.textContent =
                "Invalid Input: Please enter a name longer then 3 characters";
        } else {
            // send an alert if the error div is not found
            createAlert(
                "Invalid Input: Please enter a name longer then 3 characters",
                "error"
            );
        }
        validatedObject.fullname = false;
    }
}

function validateEmail(enteredEmail) {
    // remove old error if present
    const numberErrorDiv = document.getElementById("number-error")
    if (numberErrorDiv) {
        numberErrorDiv.textContent = ""
    }
    // ensure the name is longer than 3
    if (
        enteredEmail.includes("@") &&
        enteredEmail.length >= 5 &&
        enteredEmail.includes(".")
    ) {
        email = enteredEmail;
        validatedObject.email = true;
    } else {
        // attempt to set the error message in the error div under the import
        if (emailErrorDiv) {
            emailErrorDiv.textContent =
                "Invalid Input: Please enter a valid email";
        } else {
            // send an alert if the error div is not found
            createAlert("Invalid Input: Please enter a valid email", "error");
        }
        validatedObject.email = false;
    }
}

function validateNumber(number) {
    // remove old error if present
    let numberErrorDiv = document.getElementById("number-error");
    if (numberErrorDiv) {
        numberErrorDiv.textContent = "";
    }
    // ensure the name is longer than 3
    if (number >= 1 && number <= 12) {
        numberOfPeople = number;
        validatedObject.number = true;
    } else {
        // attempt to set the error message in the error div under the import
        if (numberErrorDiv) {
            numberErrorDiv.textContent =
                "Invalid Input: Please enter a valid number between 1 & 12";
        } else {
            // send an alert if the error div is not found
            createAlert(
                "Invalid Input: Please enter a valid number between 1 & 12",
                "error"
            );
        }
        validatedObject.number = false;
    }
    calculateTotalCost();
    return true;
}

function validateLunch(lunchString) {
    // check if the input is true or false then set the boolean withLunch to the corresponding value
    if (lunchString === "true") {
        withLunch = true;
    } else if (lunchString === "false") {
        withLunch = false;
    } else {
        let lunchErrorDiv = document.getElementById("lunch-error");
        if (lunchErrorDiv) {
            lunchErrorDiv.textContent =
                "Invalid Input: Please select with or without lunch";
        } else {
            // send an alert if the error div is not found
            createAlert(
                "Invalid Input: Please  select with or without lunch",
                "error"
            );
        }
    }
    calculateTotalCost();
}

function validateRoute(selectedRoute) {
    // remove old error if present
    let routeErrorDiv = document.getElementById("route-error");
    if (routeErrorDiv) {
        routeErrorDiv.textContent = "";
    }
    // checks if the selected route is a valid option
    if (Object.keys(routeToPriceObject).includes(selectedRoute)) {
        route = routeToPriceObject[selectedRoute].name;
        validatedObject.route = true;
    } else {
        if (routeErrorDiv) {
            // set the error message under the input
            routeErrorDiv.textContent =
                "Invalid Input: Please select a valid route";
        } else {
            // send an alert if the error div is not found
            createAlert("Invalid Input: Please  select a valid route", "error");
        }
        validatedObject.route = false;
    }
    calculateTotalCost();
}

function validateDiscount(code) {
    // remove old error if present
    let discountErrorDiv = document.getElementById("discount-code-error");
    if (discountErrorDiv) {
        discountErrorDiv.textContent = "";
    }
    // create an array of just the codes and check if the code is in the array
    const codeMap = discountCodes.map((discount) => discount.code);
    if (codeMap.includes(code)) {
        discount = discountCodes[code];
    } else {
        if (discountErrorDiv) {
            discountErrorDiv.textContent = "The code entered is not valid";
        } else {
            // send an alert if the error div is not found
            createAlert("The code entered is not valid", "error");
        }
        return false;
    }
    calculateTotalCost();
    return true;
}

function validateDate(chosenDate) {
    // remove old error if present
    let routeErrorDiv = document.getElementById("date-error");
        if (routeErrorDiv) {
            routeErrorDiv.textContent = ""
        }
    try {
        const formattedDate = new Date(chosenDate);
        if (formattedDate <= Date.now()) {
            throw new Error("Tours cannot take place in the past!");
        }
        if (formattedDate.getHours() < 7 || formattedDate.getHours() > 10) {
            throw new Error("Tours can only start between 7 and 10");
        }
        date = chosenDate;
        validatedObject.date = true;
    } catch (error) {
        if (routeErrorDiv) {
            routeErrorDiv.textContent = error;
        } else {
            // send an alert if the error div is not found
            createAlert(error, "error");
        }
        validatedObject.date = false;
    }
}

function handleSubmit(event) {
    event.preventDefault();
    let invalidInputs = [];
    for (let [input, value] of Object.entries(validatedObject)) {
        if (!value) {
            invalidInputs.push(input);
        }
    }
    if (invalidInputs.length < 1) {
        calculateTotalCost();
        let [routeModal, dateModal, numberModal, lunchModal] =
            getModalElements();
        routeModal.textContent = route;
        dateModal.textContent = new Date(date).toUTCString();
        numberModal.textContent = numberOfPeople;
        lunchModal.textContent = withLunch;
        $("#booking-modal").modal().show();
    } else {
        createAlert(
            `Unable to submit form, please fix errors in: ${invalidInputs.join(
                ", "
            )}`,
            "error"
        );
    }
}

// check if the user has played the quiz and has a code stored in local storage
function autofillDisountCode() {
    // Get and see if a code is in local storage
    let discountCode = localStorage.getItem("code");
    // check to see if it a valid value and if it is a valid key in discount codes
    if (discountCode && Object.keys(discountCodes).includes(discountCode)) {
        discountInput.value = discountCode;
        discount = discountCodes[discountCode];
        createAlert("Discount has successfully been applied", "success");
    }
}

function getModalElements() {
    const routeModal = document.getElementById("route-modal");
    const dateModal = document.getElementById("date-modal");
    const numberModal = document.getElementById("number-modal");
    const lunchModal = document.getElementById("lunch-modal");
    return [routeModal, dateModal, numberModal, lunchModal];
}

autofillDisountCode();
