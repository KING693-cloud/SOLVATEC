// ============================================================
// SOLVATECH - HOME JS
// Only loaded on index.html
// Contains: Service card expand/collapse functionality
// ============================================================

// ---------- SERVICE CARD EXPAND / COLLAPSE ----------

/**
 * Toggles the expansion state of a service card.
 * Closes any other open cards before opening the clicked one.
 * @param {HTMLElement} card - The service card element to toggle.
 */
function toggleExpand(card) {
    // Get all currently open cards
    var openCards = document.querySelectorAll('.service-card.expandable.open');
    
    // Close any other open cards (except the one being clicked)
    for (var i = 0; i < openCards.length; i++) {
        if (openCards[i] !== card) {
            openCards[i].classList.remove('open');
        }
    }
    
    // Toggle the clicked card
    card.classList.toggle('open');
}

// ---------- CLOSE ON CLICK OUTSIDE ----------

/**
 * Closes all expanded cards when the user clicks outside any service card.
 */
document.addEventListener('click', function(e) {
    // Check if the click target is inside a service card
    var isInsideCard = e.target.closest('.service-card.expandable');
    
    // If click is outside all cards, close any open cards
    if (!isInsideCard) {
        var openCards = document.querySelectorAll('.service-card.expandable.open');
        for (var i = 0; i < openCards.length; i++) {
            openCards[i].classList.remove('open');
        }
    }
});

// ---------- CLOSE ON ESCAPE KEY ----------

/**
 * Closes all expanded cards when the Escape key is pressed.
 */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var openCards = document.querySelectorAll('.service-card.expandable.open');
        for (var i = 0; i < openCards.length; i++) {
            openCards[i].classList.remove('open');
        }
    }
});

// ---------- LOG ----------

console.log('✅ SOLVATECH: Home JS ready.');
console.log('📊 Service cards: ' + document.querySelectorAll('.service-card.expandable').length + ' found.');