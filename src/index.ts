import "./styles.css";
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
  el.className = `mt-4 ${kind === "error" ? "text-red-600" : "text-emerald-600"}`;
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
      const result = await firebaseSignIn({
        email: emailInput.value.trim(),
        password: passwordInput.value,
      });
      showMessage(message, "Signed in successfully", "success");
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
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

    await saveUserProfile(result.user.uid, { name, email });

    showMessage(message, "Signed up successfully", "success");;
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    showMessage(message, friendlyError(code), "error");
  } finally {
    button.disabled = false;
  }
});
}
 
renderLogin();
