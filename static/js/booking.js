let discount = 0;
let totalCost = 0;
let numberOfPeople;
let route;
let fullname;
let withLunch = false;

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
    let total = document.getElementById("total-cost");
    try {
        if (route && numberOfPeople) {
            const routeAndCosts = Array.from(Object.values(routeToPriceObject));
            const routeWithPrice = routeAndCosts.filter(
                (route) => route.name === route
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

const discountCodes = [
    { code: "quiz-2", discount: 2 },
    { code: "quiz-4", discount: 4 },
    { code: "quiz-6", discount: 6 },
    { code: "quiz-8", discount: 8 },
    { code: "quiz-10", discount: 10 },
    { code: "quiz-12", discount: 12 },
    { code: "quiz-14", discount: 14 },
    { code: "quiz-16", discount: 16 },
    { code: "quiz-18", discount: 18 },
    { code: "quiz-20", discount: 20 },
];

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
    // ensure the name is longer than 3
    if (enteredFullname.length >= 3) {
        fullname = enteredFullname;
    } else {
        // attempt to set the error message in the error div under the import
        let fullnameErrorDiv = document.getElementById("fullname-error");
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
    }
}

function validateEmail(enteredEmail) {
    // ensure the name is longer than 3
    if (
        enteredEmail.includes("@") &&
        enteredEmail.length >= 5 &&
        enteredEmail.includes(".")
    ) {
        email = enteredEmail;
    } else {
        // attempt to set the error message in the error div under the import
        let emailErrorDiv = document.getElementById("email-error");
        if (emailErrorDiv) {
            emailErrorDiv.textContent =
                "Invalid Input: Please enter a valid email";
        } else {
            // send an alert if the error div is not found
            createAlert("Invalid Input: Please enter a valid email", "error");
        }
    }
}

function validateNumber(number) {
    // ensure the name is longer than 3
    if (number >= 1 && number <= 12) {
        numberOfPeople = number;
    } else {
        // attempt to set the error message in the error div under the import
        let numberErrorDiv = document.getElementById("number-error");
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
    }
    calculateTotalCost();
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
    // checks if the selected route is a valid option
    if (Object.keys(routeToPriceObject).includes(selectedRoute)) {
        route = routeToPriceObject[selectedRoute].cost;
    } else {
        let routeErrorDiv = document.getElementById("route-error");
        if (routeErrorDiv) {
            routeErrorDiv.textContent =
                "Invalid Input: Please select a valid route";
        } else {
            // send an alert if the error div is not found
            createAlert("Invalid Input: Please  select a valid route", "error");
        }
    }
    calculateTotalCost();
}

function validateDiscount(code) {
    // create an array of just the codes and check if the code is in the array
    const codeMap = discountCodes.map((discount) => discount.code);
    if (codeMap.includes(code)) {
        discount = discountCodes[code];
    } else {
        let discountErrorDiv = document.getElementById("discount-code-error");
        if (discountErrorDiv) {
            discountErrorDiv.textContent = "The code entered is not valid";
        } else {
            // send an alert if the error div is not found
            createAlert("The code entered is not valid", "error");
        }
    }
    calculateTotalCost();
}

// check if the user has played the quiz and has a code stored in local storage
function autofillDisountCode() {
    let discountCode = localStorage.getItem("code");
    if (discountCode) {
        discountInput.value = discountCode;
        discount = discountCodes[discountCode];
        createAlert("Discount has successfully been applied", "success");
    }
}
autofillDisountCode();
