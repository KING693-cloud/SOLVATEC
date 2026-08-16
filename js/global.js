// ============================================================
// SOLVATECH - GLOBAL JS
// Loads on EVERY page. Contains:
//  1. Loading Overlay (show/hide, progress bar)
//  2. Toast Notifications (success/error)
//  3. Telegram Notifications (send messages)
//  4. Drawer (Sidebar) – opens/closes with hamburger
//  5. Page Transitions – smooth loading on internal link clicks
//  6. Scroll to Top functionality
//  7. Global utility functions exposed to window
// ============================================================

// ============================================================
// SECTION 1: LOADING OVERLAY SYSTEM
// ============================================================

/** @type {number|null} Interval ID for the progress bar animation */
var loaderInterval = null;

/** @type {number|null} Timeout ID for safety auto‑hide */
var loadingTimeout = null;

/**
 * Displays the loading overlay with a custom message and title.
 * @param {string} [message] – The message to show (default: 'Processing your request...')
 * @param {string} [title]   – The title to show (default: 'SOLVATECH')
 */
function showLoading(message, title) {
    message = message || 'Processing your request...';
    title = title || 'SOLVATECH';

    // Get or create the overlay element
    var overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="spinner-ring">
                <div class="ring"></div>
                <div class="ring"></div>
                <div class="ring"></div>
            </div>
            <h3 id="loadingTitle">SOLVATECH</h3>
            <p id="loadingMessage">${message}</p>
            <div class="loader-progress">
                <div class="bar" id="loaderBar"></div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    // Update text content
    var titleEl = document.getElementById('loadingTitle');
    var msgEl = document.getElementById('loadingMessage');
    var barEl = document.getElementById('loaderBar');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    // Reset and start progress bar (random up to 90%)
    if (barEl) {
        barEl.style.width = '0%';
        if (loaderInterval) clearInterval(loaderInterval);
        var progress = 0;
        loaderInterval = setInterval(function() {
            progress += Math.random() * 12 + 3;
            if (progress > 90) progress = 90;
            if (barEl) barEl.style.width = progress + '%';
        }, 200);
    }

    // Show the overlay
    overlay.classList.remove('hiding');
    overlay.classList.add('active');

    // Safety timeout: auto‑hide after 30 seconds
    if (loadingTimeout) clearTimeout(loadingTimeout);
    loadingTimeout = setTimeout(function() {
        hideLoading();
        console.warn('SOLVATECH: Loading timed out.');
    }, 30000);
}

/**
 * Updates the loading message while the overlay is active.
 * @param {string} newMessage – The new message to display.
 */
function updateLoadingMessage(newMessage) {
    var msgEl = document.getElementById('loadingMessage');
    if (msgEl) msgEl.textContent = newMessage;
}

/**
 * Hides the loading overlay with a smooth fade‑out animation.
 */
function hideLoading() {
    // Clear intervals and timeouts
    if (loaderInterval) {
        clearInterval(loaderInterval);
        loaderInterval = null;
    }
    if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
    }

    var overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;

    // Complete the progress bar
    var barEl = document.getElementById('loaderBar');
    if (barEl) barEl.style.width = '100%';

    // Fade out
    overlay.classList.add('hiding');
    setTimeout(function() {
        overlay.classList.remove('active');
        overlay.classList.remove('hiding');
        if (barEl) barEl.style.width = '0%';
    }, 400);
}

// ============================================================
// SECTION 2: TOAST NOTIFICATION SYSTEM
// ============================================================

/** @type {number|null} Timeout ID for auto‑hiding the toast */
var toastTimer = null;

/**
 * Shows a toast notification.
 * @param {string} msg      – The message to display.
 * @param {boolean} isError – Whether it's an error (red) or success (green).
 */
function showToast(msg, isError) {
    isError = isError || false;

    // Get or create toast element
    var toast = document.getElementById('customToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'customToast';
        toast.className = 'toast-notification';
        toast.innerHTML = '<i class="fa-solid fa-circle-check"></i><div class="toast-msg"></div>';
        document.body.appendChild(toast);
    }

    // Set icon and message
    var icon = toast.querySelector('i');
    var msgEl = toast.querySelector('.toast-msg');
    if (icon) {
        icon.className = isError ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check';
        icon.style.color = isError ? '#ef4444' : '#10b981';
    }
    if (msgEl) msgEl.textContent = msg;

    // Show the toast
    toast.classList.add('show');

    // Auto‑hide after 4 seconds
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        toast.classList.remove('show');
    }, 4000);
}

// ============================================================
// SECTION 3: TELEGRAM NOTIFICATION SYSTEM
// ============================================================

/**
 * Sends a message to your Telegram using the bot token and chat ID.
 * @param {string} message – The message to send (supports HTML formatting).
 */
function sendTelegramMessage(message) {
    var chatId = window.TELEGRAM_CONFIG ? window.TELEGRAM_CONFIG.chatId : null;
    var botToken = window.TELEGRAM_CONFIG ? window.TELEGRAM_CONFIG.botToken : null;

    if (!chatId) {
        console.warn('SOLVATECH: No Chat ID configured.');
        return;
    }
    if (!botToken || botToken === 'YOUR_BOT_TOKEN_HERE') {
        console.warn('SOLVATECH: Bot token not configured.');
        showToast('🔔 ' + message);
        return;
    }

    var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage';
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
        if (result.ok) {
            console.log('SOLVATECH: Telegram sent.');
        } else {
            console.error('SOLVATECH: Telegram error:', result);
        }
    })
    .catch(function(err) {
        console.error('SOLVATECH: Telegram fetch error:', err);
    });
}

// ============================================================
// SECTION 4: DRAWER (SIDEBAR) SYSTEM
// ============================================================

/**
 * Initializes the mobile drawer (sidebar) with:
 * - Hamburger toggles open/close.
 * - Backdrop does NOT close the drawer (visual only).
 * - Clicking any menu link closes the drawer (navigation still works).
 * - Body scroll is locked when drawer is open.
 */
function initDrawer() {
    // Get DOM elements
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    if (!navToggle || !navMenu) {
        console.warn('SOLVATECH: Drawer elements not found.');
        return;
    }

    // Create backdrop if missing
    var backdrop = document.querySelector('.drawer-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'drawer-backdrop';
        backdrop.id = 'drawerBackdrop';
        document.body.appendChild(backdrop);
    }

    /**
     * Opens the drawer.
     */
    function openMenu() {
        navMenu.classList.add('active');
        backdrop.classList.add('active');
        document.body.classList.add('menu-open');

        var icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }

    /**
     * Closes the drawer.
     */
    function closeMenu() {
        navMenu.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.classList.remove('menu-open');

        var icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    // Hamburger: toggles the drawer
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Backdrop: intentionally does NOT close the drawer (no listener)

    // Menu links: close the drawer when clicked (navigation still happens)
    var links = document.querySelectorAll('.nav-menu ul li a');
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function() {
            closeMenu();
        });
    }

    console.log('SOLVATECH: Drawer initialized.');
}

// ============================================================
// SECTION 5: PAGE TRANSITIONS (Smooth Loading on Link Clicks)
// ============================================================

/**
 * Captures clicks on internal links (e.g., .html pages) and shows
 * the loading overlay before navigating.
 */
document.addEventListener('click', function(e) {
    // Find the closest anchor tag
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;

    // Ignore external links, mailto, tel, javascript, and anchors (#)
    if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('javascript:') || href.startsWith('#')) {
        return;
    }

    // Only handle internal .html links or root paths
    var isInternal = href.endsWith('.html') || href === '/' || href === '' || href === 'index.html' || href.startsWith('./') || href.startsWith('../');

    if (isInternal) {
        e.preventDefault(); // Prevent immediate navigation

        // Extract page name for display
        var pageName = href.replace('.html', '').replace(/^\.\//, '').replace(/^\.\.\//, '') || 'Home';
        pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

        showLoading('Loading ' + pageName + '...');

        // Navigate after a short delay to show the animation
        setTimeout(function() {
            window.location.href = href;
        }, 600);
    }
});

// ============================================================
// SECTION 6: SCROLL TO TOP BUTTON
// ============================================================

/**
 * Creates and manages a "Scroll to Top" button.
 */
function initScrollToTop() {
    var btn = document.getElementById('scrollToTopBtn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'scrollToTopBtn';
        btn.className = 'scroll-to-top-btn';
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(btn);
    }

    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    console.log('SOLVATECH: Scroll to top initialized.');
}

// ============================================================
// SECTION 7: DARK MODE TOGGLE
// ============================================================

/**
 * Initializes dark mode toggle.
 */
function initDarkMode() {
    var toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    // Check saved preference
    var saved = localStorage.getItem('solvatechTheme');
    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    toggle.addEventListener('click', function() {
        var isDark = document.body.classList.toggle('dark-mode');
        if (isDark) {
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('solvatechTheme', 'dark');
        } else {
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('solvatechTheme', 'light');
        }
    });

    console.log('SOLVATECH: Dark mode initialized.');
}

// ============================================================
// SECTION 8: CUSTOM HEAD INJECTOR (Meta tags from head-config.js)
// ============================================================

/**
 * Injects meta tags, Open Graph, Twitter Cards, and AdSense into the head.
 */
function injectHeadTags() {
    if (typeof HEAD_CONFIG === 'undefined') {
        console.warn('SOLVATECH: HEAD_CONFIG not found. Skipping head injection.');
        return;
    }

    var head = document.head;
    var hc = HEAD_CONFIG;

    // Title
    document.title = hc.title;

    // Meta Description
    var meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = hc.description;
    head.appendChild(meta);

    // Keywords
    meta = document.createElement('meta');
    meta.name = 'keywords';
    meta.content = hc.keywords;
    head.appendChild(meta);

    // Author
    meta = document.createElement('meta');
    meta.name = 'author';
    meta.content = hc.author;
    head.appendChild(meta);

    // Robots
    meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = hc.robots;
    head.appendChild(meta);

    // Theme Color
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = hc.themeColor;
    head.appendChild(meta);

    // Favicon
    if (hc.favicon) {
        var link = document.createElement('link');
        link.rel = 'icon';
        link.href = hc.favicon;
        head.appendChild(link);
    }

    // Open Graph (WhatsApp, Facebook, Telegram)
    var og = hc.og;
    if (og) {
        var ogTags = [
            { property: 'og:title', content: og.title },
            { property: 'og:description', content: og.description },
            { property: 'og:image', content: og.image },
            { property: 'og:url', content: og.url },
            { property: 'og:type', content: og.type },
            { property: 'og:site_name', content: og.siteName }
        ];
        ogTags.forEach(function(tag) {
            var el = document.createElement('meta');
            el.setAttribute('property', tag.property);
            el.content = tag.content;
            head.appendChild(el);
        });
    }

    // Twitter Cards
    var tw = hc.twitter;
    if (tw) {
        var twTags = [
            { name: 'twitter:card', content: tw.card },
            { name: 'twitter:title', content: tw.title },
            { name: 'twitter:description', content: tw.description },
            { name: 'twitter:image', content: tw.image }
        ];
        twTags.forEach(function(tag) {
            var el = document.createElement('meta');
            el.name = tag.name;
            el.content = tag.content;
            head.appendChild(el);
        });
    }

    // Google AdSense (Only if ID is provided)
    if (hc.googleAdsenseId && hc.googleAdsenseId !== '') {
        var adScript = document.createElement('script');
        adScript.async = true;
        adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + hc.googleAdsenseId;
        adScript.crossOrigin = 'anonymous';
        head.appendChild(adScript);
        console.log('SOLVATECH: AdSense loaded.');
    } else {
        console.log('SOLVATECH: AdSense skipped (no ID).');
    }

    // Apple Touch Icon
    if (hc.appleTouchIcon) {
        var appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        appleIcon.href = hc.appleTouchIcon;
        head.appendChild(appleIcon);
    }

    console.log('SOLVATECH: Head injection complete.');
}

// ============================================================
// SECTION 9: CONFIG LOADER (Loads dynamic settings from Firestore)
// ============================================================

/**
 * Loads settings from Firestore and updates the UI.
 */
function loadFirestoreSettings() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.warn('SOLVATECH: Firebase not available. Using fallback config.');
        applyFallbackConfig();
        return;
    }

    var db = firebase.firestore ? firebase.firestore() : null;
    if (!db) {
        console.warn('SOLVATECH: Firestore not available. Using fallback config.');
        applyFallbackConfig();
        return;
    }

    db.collection('settings').doc('general').get()
        .then(function(doc) {
            if (doc.exists) {
                var data = doc.data();
                // Update global config with Firestore data
                if (window.CONTACT_CONFIG) {
                    window.CONTACT_CONFIG.whatsapp = data.whatsapp || window.CONTACT_CONFIG.whatsapp;
                    window.CONTACT_CONFIG.email = data.email || window.CONTACT_CONFIG.email;
                    window.CONTACT_CONFIG.phone = data.phone || window.CONTACT_CONFIG.phone;
                }
                if (window.TELEGRAM_CONFIG) {
                    window.TELEGRAM_CONFIG.chatId = data.telegramChatId || window.TELEGRAM_CONFIG.chatId;
                }
                console.log('SOLVATECH: Settings loaded from Firestore.');
            } else {
                console.log('SOLVATECH: No settings found in Firestore. Using fallback config.');
            }
            applyConfigToUI();
        })
        .catch(function(err) {
            console.warn('SOLVATECH: Could not load settings:', err);
            applyFallbackConfig();
        });
}

function applyFallbackConfig() {
    // Use defaults from config.js
    if (window.CONTACT_CONFIG) {
        // Already using defaults from config.js
    }
    applyConfigToUI();
}

function applyConfigToUI() {
    // Update footer with contact info
    var emailSpan = document.getElementById('footer-email');
    var phoneSpan = document.getElementById('footer-phone');
    var yearSpan = document.getElementById('copyright-year');

    if (emailSpan && window.CONTACT_CONFIG) {
        emailSpan.textContent = window.CONTACT_CONFIG.email || 'solvatech@gmail.com';
    }
    if (phoneSpan && window.CONTACT_CONFIG) {
        phoneSpan.textContent = window.CONTACT_CONFIG.phone || '+234 904 997 9183';
    }
    if (yearSpan && window.BRAND_CONFIG) {
        yearSpan.textContent = window.BRAND_CONFIG.copyrightYear || '2026';
    }

    // Update WhatsApp links
    var whatsappLinks = document.querySelectorAll('.whatsapp-link');
    if (whatsappLinks.length > 0 && window.CONTACT_CONFIG) {
        var num = window.CONTACT_CONFIG.whatsapp || '+2349049979183';
        var cleanNum = num.replace(/[^0-9]/g, '');
        for (var i = 0; i < whatsappLinks.length; i++) {
            whatsappLinks[i].href = 'https://wa.me/' + cleanNum;
        }
    }

    console.log('SOLVATECH: UI updated with config.');
}

// ============================================================
// SECTION 10: INITIALIZATION
// ============================================================

/**
 * Runs when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core components
    initDrawer();
    initScrollToTop();
    initDarkMode();

    // Inject head tags
    if (typeof HEAD_CONFIG !== 'undefined') {
        injectHeadTags();
    }

    // Load Firestore settings (only if Firebase is available)
    try {
        loadFirestoreSettings();
    } catch (e) {
        console.warn('SOLVATECH: Could not load Firestore settings:', e);
        applyFallbackConfig();
    }

    // Auto‑hide the loading overlay after 1 second (if it's showing)
    setTimeout(function() {
        var overlay = document.getElementById('loadingOverlay');
        if (overlay && overlay.classList.contains('active')) {
            hideLoading();
        }
    }, 1000);

    // Log success
    console.log('✅ SOLVATECH: Global JS ready.');
    console.log('📱 WhatsApp:', window.CONTACT_CONFIG ? window.CONTACT_CONFIG.whatsapp : 'Not set');
    console.log('📧 Email:', window.CONTACT_CONFIG ? window.CONTACT_CONFIG.email : 'Not set');
});

// ============================================================
// SECTION 11: EXPOSE FUNCTIONS GLOBALLY
// ============================================================

window.showLoading = showLoading;
window.updateLoadingMessage = updateLoadingMessage;
window.hideLoading = hideLoading;
window.showToast = showToast;
window.sendTelegramMessage = sendTelegramMessage;

console.log('✅ SOLVATECH: Global functions exposed.');