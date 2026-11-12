import "./login/loginPage.css";
import loginPageHtml from "./login/LoginPage.html?raw";
import { firebaseSignIn } from "../firebase/AuthService";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = loginPageHtml;

const form = document.getElementById("login-form") as HTMLFormElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const message = document.getElementById("form-message") as HTMLParagraphElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";

  try {
    const result = await firebaseSignIn({
      email: emailInput.value.trim(),
      password: passwordInput.value,
    });

    console.log("Signed in successfully", result.user.email);
    message.textContent = "Signed in successfully";
    message.className = "form-message form-message--success";
  } catch (err) {
    console.error("Sign-in failed:", (err as { code?: string }).code);
    message.textContent = "Incorrect email or password.";
    message.className = "form-message form-message--error";
  }
});