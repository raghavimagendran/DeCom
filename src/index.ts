import "./login/loginPage.css";
import loginPageHtml from "./login/LoginPage.html?raw";
import signUpPageHtml from "./signup/SignUp.html?raw";
import { firebaseSignIn, firebaseSignUp } from "../firebase/AuthService";
import { saveUserProfile } from "../firebase/UserService";
 
const app = document.querySelector<HTMLDivElement>("#app")!;
 
function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found in the page HTML`);
  return el as T;
}
 
function showMessage(el: HTMLElement, text: string, kind: "error" | "success") {
  el.textContent = text;
  el.className = `form-message form-message--${kind}`;
}
 
function friendlyError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "That email is already registered. Try logging in.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}
 
function renderLogin() {
  app.innerHTML = loginPageHtml;
 
  const form = getEl<HTMLFormElement>("login-form");
  const emailInput = getEl<HTMLInputElement>("email");
  const passwordInput = getEl<HTMLInputElement>("password");
  const button = getEl<HTMLButtonElement>("login-btn");
  const message = getEl<HTMLParagraphElement>("form-message");
 
  getEl<HTMLAnchorElement>("go-signup").addEventListener("click", (e) => {
    e.preventDefault();
    renderSignUp();
  });
 
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";
    button.disabled = true;
 
    try {
      console.log("1. submitting");
      const result = await firebaseSignIn({
        email: emailInput.value.trim(),
        password: passwordInput.value,
      });
      console.log("2. auth account created", result.user.uid);
      showMessage(message, "Signed up successfully", "success");
      console.log("3. profile saved");


showMessage(message, "Signed up successfully", "success");
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      console.error("Sign-in failed:", code);
      showMessage(message, friendlyError(code), "error");
    } finally {
      button.disabled = false;
    }
  });
}
 
function renderSignUp() {
  
  app.innerHTML = signUpPageHtml;
 
  const form = getEl<HTMLFormElement>("signup-form");
  const nameInput = getEl<HTMLInputElement>("name");
  const emailInput = getEl<HTMLInputElement>("email");
  const passwordInput = getEl<HTMLInputElement>("password");
  const confirmInput = getEl<HTMLInputElement>("confirm-password");
  const button = getEl<HTMLButtonElement>("signup-btn");
  const message = getEl<HTMLParagraphElement>("form-message");
 
  getEl<HTMLAnchorElement>("go-login").addEventListener("click", (e) => {
    e.preventDefault();
    renderLogin();
  });
 
  form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("A. signup submit fired");
  message.textContent = "";

  if (passwordInput.value !== confirmInput.value) {
    showMessage(message, "Passwords do not match.", "error");
    return;
  }

  button.disabled = true;
  try {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    const result = await firebaseSignUp({
      email,
      password: passwordInput.value,
      displayName: name,
    });
    console.log("B. auth account created:", result.user.uid);

    await saveUserProfile(result.user.uid, { name, email });
    console.log("C. profile saved");

    showMessage(message, "Signed up successfully", "success");
    console.log("D. message shown", {
    connected: message.isConnected,
    text: message.textContent,
    matches: document.querySelectorAll("#form-message").length,
});
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    console.error("Sign-up failed:", err);
    showMessage(message, friendlyError(code), "error");
  } finally {
    button.disabled = false;
  }
});
}
 
renderLogin();
