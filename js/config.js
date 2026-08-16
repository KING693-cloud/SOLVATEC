// ============================================================
// SOLVATECH - CONFIG JS (DEBUGGING VERSION)
// ============================================================

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBl0rplCgVmTyTsQQ2-yhp-aNdkWpoGXks",
    authDomain: "solvatech-academy.firebaseapp.com",
    databaseURL: "https://solvatech-academy-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "solvatech-academy",
    storageBucket: "solvatech-academy.firebasestorage.app",
    messagingSenderId: "102061431394",
    appId: "1:102061431394:web:78b21e5f9878b3c85f4f3b"
};

// ... Contact, Telegram, Brand configs are same ...

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
    console.log('✅ Firebase initialized.');
} 

// ---------- INITIALIZE REALTIME DATABASE ----------
var rtdb = null;
if (typeof firebase !== 'undefined') {
    try {
        // Check if the database function exists
        if (typeof firebase.database !== 'function') {
            console.error('❌ CRITICAL ERROR: firebase.database() is undefined. Did you load firebase-database-compat.js?');
        } else {
            rtdb = firebase.database();
            console.log('✅ Realtime Database initialized successfully.');
            console.log('📡 Database URL:', FIREBASE_CONFIG.databaseURL);
        }
    } catch (e) {
        console.error('❌ CRITICAL ERROR: Could not initialize Realtime Database:', e.message);
    }
} else {
    console.error('❌ CRITICAL ERROR: Firebase SDK not loaded!');
}

window.rtdb = rtdb; 

// ... Expose configs ...

console.log('✅ SOLVATECH: Config loaded.');