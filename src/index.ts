import "./styles.css";
import loginPageHtml from "./login/LoginPage.html?raw";
import signUpPageHtml from "./signup/SignUp.html?raw";
import { firebaseSignIn, firebaseSignUp } from "../firebase/AuthService";

const app = document.querySelector("#app") as HTMLDivElement;

function showLogin() {
  app.innerHTML = loginPageHtml;

  const form = document.getElementById("login-form") as HTMLFormElement;
  const email = document.getElementById("email") as HTMLInputElement;
  const password = document.getElementById("password") as HTMLInputElement;
  const message = document.getElementById("form-message") as HTMLParagraphElement;
  const goSignup = document.getElementById("go-signup") as HTMLAnchorElement;

  goSignup.addEventListener("click", (e) => {
    e.preventDefault();
    showSignUp();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    try {
      await firebaseSignIn({ email: email.value, password: password.value });
      message.textContent = "Signed in successfully";
      message.className = "mt-4 text-emerald-600";
    } catch {
      message.textContent = "Incorrect email or password.";
      message.className = "mt-4 text-red-600";
    }
  });
}

function showSignUp() {
  app.innerHTML = signUpPageHtml;

  const form = document.getElementById("signup-form") as HTMLFormElement;
  const name = document.getElementById("name") as HTMLInputElement;
  const email = document.getElementById("email") as HTMLInputElement;
  const password = document.getElementById("password") as HTMLInputElement;
  const confirm = document.getElementById("confirm-password") as HTMLInputElement;
  const message = document.getElementById("form-message") as HTMLParagraphElement;
  const goLogin = document.getElementById("go-login") as HTMLAnchorElement;

  goLogin.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    if (password.value !== confirm.value) {
      message.textContent = "Passwords do not match.";
      message.className = "mt-4 text-red-600";
      return;
    }

    try {
      await firebaseSignUp({
        email: email.value,
        password: password.value,
        displayName: name.value,
      });
      message.textContent = "Signed up successfully";
      message.className = "mt-4 text-emerald-600";
    } catch {
      message.textContent = "Could not sign up. Please try again.";
      message.className = "mt-4 text-red-600";
    }
  });
}

showLogin();