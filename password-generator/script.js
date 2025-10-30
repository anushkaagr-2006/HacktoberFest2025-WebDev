const passwordDisplay = document.getElementById("passwordDisplay");
const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const strengthMtr = document.querySelector(".strength-meter");
const symbolsCheckbox = document.getElementById("symbols");
const strengthBar = document.getElementById("strengthBar");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const clearBtn = document.getElementById("clearBtn");

// Character sets
const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

lengthSlider.addEventListener("input", () => {
  lengthValue.textContent = lengthSlider.value;
});

function generatePassword() {
  const length = lengthSlider.value;
  let chars = "";

  if (uppercaseCheckbox.checked) chars += upperChars;
  if (lowercaseCheckbox.checked) chars += lowerChars;
  if (numbersCheckbox.checked) chars += numberChars;
  if (symbolsCheckbox.checked) chars += symbolChars;

  if (chars === "") {
    passwordDisplay.value = "Select at least one option!";
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  passwordDisplay.value = password;
  updateStrength(password);
}

function updateStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 1) {
    strengthBar.style.width = "33%";
    strengthBar.style.backgroundColor = "#e74c3c";
    strengthBar.textContent = "Weak";
  } else if (strength === 2 || strength === 3) {
    strengthBar.style.width = "66%";
    strengthBar.style.backgroundColor = "#f1c40f";
    strengthBar.textContent = "Medium";
  } else {
    strengthBar.style.width = "100%";
    strengthBar.style.backgroundColor = "#2ecc71";
    strengthBar.textContent = "Strong";
  }
}

copyBtn.addEventListener("click", () => {
  if (
    passwordDisplay.value &&
    passwordDisplay.value !== "Select at least one option!"
  ) {
    navigator.clipboard.writeText(passwordDisplay.value);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  }
});

clearBtn.addEventListener("click", () => {
  passwordDisplay.value = "";
  strengthBar.style.width = "0%";
  strengthBar.textContent = "";
});

// Fisher Yates Algorithm for shuffling
function shuffleFunction(str) {
  let arr = str.split("");
  let currentIndex = arr.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }

  return arr.join("");
}

shuffleBtn.addEventListener("click", () => {
  const password = passwordDisplay.value;
  if (password && password !== "Select at least one option!") {
    passwordDisplay.value=shuffleFunction(password);
  }
});

generateBtn.addEventListener("click", ()=>{
  strengthMtr.style.display = "block";
  generatePassword();
});
