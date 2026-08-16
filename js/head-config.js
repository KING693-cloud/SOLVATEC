// ============================================================
// SOLVATECH - META INJECTOR
// Injects HEAD_CONFIG into <head> at runtime (browser only)
// ============================================================

(function() {
    var config = window.HEAD_CONFIG;
    if (!config) {
        console.warn('⚠️ HEAD_CONFIG not found. Meta injection skipped.');
        return;
    }

    // Helper: add meta tag
    function addMeta(attrs) {
        // Check if a meta tag with these attributes already exists
        var existing = document.head.querySelector('meta[' + attrs.join('][') + ']');
        if (existing) {
            // Update content if needed
            for (var key in attrs) {
                if (key === 'content') {
                    existing.setAttribute('content', attrs[key]);
                }
            }
            return;
        }
        var meta = document.createElement('meta');
        for (var key in attrs) {
            meta.setAttribute(key, attrs[key]);
        }
        document.head.appendChild(meta);
    }

    // Helper: add link
    function addLink(attrs) {
        var existing = document.head.querySelector('link[' + attrs.join('][') + ']');
        if (existing) {
            for (var key in attrs) {
                if (key !== 'rel' && key !== 'href') {
                    existing.setAttribute(key, attrs[key]);
                }
            }
            return;
        }
        var link = document.createElement('link');
        for (var key in attrs) {
            link.setAttribute(key, attrs[key]);
        }
        document.head.appendChild(link);
    }

    // ---------- BASIC META ----------
    if (config.title) {
        document.title = config.title;
    }
    if (config.description) {
        addMeta({ name: 'description', content: config.description });
    }
    if (config.keywords) {
        addMeta({ name: 'keywords', content: config.keywords });
    }
    if (config.author) {
        addMeta({ name: 'author', content: config.author });
    }
    if (config.robots) {
        addMeta({ name: 'robots', content: config.robots });
    }
    if (config.themeColor) {
        addMeta({ name: 'theme-color', content: config.themeColor });
    }
    if (config.charset) {
        addMeta({ charset: config.charset });
    }
    if (config.viewport) {
        addMeta({ name: 'viewport', content: config.viewport });
    }
    if (config.language) {
        // HTML lang attribute
        document.documentElement.lang = config.language;
    }

    // ---------- OPEN GRAPH (og:) ----------
    var og = config.og;
    if (og) {
        for (var prop in og) {
            if (og.hasOwnProperty(prop)) {
                // property="og:prop"
                addMeta({ property: 'og:' + prop, content: og[prop] });
            }
        }
    }

    // ---------- TWITTER CARDS (twitter:) ----------
    var tw = config.twitter;
    if (tw) {
        for (var prop in tw) {
            if (tw.hasOwnProperty(prop)) {
                addMeta({ name: 'twitter:' + prop, content: tw[prop] });
            }
        }
    }

    // ---------- FAVICON & APPLE TOUCH ICON ----------
    if (config.favicon) {
        addLink({ rel: 'icon', type: 'image/png', href: config.favicon });
    }
    if (config.appleTouchIcon) {
        addLink({ rel: 'apple-touch-icon', href: config.appleTouchIcon });
    }

    // ---------- MANIFEST (if provided) ----------
    if (config.manifest) {
        addLink({ rel: 'manifest', href: config.manifest });
    }

    // ---------- GOOGLE ADSENSE ----------
    if (config.googleAdsenseId && config.googleAdsenseId.length > 0) {
        var adsenseScript = document.createElement('script');
        adsenseScript.async = true;
        adsenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + config.googleAdsenseId;
        adsenseScript.crossOrigin = 'anonymous';
        document.head.appendChild(adsenseScript);
        console.log('✅ AdSense loaded.');
    }

    console.log('✅ SOLVATECH: All meta tags injected.');
})();