// ============================================================
// SOLVATECH - ACADEMY JS
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ---------- Course card click: scroll to CTA ----------
    var courseCards = document.querySelectorAll('.course-card');
    var ctaSection = document.getElementById('get-started');

    courseCards.forEach(function(card) {
        card.addEventListener('click', function() {
            var courseName = this.dataset.course || this.querySelector('h3').textContent;
            var status = this.dataset.status || '';

            // Show toast based on status
            if (status === 'active') {
                showToast('📖 ' + courseName + ' is available! Register to start learning.');
            } else {
                showToast('⏳ ' + courseName + ' is coming soon! Stay tuned.', true);
            }

            // Smooth scroll to the CTA section
            if (ctaSection) {
                ctaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    console.log('✅ SOLVATECH: Academy JS ready.');
});