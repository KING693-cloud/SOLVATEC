// ============================================================
// SOLVATECH ACADEMY - PRIVATE CONFIG
// ============================================================

const ACAD_CONFIG = {
    // ---------- FIREBASE (Your actual keys) ----------
    firebase: {
        apiKey: "AIzaSyBl0rplCgVmTyTsQQ2-yhp-aNdkWpoGXks",
        authDomain: "solvatech-academy.firebaseapp.com",
        projectId: "solvatech-academy",
        storageBucket: "solvatech-academy.firebasestorage.app",
        messagingSenderId: "102061431394",
        appId: "1:102061431394:web:78b21e5f9878b3c85f4f3b"
    },

    // ---------- COURSES DATA ----------
    courses: [
        {
            id: "web_dev",
            name: "Web Development",
            icon: "fa-laptop-code",
            description: "Master HTML, CSS, JavaScript, and modern frameworks. Build full-stack applications.",
            levels: 6,
            status: "enrolled",
            price: 10000,
            comingSoon: false
        },
        {
            id: "ai_creative",
            name: "AI Creative",
            icon: "fa-robot",
            description: "Learn AI video, music, voice, and content creation. Create with the power of artificial intelligence.",
            levels: 4,
            status: "available",
            price: 15000,
            comingSoon: false
        },
        {
            id: "graphic_design",
            name: "Graphic Design",
            icon: "fa-paint-brush",
            description: "Master logo design, branding, typography, and visual identity. Build a standout portfolio.",
            levels: 4,
            status: "coming",
            price: 10000,
            comingSoon: true
        },
        {
            id: "digital_solutions",
            name: "Digital Solutions",
            icon: "fa-lightbulb",
            description: "Build automation tools, custom systems, and digital products that solve real problems.",
            levels: 3,
            status: "coming",
            price: 12000,
            comingSoon: true
        }
    ],

    // ---------- APP DEFAULTS ----------
    defaults: {
        currentLevel: 1,
        completedLevels: [],
        enrolledCourses: ["web_dev"],
        totalLevels: 6
    },

    // ---------- WHATSAPP CLASS GROUP ----------
    whatsapp: {
        groupLink: "https://chat.whatsapp.com/your-group-link",
        adminNumber: "+2349049979183"
    }
};

// ---------- EXPOSE GLOBALLY ----------
window.ACAD_CONFIG = ACAD_CONFIG;

console.log('✅ SOLVATECH Academy: Config loaded.');
console.log('📚 Courses loaded:', ACAD_CONFIG.courses.length);
console.log('📱 WhatsApp Admin:', ACAD_CONFIG.whatsapp.adminNumber);