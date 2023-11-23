"use strict";

// 💡 Check out Moment.js for dates

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale
// In the real world, we'd have an object with keys for every transaction 'movement' data recording such as Date, the Amount

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2013-05-18T21:31:17.178Z",
    "2013-06-23T07:42:02.383Z",
    "2023-07-28T09:15:04.904Z",
    "2023-09-18T10:17:24.185Z",
    "2023-09-25T14:11:59.604Z",
    "2023-09-30T17:01:17.194Z",
    "2023-10-01T23:36:17.929Z",
    "2023-10-02T18:01:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (locale, date) {
  // day / month / year
  // const now = new Date();
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // const hour = `${date.getHours()}`.padStart(2, 0);
  // const min = `${date.getMinutes()}`.padStart(2, 0);

  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / 1000 / 60 / 60 / 24);

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // return `${day}/${month}/${year} || ${hour}:${min}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// const displayMovements = function (movements, sort = false) {
//   containerMovements.innerHTML = "";

//   const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

//   movs.forEach(function (mov, i) {
//     const type = mov > 0 ? "deposit" : "withdrawal";

//     const html = `
//       <div class="movements__row">
//         <div class="movements__type movements__type--${type}">${
//       i + 1
//     } ${type}</div>
//         <div class="movements__value">${mov}€</div>
//       </div>
//     `;

//     containerMovements.insertAdjacentHTML("afterbegin", html);
//   });
// };

console.log();

// Aiming to construct function that can work in any other applications, by making it take in all data as parameters, not user data only in this app
const formatCurrency = function (value, locale, currency) {
  let number = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);

  return number;
};

// This function displays the transactions by default with the initials ones at the bottom, therefore from the bottom up
// When code even inside functions becomes too long, good to break it down into functions to increase modularity
const displayMovements = function (account, sort = false) {
  // It's a good practice to empty the HTML container before you insert things into it, especially when you don't need what was previously there
  containerMovements.innerHTML = "";

  console.log(account.movements);

  // Array to be used in case of sorting to avoid mutating original
  let movementsCopy = account.movements.slice();

  // Sorting in ascending Order
  movementsCopy = sort
    ? account.movementsCopy.sort((a, b) => a - b)
    : movementsCopy;

  movementsCopy.forEach(function (move, i) {
    // Deposit or Withdrawal?
    const type = move > 0 ? "deposit" : "withdrawal";

    // 🔴 MY OWN
    // Singular or plural
    const typeTense = i + 1 > 1 ? `${type}s` : type;

    // DATE
    const date = new Date(account.movementsDates[i]);

    // labelDate.textContent = `${day}/${month}/${year} || ${hour}:${min}`;
    // const displayDate = `${day}/${month}/${year} || ${hour}:${min}`;
    const displayDate = formatMovementDate(account.locale, date);

    // const formattedMovement = new Intl.NumberFormat(account.locale, {
    //   style: "currency",
    //   // currency: "USD",
    //   currency: account.currency,
    // }).format(move);

    const formattedMovement = formatCurrency(
      move,
      account.locale,
      account.currency
    );

    // This number formatting prioritises one's locale setting over the currency setting we set. In fact these two settings are independent
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${typeTense}
        </div>
        <div class="movements__date">${displayDate}</div>

        <!-- <div class="movements__value">${move.toFixed(2)}€</div> -->

        <div class="movements__value">${formattedMovement}</div>
      </div>
      `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// const calcDisplayBalance = function (acc) {
//   acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
//   labelBalance.textContent = `${acc.balance}€`;
// };

console.log();
const calcDisplayBalance = function (account) {
  account.balance = account.movements
    .reduce(function (accumulator, currentItem, i, arr) {
      // console.log(`Iteration ${i}: ${accumulator}`);

      return accumulator + currentItem;
    }, 0)
    .toFixed(2);

  // labelBalance.textContent = `${account.balance}€`;

  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

// const calcDisplaySummary = function (acc) {
//   const incomes = acc.movements
//     .filter((mov) => mov > 0)
//     .reduce((acc, mov) => acc + mov, 0);
//   labelSumIn.textContent = `${incomes}€`;

//   const out = acc.movements
//     .filter((mov) => mov < 0)
//     .reduce((acc, mov) => acc + mov, 0);
//   labelSumOut.textContent = `${Math.abs(out)}€`;

//   const interest = acc.movements
//     .filter((mov) => mov > 0)
//     .map((deposit) => (deposit * acc.interestRate) / 100)
//     .filter((int, i, arr) => {
//       // console.log(arr);
//       return int >= 1;
//     })
//     .reduce((acc, int) => acc + int, 0);
//   labelSumInterest.textContent = `${interest}€`;
// };

const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter((movement) => movement > 0)
    .reduce((accumulator, movement) => accumulator + movement, 0)
    .toFixed(2);

  // labelSumIn.textContent = `${incomes}€`;
  labelSumIn.textContent = formatCurrency(
    income,
    account.locale,
    account.currency
  );

  const withdrawals = account.movements
    .filter((movement) => movement < 0)
    .reduce((accumulator, movement) => accumulator + movement, 0)
    .toFixed(2);

  // labelSumOut.textContent = `${Math.abs(withdrawals)}€`;
  labelSumOut.textContent = formatCurrency(
    Math.abs(withdrawals),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter((movement) => movement > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest, i, arr) => {
      console.log(arr);
      return interest >= 1;
    })
    .reduce((accumulator, interest) => accumulator + interest, 0)
    .toFixed(2);

  // labelSumInterest.textContent = `${interest}€`;
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);
console.log(accounts);

const updateUI = function (account) {
  // Display movements
  displayMovements(account);

  // Display balance
  calcDisplayBalance(account);

  // Display summary
  calcDisplaySummary(account);
};

// Point of this timer is to track inactivity
const startLogOutTimer = function () {
  // Set time to 5 minutes
  // 100 milliseconds in every second
  let time = 300000;

  // CAll the timer every second
  const tickTock = function () {
    let timeInSeconds = Math.trunc(time / 1000);

    let minutes = `${Math.trunc(timeInSeconds / 60)}`.padStart(2, 0);
    let seconds = `${Math.trunc(timeInSeconds % 60)}`.padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${minutes}:${seconds}`;

    // When 0 seconds, stop timer and log user out
    // Check for current time before updating it, to understand correct info flow, you have to consider the code printing info to browser, the time subtractor, and the time remainder checker, (all 3) that's why time subtractor comes last
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    // Decrease time: Have to decrease time in milliseconds but it's really decreasing every second.
    time -= 1000;
  };

  // We execute function before starting its interval because the interval function will start after the interval time, so it will start after 1 second
  tickTock();
  const timer = setInterval(tickTock, 1000);

  return timer;
};

///////////////////////////////////////

// btnLogin.addEventListener("click", function (e) {
//   // Prevent form from submitting
//   e.preventDefault();

//   currentAccount = accounts.find(
//     (acc) => acc.username === inputLoginUsername.value
//   );
//   console.log(currentAccount);

// Notice that I've used 'Optional Chaining' but it still doesn't check whether the object exists, rather is mostly used to check whether an object 'PROPERTY' exists
//   if (currentAccount?.pin === Number(inputLoginPin.value)) {
//     // Display UI and message
//     labelWelcome.textContent = `Welcome back, ${
//       currentAccount.owner.split(" ")[0]
//     }`;
//     containerApp.style.opacity = 100;

//     // Clear input fields
//     inputLoginUsername.value = inputLoginPin.value = "";
//     inputLoginPin.blur();

//     // Update UI
//     updateUI(currentAccount);
//   }
// });

// btnTransfer.addEventListener("click", function (e) {
//   e.preventDefault();
//   const amount = Number(inputTransferAmount.value);
//   const receiverAcc = accounts.find(
//     (acc) => acc.username === inputTransferTo.value
//   );
//   inputTransferAmount.value = inputTransferTo.value = "";

//   if (
//     amount > 0 &&
//     receiverAcc &&
//     currentAccount.balance >= amount &&
//     receiverAcc?.username !== currentAccount.username
//   ) {
//     // Doing the transfer
//     currentAccount.movements.push(-amount);
//     receiverAcc.movements.push(amount);

//     // Update UI
//     updateUI(currentAccount);
//   }
// });

// btnLoan.addEventListener("click", function (e) {
//   e.preventDefault();

//   // const amount = Number(inputLoanAmount.value);
//   const amount = Math.floor(inputLoanAmount.value);

//   if (
//     amount > 0 &&
//     currentAccount.movements.some((mov) => mov >= amount * 0.1)
//   ) {
//     // Add movement
//     currentAccount.movements.push(amount);

//     // Update UI
//     updateUI(currentAccount);
//   }
//   inputLoanAmount.value = "";
// });

// btnClose.addEventListener("click", function (e) {
//   e.preventDefault();

//   if (
//     inputCloseUsername.value === currentAccount.username &&
//     Number(inputClosePin.value) === currentAccount.pin
//   ) {
//     const index = accounts.findIndex(
//       (acc) => acc.username === currentAccount.username
//     );
//     console.log(index);
//     // .indexOf(23)

//     // Delete account
//     accounts.splice(index, 1);

//     // Hide UI
//     containerApp.style.opacity = 0;
//   }

//   inputCloseUsername.value = inputClosePin.value = "";
// });

// Event Handler
// This 'click' event will trigger also for pressing 'Enter'

// let sorted = false;
// btnSort.addEventListener("click", function (e) {
//   e.preventDefault();
//   displayMovements(currentAccount.movements, !sorted);
//   sorted = !sorted;
// });
console.log();

// Event handlers

// We need these two variables to persist amongst different logged-in users
let currentAccount, timer;

////////////////////////////////////////////////////////////
// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Create current date and time
// DATE
const now = new Date();

const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
};

const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);
labelDate.textContent = `${day}/${month}/${year} || ${hour}:${min}`;

// Using Internationalization API

// GETTING locale from Browser
const locale = navigator.language;
// en-GB
console.log(locale);

// Formatting the date and time according to a certain region
labelDate.textContent = new Intl.DateTimeFormat("en-US").format(now);
labelDate.textContent = new Intl.DateTimeFormat("en-UK").format(now);
labelDate.textContent = new Intl.DateTimeFormat("ar-eg").format(now);
// Formatting the date and time according to region and custom optional formatting preferences
labelDate.textContent = new Intl.DateTimeFormat("pt-PT", options).format(now);
// Formatting the date and time according to browser region
labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();
  console.log("LOGIN");

  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  // Notice that we have used 'Optional chaining'
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log("Pin accessed");

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    // Clear input fields for after loggin in
    inputLoginUsername.value = inputLoginPin.value = "";

    // Lose input field focus after loggin in
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);

    // Make the user information visible
    containerApp.style.opacity = 100;

    // Create current date and time
    // DATE
    const now = new Date();

    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };

    // day / month / year
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year} || ${hour}:${min}`;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Initiating the LogOut timer
    if (timer) {
      clearInterval(timer);
      console.log(
        `The timer for ${currentAccount.owner} has just started and any other pre-existing ones have been removed`
      );
    }
    timer = startLogOutTimer();
  } else {
    console.log("I Don't recognise this account");
    containerApp.style.opacity = 0;
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);

  const receiverAccount = accounts.find(
    (account) => account.username === inputTransferTo.value
  );

  console.log(receiverAccount, amount);

  // Analyzing transfer eligibility
  // Notice that I've used 'Optional Chaining' but it still doesn't check whether the object exists, rather is mostly used to check whether an object 'PROPERTY' exists
  if (
    receiverAccount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    if (amount > 0 && amount < currentAccount.balance) {
      console.log("Transfer is valid");

      // Transferring cash
      currentAccount.movements.push(-amount);
      receiverAccount.movements.push(amount);

      // Add Transfer Date
      // currentAccount.movementsDates.push(new Date());
      // receiverAccount.movementsDates.push(new Date());
      // 🔴 MY OWN for original array conformity purposes
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAccount.movementsDates.push(new Date().toISOString());
      console.log(currentAccount.movementsDates);
      console.log(receiverAccount.movementsDates);

      // UPdating UI
      updateUI(currentAccount);

      // Clearing input fields and removing focus
      inputTransferAmount.value = inputTransferTo.value = "";
      inputTransferAmount.blur();
      inputTransferTo.blur();
    } else {
      console.log("Enter a 'valid' amount that your account possesses");
    }
  } else {
    console.log("Make sure account exists and is not your same account");
  }

  // Resetting Inactivity Timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0) {
    if (currentAccount.movements.some((movement) => movement >= 0.1 * amount)) {
      // We set a timeout to simulate a real bank's delay of granting a loan
      setTimeout(function () {
        // Add movement transaction
        currentAccount.movements.push(amount);
        console.log(currentAccount.movements);

        // adding the Loan Date
        // currentAccount.movementsDates.push(new Date());
        // 🔴 MY OWN for original array conformity purposes
        currentAccount.movementsDates.push(new Date().toISOString());
        console.log(currentAccount.movementsDates);

        // Update UI
        updateUI(currentAccount);
      }, 2500);

      // Clearing input fields and removing focus
      inputLoanAmount.value = "";
      inputLoanAmount.blur();

      console.log(`Loan request of ${currentAccount.owner} accepted`);
    } else {
      console.log("Make sure you have adequate funds in your account");
    }
  } else {
    console.log("Make sure you enter a valid loan amount");
  }

  // Resetting Inactivity Timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  // This will help in making sure account still exists and in deleting account
  const index = accounts.findIndex(
    (account, i, arr) => account.username === currentAccount.username
  );
  // accounts.indexOf()

  if (index >= 0 && inputCloseUsername.value === currentAccount.username) {
    if (Number(inputClosePin.value) === currentAccount.pin) {
      console.log(
        `Closing Account of: ${currentAccount.username} of Index: ${index}`
      );

      // Delete account
      accounts.splice(index, 1);

      inputCloseUsername.value = inputClosePin.value = "";

      // Hide UI
      containerApp.style.opacity = 0;
    } else {
      console.log("Enter correct Pin");
    }
  } else {
    console.log("Make sure account exists and is your own account");
  }
});

let sortedState = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  sortedState = !sortedState;
  displayMovements(currentAccount.movements, sortedState);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// In JS, all numbers are internally represented as Decimals irrespective of how we enter them
// Numbers are stored in a 64 Base 2 format, which is binary format
// Some numbers are very difficult to present in Base 2 such as 0.1
console.log(23 === 23.0);
// Returns true
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

// Conversion
console.log(Number("23"));
console.log(+"23"); // Operator Type Coersion

// Parsing
// (str, base)
console.log(Number.parseInt("30px", 10));
console.log(Number.parseInt("e23", 10));

console.log(Number.parseInt("  2.5rem  "));
console.log(Number.parseFloat("  2.5rem  "));

// Better to use above methods though
// This is Older / Traditional way of doing things
console.log(parseFloat("  2.5rem  "));

// Check if value is NaN: Not a Number
console.log(Number.isNaN(20));
console.log(Number.isNaN("20"));
console.log(Number.isNaN(+"20X"));
console.log(Number.isNaN(23 / 0));

console.log(isNaN("23")); // Performs type coercion

// Checking if value is Number
console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger("23"));

///////////////////////////////////////////////////////// LEESSON #171: MATH AND ROUNDING

console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, "23", 11, 2));
console.log(Math.max(5, 18, "23px", 11, 2));

console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.PI * Number.parseFloat("10px") ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

// Function to generate random number between two values
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;

console.log(randomInt(10, 20));

// Rouding To INtegers
console.log(Math.trunc(23.5));
console.log(Math.round(23.5));

console.log(Math.ceil(23.3));
console.log(Math.ceil(24.0));

console.log(Math.floor(23.3));
console.log(Math.floor("23.9"));

console.log(Math.trunc(23.3));

// trunc is like a magnet pulling a number back to 0
// floor simply goes back to the less number
console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));

// Rouding Decimals
// Since primitives don't have methods, JS will convert these into Number objects, apply the method and then convert them back
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));

let x0 = (2.345).toFixed(2);
console.log(typeof x0, x0);

let x1 = +(2.345).toFixed(2);
console.log(typeof x1, x1);

//////////////////////////////////////////////////////////// LESSON #172: The REMAINDER Operator

console.log(5 % 2);
console.log(5 / 2);

console.log(8 % 3);
console.log(8 / 3);

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = (n) => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));

labelBalance.addEventListener("click", function () {
  [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
    if (i % 2 === 0) {
      //row.style.backgroundColor = "#bac8ff";
      row.classList.add("even-movements-colored");
    }
    if (i % 3 == 0) row.style.backgroundColor = "#bac8ff";
  });
});

//////////////////////////////////////////////////////// LESSON #173: NUMERIC Separators

let diameter = 287460000000;
console.log(diameter);

diameter = 287_460_000_000;
console.log(diameter);

const priceCents = 345_99;
console.log(priceCents);

const transferFee = 15_00;
const transferFee1 = 1_500;
console.log(transferFee);
console.log(transferFee1);

let PI = 3.14_15;
console.log(PI);

//  PI = 3._1415;
// console.log(PI);

//  PI = 3_.1415;
// console.log(PI);

//  PI = _3.1415;
// console.log(PI);

// PI = 3.1415_;
// console.log(PI);

// PI = 3.141__5;
// console.log(PI);

// TRying to convert strings that contain the separator (underscore) to a number doesn't work as expected
// Therefore not advised to use these when working with APIs and other places where usually needed to parse items
console.log(Number("230_000"));

////////////////////////////////////////////////////// LESSON #174:

// JS can't represent numbers larger than these safely
// Doing calculations with numbers beyond these might result in losing precision
console.log(2 ** 53 - 1);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);
console.log(Number.MIN_SAFE_INTEGER);
console.log(Number.MAX_SAFE_INTEGER);

console.log(902348945287942738275489572934298471987982);

// Big Integer notation
console.log(902348945287942738275489572934298471987982n);
console.log(BigInt(902348945287942738275489572934298471987982));

console.log(10000n + 10000n);
console.log(BigInt(10000) + BigInt(10000));
console.log(BigInt(10000) + 10000n);

// Can't multiply non BigInts with BigInts
const huge = 92343530539835389583n;
const num = 23;
console.log(huge * BigInt(num));

console.log(20n > 15);
console.log(20n, 20);
console.log(20n == 20);
console.log(20n === 20);
console.log(typeof 20, typeof 20n);
console.log(20n == "20");

console.log(huge + " is REALLY big");

// Divisions
console.log(11n / 3n);
console.log(11 / 3);
console.log(12n / 3n);
console.log(11n - 3n);

//////////////////////////////////////////////////////////// LESSON #175: Creating Dates

// Fri Sep 29 2023 16:07:52 GMT-0700 (Pacific Daylight Time)
const now1 = new Date();
console.log(now1);

// Sun Aug 02 2020 18:05:43 GMT-0700 (Pacific Daylight Time)
let myDate = new Date("Aug 02 2020 18:05:43");
console.log(myDate);

// Fri Dec 24 1999 00:00:00 GMT-0800 (Pacific Standard Time)
myDate = new Date("December 24, 1999");
myDate = new Date("December 24 1999");
console.log(myDate);

// ['2019-11-18T21:31:17.178Z', '2019-12-23T07:42:02.383Z', '2020-01-28T09:15:04.904Z', '2020-04-01T10:17:24.185Z', '2020-05-08T14:11:59.604Z', '2020-05-27T17:01:17.194Z', '2020-07-11T23:36:17.929Z', '2020-07-12T10:51:36.790Z']0: "2019-11-18T21:31:17.178Z"1: "2019-12-23T07:42:02.383Z"2: "2020-01-28T09:15:04.904Z"3: "2020-04-01T10:17:24.185Z"4: "2020-05-08T14:11:59.604Z"5: "2020-05-27T17:01:17.194Z"6: "2020-07-11T23:36:17.929Z"7: "2020-07-12T10:51:36.790Z"length: 8[[Prototype]]: Array(0)
console.log(account1.movementsDates);

// ❌ NOTICE THIS ONE DID NOT PARSE PROPERLY because the string is in UTC timezone and it will print out in PST zone
// Mon Nov 18 2019 13:31:17 GMT-0800 (Pacific Standard Time)
console.log(new Date(account1.movementsDates[0]));

// ✅ Mon, 18 Nov 2019 21:31:17 GMT
console.log(new Date(account1.movementsDates[0]).toUTCString());
console.log(new Date("2019-11-18T21:31:17.178Z").toUTCString());
// 💡 .178Z - 178 microseconds Zulu time

// 💡 Months start from index '0'
// Thu Nov 19 2037 15:23:05 GMT-0800 (Pacific Standard Time)
console.log(new Date(2037, 10, 19, 15, 23, 5));

// 💡 The Date objects auto-corrects
// Thu Dec 03 2037 00:00:00 GMT-0800 (Pacific Standard Time)
console.log(new Date(2037, 10, 33));
// Tue Dec 01 2037 00:00:00 GMT-0800 (Pacific Standard Time)
console.log(new Date(2037, 10, 31));
// Mon Nov 30 2037 00:00:00 GMT-0800 (Pacific Standard Time)
console.log(new Date(2037, 10, 30));
// Sat Jan 02 2038 00:00:00 GMT-0800 (Pacific Standard Time)
console.log(new Date(2037, 11, 33));

// Wed Dec 31 1969 16:00:00 GMT-0800 (Pacific Standard Time)
console.log(new Date(0));

// 💡 TimeStamp is for seconds that have passed since January 1st 1970
// Timestamp for Day #003
// Sat Jan 03 1970 16:00:00 GMT-0800 (Pacific Standard Time)
console.log(new Date(3 * 24 * 60 * 60 * 1000));

// Working with Dates
const future = new Date(2037, 10, 19, 15, 23);

// Thu Nov 19 2037 15:23:00 GMT-0800 (Pacific Standard Time)
console.log(future);

// 💡 Making a date object out of a date object
// Thu Nov 19 2037 15:23:00 GMT-0800 (Pacific Standard Time)
console.log(new Date(future));

// ❌ Never use .getYear();
// 2037
console.log(future.getFullYear());

// 10
console.log(future.getMonth());

// 19
console.log(future.getDate());

// 4
// Thursday
// Sunday will be '0'
console.log(future.getDay());

// 15
console.log(future.getHours());

// 23
console.log(future.getMinutes());

// 0
console.log(future.getSeconds());

// ❌ GMT / UTC timezone though
// 2037-11-19T23:23:00.000Z
console.log(future.toISOString());

// ❌ GMT / UTC timezone though
// Thu, 19 Nov 2037 23:23:00 GMT
console.log(future.toUTCString());

// ✅ 2037-11-19, 3:23:00 p.m.
console.log(future.toLocaleString());

// GEt TimeStamp
console.log(future.getTime());
// 2142285780000

// REversing TimeStamp to get the Date
// Thu Nov 19 2037 15:23:00 GMT-0800 (Pacific Standard Time)
console.log(new Date(2142285780000));

// Fri Sep 29 2023 16:44:46 GMT-0700 (Pacific Daylight Time)
console.log(new Date());

// Present TimeStamp
// 1696031124570
console.log(Date.now());

future.setFullYear(2040);
// Mon Nov 19 2040 15:23:00 GMT-0800 (Pacific Standard Time)
console.log(future);

///////////////////////////////////////////////////////////// LESSON #177: Operations with Dates

const future1 = new Date(2037, 10, 19, 15, 23);

// Thu Nov 19 2037 15:23:00 GMT-0800 (Pacific Standard Time)
console.log(future1);

// 2142285780000
console.log(+future1);

// 2142285780000
console.log(Number(future1));

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / 1000 / 60 / 60 / 24;

const days1 = calcDaysPassed(new Date(2037, 3, 24), new Date(2037, 3, 14));

// Converted to days: 10days
console.log(days1);

///////////////////////////////////////////////////////////// LESSON #178: INTERNATIONALIZING DATES (Intl)

// https://www.andiamo.co.uk/resources/iso-language-codes/

// Create current date and time
// DATE
const now2 = new Date();

const options1 = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
};

const day1 = `${now2.getDate()}`.padStart(2, 0);
const month1 = `${now2.getMonth() + 1}`.padStart(2, 0);
const year1 = now2.getFullYear();
const hour1 = `${now2.getHours()}`.padStart(2, 0);
const min1 = `${now2.getMinutes()}`.padStart(2, 0);
console.log(`${day1}/${month1}/${year1} || ${hour1}:${min1}`);

/////////////////////////////////////////////////////////// LESSON #179: INTERNATIONALIZING NUMBERS (Intl)

// https://www.andiamo.co.uk/resources/iso-language-codes/

const num1 = 38845123532.23;

// Important to define the currency cause it's not implied from the number format object setting
const options2 = {
  style: "currency",
  unit: "celsius",
  currency: "EUR",
  // useGrouping: false
};
console.log(`Original: ${num1}`);

console.log("US:     ", new Intl.NumberFormat("en-US").format(num1));
console.log("Germany:", new Intl.NumberFormat("de-DE").format(num1));
console.log("Syria   ", new Intl.NumberFormat("ar-SY").format(num1));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options2).format(num1)
);

///////////////////////////////////////////////////////////// LESSON #180: Timers: setTimeout and setInterval

// #001: setTimeout
setTimeout(() => console.log("Here is your pizza 🍕"), 3000);

console.log(
  "⏳ Here to show you that code execution continues immediately past timeout function, doesn't wait for it ⏳"
);

const ingredients = ["olives", "spinach"];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  1500,
  ...ingredients
);

console.log("Executing, not waiting for timeout function");

// Clearing Timer
if (ingredients.includes("spinach")) {
  clearTimeout(pizzaTimer);
}

// #002: setInterval
const myInterval = setInterval(function () {
  const now = new Date();
  console.log(now);
}, 2000);

// 🔴 MY OWN
// Using timeout function to clear interval function
setTimeout(
  function (interval) {
    clearInterval(interval);
    console.log(
      "🎬 Alright, the interval function is coming to a close, chow chow 🙋🏾‍♂️"
    );
  },
  6500,
  myInterval
);
