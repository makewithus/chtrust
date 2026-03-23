// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// Public Firebase client keys — safe to expose in browser
// window.env is injected by /env.js (served by server.js) when available
// Hardcoded fallbacks ensure the module never crashes due to missing process.env
const firebaseConfig = {
    apiKey:            (typeof window !== 'undefined' && window.env?.NEXT_PUBLIC_FIREBASE_API_KEY)            || "AIzaSyAOOoS9ZbihUlDZvwZlzaOqVnQW38vK_oU",
    authDomain:        (typeof window !== 'undefined' && window.env?.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)        || "charity-e297e.firebaseapp.com",
    projectId:         (typeof window !== 'undefined' && window.env?.NEXT_PUBLIC_FIREBASE_PROJECT_ID)         || "charity-e297e",
    storageBucket:     (typeof window !== 'undefined' && window.env?.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)     || "charity-e297e.firebasestorage.app",
    messagingSenderId: (typeof window !== 'undefined' && window.env?.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)|| "1075506898766",
    appId:             (typeof window !== 'undefined' && window.env?.NEXT_PUBLIC_FIREBASE_APP_ID)             || "1:1075506898766:web:3c843c29db3198c823a01f"
};

// Initialize Firebase (client-side only)
let app, auth, db, storage;

try {
    if (typeof window !== 'undefined') {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
    } else {
        console.warn('Firebase initialization attempted on server-side');
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
    app = null;
    auth = null;
    db = null;
    storage = null;
}

export { auth, db, storage };
