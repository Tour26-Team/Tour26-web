import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "../firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ========== AUTH LISTENER ==========
onAuthStateChanged(auth, async (user) => {
  const path = window.location.pathname;

  const isAuthpage =
    path.includes("index") || path.includes("register") || path === "/";

  const createTourBtn = document.getElementById("createTourBtn");
  const signOutBtn = document.getElementById("signOutBtn");

  const uidInfoText = document.getElementById("uidInfoText");

  if (user) {
    // If user is signed in, redirect to page
    if (isAuthpage) {
      window.location.href = "touren.html";
    }

    // If user is on a different page than auth, handle buttons
    if (!isAuthpage) {
      if (signOutBtn) {
        signOutBtn.hidden = false;
      }

      const token = await user.getIdTokenResult();

      if (token.claims.admin) {
        if (createTourBtn) {
          createTourBtn.hidden = false;
        }
      }
    }

    if (uidInfoText) {
      uidInfoText.textContent = user.uid;
    }
  } else {
    if (!isAuthpage) {
      window.location.href = "/";
    }
  }
});

// ========== BUTTON EVENT LISTENERS ==========

const emailInput = document.getElementById("authenticationEmailInput");
const passwordInput = document.getElementById("authenticationPasswordInput");

// Sign Up
const authenticationSignUpBtn = document
  .getElementById("authenticationSignUpBtn")
  ?.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    signUpUser(email, password);
  });

// Sign In
const authenticationSignInBtn = document
  .getElementById("authenticationSignInBtn")
  ?.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    signInUser(email, password);
  });

// Sign Out
const signOutBtn = document
  .getElementById("signOutBtn")
  ?.addEventListener("click", () => {
    signUserOut();
  });

// ========== AUTHENTICATION FUNCTIONS ==========

async function signUpUser(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error.code, error.message);
  }
}

async function signInUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error.code, error.message);
  }
}

async function signUserOut() {
  try {
    await signOut(auth).then(() => {
      console.log("User signed out successfully.");
    });
  } catch (error) {
    console.error(error.code, error.message);
  }
}
