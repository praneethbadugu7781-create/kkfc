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
 * ====================================================
 * FIRESTORE SECURITY RULES — COPY TO FIREBASE CONSOLE
 * (Firebase Console → Firestore → Rules)
 * ====================================================
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 * 
 *     // ---- MENU ----
 *     // Public read, admin-only write with data validation
 *     match /menu/{itemId} {
 *       allow read: if true;
 *       allow create, update: if request.auth != null
 *         && request.resource.data.name is string
 *         && request.resource.data.name.size() <= 100
 *         && request.resource.data.category is string
 *         && request.resource.data.category in ['icecream','shakes','chicken','combos','protein'];
 *       allow delete: if request.auth != null;
 *     }
 * 
 *     // ---- OFFERS ----
 *     // Public read, admin-only write with data validation
 *     match /offers/{offerId} {
 *       allow read: if true;
 *       allow create, update: if request.auth != null
 *         && request.resource.data.title is string
 *         && request.resource.data.title.size() <= 100;
 *       allow delete: if request.auth != null;
 *     }
 * 
 *     // ---- ORDERS ----
 *     // Anyone can create (place order), only admin can read/update/delete
 *     // Order creation validates required fields and limits sizes
 *     match /orders/{orderId} {
 *       allow read: if request.auth != null;
 *       allow create: if true
 *         && request.resource.data.customerName is string
 *         && request.resource.data.customerName.size() <= 100
 *         && request.resource.data.phone is string
 *         && request.resource.data.phone.size() <= 20
 *         && request.resource.data.total is number
 *         && request.resource.data.total >= 0
 *         && request.resource.data.total <= 100000
 *         && request.resource.data.items is list
 *         && request.resource.data.items.size() <= 50
 *         && (!('notes' in request.resource.data) || request.resource.data.notes.size() <= 500);
 *       allow update, delete: if request.auth != null;
 *     }
 * 
 *     // ---- SETTINGS ----
 *     match /settings/{document=**} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 * 
 *     // Deny everything else by default
 *     match /{document=**} {
 *       allow read, write: if false;
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

// Suppress detailed Firebase info in production
if (typeof console !== 'undefined' && console.log) {
    // Intentionally not logging Firebase internals
}
