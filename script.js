const COMMON_PASSWORDS = [
  "password", "123456", "12345678", "qwerty", "abc123",
  "monkey", "1234567", "letmein", "trustno1", "dragon",
  "baseball", "iloveyou", "master", "sunshine", "ashley",
  "michael", "shadow", "123123", "654321", "password1",
];

function checkStrength(password) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\;'/`~]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const isCommon = COMMON_PASSWORDS.includes(password.toLowerCase());

  const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["", "#ff4444", "#ff8800", "#ffcc00", "#88cc00", "#4ecca3"];
  const widths = ["0%", "20%", "40%", "60%", "80%", "100%"];

  const effectiveScore = isCommon ? Math.min(score, 1) : score;

  return {
    score: effectiveScore,
    label: isCommon ? "Common password!" : labels[score],
    color: colors[effectiveScore],
    width: widths[effectiveScore],
    checks,
  };
}

function generatePassword(length = 16) {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const specials = "!@#$%^&*()_+-=";
  const all = upper + lower + digits + specials;

  const required = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    specials[Math.floor(Math.random() * specials.length)],
  ];

  for (let i = required.length; i < length; i++) {
    required.push(all[Math.floor(Math.random() * all.length)]);
  }

  for (let i = required.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [required[i], required[j]] = [required[j], required[i]];
  }

  return required.join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const strengthBar = document.getElementById("strength-bar");
  const strengthLabel = document.getElementById("strength-label");
  const requirementItems = document.querySelectorAll("#requirements li");
  const toggleBtn = document.getElementById("toggle-visibility");
  const generateBtn = document.getElementById("generate");
  const generatedContainer = document.getElementById("generated-password");
  const generatedText = document.getElementById("generated-text");
  const copyBtn = document.getElementById("copy");

  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;

    if (!password) {
      strengthBar.style.width = "0%";
      strengthBar.style.backgroundColor = "transparent";
      strengthLabel.textContent = "";
      requirementItems.forEach((li) => {
        li.classList.remove("met");
        li.querySelector(".icon").textContent = "✗";
      });
      return;
    }

    const result = checkStrength(password);

    strengthBar.style.width = result.width;
    strengthBar.style.backgroundColor = result.color;
    strengthLabel.textContent = result.label;
    strengthLabel.style.color = result.color;

    requirementItems.forEach((li) => {
      const check = li.dataset.check;
      const passed = result.checks[check];
      li.classList.toggle("met", passed);
      li.querySelector(".icon").textContent = passed ? "✓" : "✗";
    });
  });

  toggleBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggleBtn.textContent = isPassword ? "🙈" : "👁️";
  });

  generateBtn.addEventListener("click", () => {
    const password = generatePassword();
    generatedText.textContent = password;
    generatedContainer.hidden = false;

    passwordInput.value = password;
    passwordInput.dispatchEvent(new Event("input"));
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(generatedText.textContent).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
    });
  });
});
