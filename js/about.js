// ============================================================
// SOLVATECH - ABOUT JS
// Only loaded on about.html
// ============================================================

// ---------- EXPANDABLE TOGGLE ----------
function toggleExpand(id, btn) {
    var content = document.getElementById(id);
    if (!content) return;

    content.classList.toggle('open');
    btn.classList.toggle('open');

    if (content.classList.contains('open')) {
        btn.innerHTML = 'Read Less <i class="fas fa-chevron-up"></i>';
    } else {
        btn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
    }
}

// ---------- TEAM CLICK ----------
document.addEventListener('DOMContentLoaded', function() {
    var teamMember = document.querySelector('.team-member');
    if (teamMember) {
        teamMember.addEventListener('click', function() {
            showToast('👋 Hi, I\'m Solomon! Let\'s build something great.');
        });
    }

    console.log('✅ SOLVATECH: About JS ready.');
});

// Expose toggleExpand globally
window.toggleExpand = toggleExpand;