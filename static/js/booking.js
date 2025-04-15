let discount = 0;
let totalCost = 0;
let amountSaved = 0;
let numberOfPeople = 1;
let route;
let fullname;
let withLunch = false;
let date;
let email;
let total = document.getElementById("total-cost");
let amountSavedSpan = document.getElementById("amount-saved");
let totalCostModal = document.getElementById("total-cost-modal");
let amountSavedModal = document.getElementById("amount-saved-modal");

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

// simulates a successful form submission to the backend and notifies the user
const enquiryBtn = document.getElementById("handle-enquiry");
if (enquiryBtn) {
    enquiryBtn.addEventListener("click", () => {
        createAlert("Booking Enquiry successfully submitted", "success");
        // reset the form to initial state
        form.reset();
        amountSaved = 0;
        totalCost = 0;
        total.textContent = totalCost;
        amountSavedSpan.textContent = 0;
        totalCostModal.textContent = 0;
        amountSavedModal.textContent = 0;
    });
} else {
    createAlert("Unable to complete booking, please try again", "error");
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
                    amountSaved = groupPrice * discount;
                    groupPrice = groupPrice - amountSaved;
                }

                // display the calculated prices and have only 2 decimal places
                total.textContent = groupPrice.toFixed(2);
                totalCostModal.textContent = `€ ${groupPrice.toFixed(2)}`;
                amountSavedSpan.textContent = amountSaved.toFixed(2);
                amountSavedModal.textContent = `€ ${amountSaved.toFixed(2)}`;
            } else {
                throw new Error("Route Selected Not Valid");
            }
        }
    } catch (error) {
        createAlert(error, "error");
    }
}

const discountCodes = {
    "quiz-2": 0.02,
    "quiz-4": 0.04,
    "quiz-6": 0.06,
    "quiz-8": 0.08,
    "quiz-10": 0.1,
    "quiz-12": 0.12,
    "quiz-14": 0.14,
    "quiz-16": 0.16,
    "quiz-18": 0.18,
    "quiz-20": 0.2,
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
        fullnameErrorDiv.textContent = "";
        // add a red border to the input element to highlight error
        fullnameErrorDiv.previousElementSibling.classList.remove(
            "error-border"
        );
    }
    // ensure the name is longer than 3
    if (enteredFullname.length >= 3) {
        fullname = enteredFullname;
        validatedObject.fullname = true;
    } else {
        // attempt to set the error message in the error div under the import
        if (fullnameErrorDiv) {
            // add a red border to the input element to highlight error
            fullnameErrorDiv.previousElementSibling.classList.add(
                "error-border"
            );
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
    const emailErrorDiv = document.getElementById("email-error");
    if (emailErrorDiv) {
        emailErrorDiv.textContent = "";
        // add a red border to the input element to highlight error
        emailErrorDiv.previousElementSibling.classList.remove("error-border");
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
            // add a red border to the input element to highlight error
            emailErrorDiv.previousElementSibling.classList.add("error-border");
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
        // add a red border to the input element to highlight error
        numberErrorDiv.previousElementSibling.classList.remove("error-border");
    }
    // ensure the name is longer than 3
    if (number >= 1 && number <= 12) {
        numberOfPeople = number;
        validatedObject.number = true;
    } else {
        // attempt to set the error message in the error div under the import
        if (numberErrorDiv) {
            // add a red border to the input element to highlight error
            numberErrorDiv.previousElementSibling.classList.add("error-border");
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
    let lunchErrorDiv = document.getElementById("lunch-error");
    // reset the state of the input pre-validation
    if (lunchErrorDiv) {
        lunchErrorDiv.previousElementSibling.classList.remove("error-border");
        lunchErrorDiv.textContent = "";
    }
    // check if the input is true or false then set the boolean withLunch to the corresponding value
    if (lunchString === "true") {
        withLunch = true;
    } else if (lunchString === "false") {
        withLunch = false;
    } else {
        if (lunchErrorDiv) {
            // add a red border to the input element to highlight error
            lunchErrorDiv.previousElementSibling.classList.add("error-border");
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
        routeErrorDiv.previousElementSibling.classList.remove("error-border");
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
            // add a red border to the input element to highlight error
            routeErrorDiv.previousElementSibling.classList.add("error-border");
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
        discountErrorDiv.previousElementSibling.classList.remove(
            "error-border"
        );
        discountErrorDiv.textContent = "";
    }
   
    if (discountCodes[code]) {
        discount = discountCodes[code];
    } else {
        if (discountErrorDiv) {
            // add a red border to the input element to highlight error
            discountErrorDiv.previousElementSibling.classList.add(
                "error-border"
            );
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
        routeErrorDiv.textContent = "";
        routeErrorDiv.previousElementSibling.classList.remove("error-border");
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
            // add a red border to the input element to highlight error
            routeErrorDiv.previousElementSibling.classList.add("error-border");
        } else {
            // send an alert if the error div is not found
            createAlert(error, "error");
        }
        validatedObject.date = false;
    }
}

function handleSubmit(event) {
    // stop the default behaviour of the form
    event.preventDefault();
    let invalidInputs = [];
    // loop through and check if all inputs have been validated
    for (let [input, value] of Object.entries(validatedObject)) {
        if (!value) {
            invalidInputs.push(input);
        }
    }
    // if there are no invalid inputs
    if (invalidInputs.length < 1) {
        calculateTotalCost();
        let [routeModal, dateModal, numberModal, lunchModal] =
            getModalElements();
        routeModal.textContent = route;
        dateModal.textContent = new Date(date).toUTCString();
        numberModal.textContent = numberOfPeople;
        // Use of ternary operator to make selction readable
        lunchModal.textContent = withLunch ? "Yes" : "No";
        // trigger the modal
        $("#booking-modal").modal().show();
    } else {
        // show the users the inputs that need to be fixed
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
