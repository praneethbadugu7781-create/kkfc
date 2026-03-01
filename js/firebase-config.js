/**
 * ============================================
 * KKFC — Firebase Configuration
 * ============================================
 * 
 * HOW TO SET UP:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project (e.g., "kkfc-admin")
 * 3. Go to Project Settings → General → Your apps → Add web app
 * 4. Copy the firebaseConfig values below
 * 5. Enable Authentication → Email/Password sign-in method
 * 6. Enable Firestore Database (start in test mode, then add rules)
 * 7. Enable Storage (for image uploads)
 * 
 * FIRESTORE RULES (paste in Firebase Console → Firestore → Rules):
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Public read for menu, offers
 *     match /menu/{document=**} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *     match /offers/{document=**} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *     match /orders/{document=**} {
 *       allow read: if request.auth != null;
 *       allow create: if true;
 *       allow update, delete: if request.auth != null;
 *     }
 *     match /settings/{document=**} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *   }
 * }
 * 
 * STORAGE RULES:
 * rules_version = '2';
 * service firebase.storage {
 *   match /b/{bucket}/o {
 *     match /menu-images/{allPaths=**} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *   }
 * }
 */

// ⚠️ REPLACE THESE WITH YOUR FIREBASE PROJECT VALUES
const firebaseConfig = {
    apiKey: "AIzaSyDKJUc9R7elgjndodovNsxNY0qgs4jhMkM",
  authDomain: "kkfc-6750b.firebaseapp.com",
  projectId: "kkfc-6750b",
  storageBucket: "kkfc-6750b.firebasestorage.app",
  messagingSenderId: "920240787723",
  appId: "1:920240787723:web:44e0398f7ef1befb17520e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const db = firebase.firestore();
const auth = typeof firebase.auth === 'function' ? firebase.auth() : null;
const storage = typeof firebase.storage === 'function' ? firebase.storage() : null;

// Collection references
const menuRef = db.collection('menu');
const offersRef = db.collection('offers');
const ordersRef = db.collection('orders');
const settingsRef = db.collection('settings');

console.log('[KKFC] Firebase initialized. Firestore:', !!db, 'Auth:', !!auth);
