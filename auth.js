import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAQXnWZfLGXCaL7dt3HcIYVsTjk9m-Hmw",
  authDomain: "a2zqr-io.firebaseapp.com",
  projectId: "a2zqr-io",
  storageBucket: "a2zqr-io.firebasestorage.app",
  messagingSenderId: "945066554626",
  appId: "1:945066554626:web:bd1789d10505d8aa8e3e1b",
  measurementId: "G-Q44LHQHT7X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.triggerAuth = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    if(result.user) {
      localStorage.setItem('isUserPremiumPro', 'true');
      if (typeof window.unlockProUI === 'function') {
        window.unlockProUI();
      }
    }
  } catch(err) {
    console.error(err);
    alert("Login failed. Please try again.");
  }
};

onAuthStateChanged(auth, user => {
  if (user) {
    localStorage.setItem('isUserPremiumPro', 'true');
    if (typeof window.unlockProUI === 'function') {
      window.unlockProUI();
    }
  } else {
    localStorage.setItem('isUserPremiumPro', 'false');
    window.isUserPremiumPro = false;
  }
});
