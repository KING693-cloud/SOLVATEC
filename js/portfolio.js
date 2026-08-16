// ============================================================
// SOLVATECH - PORTFOLIO JS
// Only loaded on portfolio.html
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. FILTER TABS
    // ============================================================

    var tabs = document.querySelectorAll('.filter-tab');
    var items = document.querySelectorAll('.portfolio-item');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');

            var filter = this.dataset.filter;

            items.forEach(function(item) {
                var category = item.dataset.category;

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            });
        });
    });

    // ============================================================
    // 2. PROJECT MODAL (No Close Button)
    // ============================================================

    var modal = document.getElementById('projectModal');
    var viewBtns = document.querySelectorAll('.portfolio-view-btn');

    // Open modal on view details click
    viewBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var item = this.closest('.portfolio-item');

            // Get data from dataset
            var title = item.dataset.title || 'Project';
            var category = item.dataset.category || 'General';
            var client = item.dataset.client || 'Not specified';
            var date = item.dataset.date || 'Not specified';
            var duration = item.dataset.duration || 'Not specified';
            var industry = item.dataset.industry || 'Not specified';
            var team = item.dataset.team || 'Not specified';
            var tech = item.dataset.tech || 'Not specified';
            var challenge = item.dataset.challenge || 'No challenge information available.';
            var solution = item.dataset.solution || 'No solution information available.';
            var result = item.dataset.result || 'No result information available.';
            var imgSrc = item.dataset.img || item.querySelector('img').src;

            // Populate modal
            document.getElementById('modalProjectTitle').textContent = title;
            document.getElementById('modalProjectCategory').textContent = category.toUpperCase();
            document.getElementById('modalProjectClient').textContent = client;
            document.getElementById('modalProjectDate').textContent = date;
            document.getElementById('modalProjectDuration').textContent = duration;
            document.getElementById('modalProjectIndustry').textContent = industry;
            document.getElementById('modalProjectTeam').textContent = team;
            document.getElementById('modalProjectTech').textContent = tech;
            document.getElementById('modalProjectChallenge').textContent = challenge;
            document.getElementById('modalProjectSolution').textContent = solution;
            document.getElementById('modalProjectResult').textContent = result;
            document.getElementById('modalProjectImage').src = imgSrc;

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // ============================================================
    // 3. LOG
    // ============================================================

    console.log('✅ SOLVATECH: Portfolio JS ready.');
    console.log('📂 Projects loaded:', items.length);
});