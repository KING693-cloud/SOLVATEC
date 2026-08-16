// ============================================================
// SOLVATECH - SERVICES JS
// Only loaded on services.html
// ============================================================

// ============================================================
// SERVICE DATA - Each service has unique options
// ============================================================

var SERVICE_DATA = {
    website: {
        name: 'Website Development',
        icon: 'fa-laptop-code',
        desc: 'Tell us about your website project.',
        types: [
            'Business Website',
            'E-commerce Store',
            'Portfolio Website',
            'Landing Page',
            'Custom Web App'
        ],
        timelines: ['ASAP (1-2 weeks)', 'Within 3 weeks', 'Within 1 month', '1-2 months', 'Flexible'],
        budgets: ['₦100k – ₦300k', '₦300k – ₦600k', '₦600k – ₦1M', '₦1M – ₦3M', '₦3M+', "Let's discuss"]
    },
    webapp: {
        name: 'Web Applications',
        icon: 'fa-cogs',
        desc: 'Tell us about your web application.',
        types: [
            'Dashboard',
            'Booking System',
            'CRM',
            'Internal Tool',
            'SaaS Platform'
        ],
        timelines: ['ASAP (1-2 weeks)', 'Within 3 weeks', 'Within 1 month', '1-2 months', 'Flexible'],
        budgets: ['₦150k – ₦400k', '₦400k – ₦800k', '₦800k – ₦1.5M', '₦1.5M – ₦4M', '₦4M+', "Let's discuss"]
    },
    app: {
        name: 'App Development',
        icon: 'fa-mobile-alt',
        desc: 'Tell us about your mobile app idea.',
        types: [
            'Utility App',
            'Business App',
            'Productivity App',
            'Social App',
            'Custom Android App'
        ],
        timelines: ['ASAP (2-3 weeks)', 'Within 1 month', '1-2 months', '2-3 months', 'Flexible'],
        budgets: ['₦200k – ₦500k', '₦500k – ₦1M', '₦1M – ₦2M', '₦2M – ₦5M', '₦5M+', "Let's discuss"]
    },
    graphics: {
        name: 'Graphic Design',
        icon: 'fa-paint-brush',
        desc: 'Tell us about your design needs.',
        types: [
            'Logo Design',
            'Brand Identity',
            'Flyer / Poster',
            'Social Media Graphics',
            'Packaging Design'
        ],
        timelines: ['ASAP (2-3 days)', 'Within 1 week', 'Within 2 weeks', 'Within 1 month', 'Flexible'],
        budgets: ['₦5k – ₦20k', '₦20k – ₦50k', '₦50k – ₦100k', '₦100k – ₦300k', '₦300k+', "Let's discuss"]
    },
    branding: {
        name: 'Branding',
        icon: 'fa-building',
        desc: 'Tell us about your brand.',
        types: [
            'Brand Strategy',
            'Visual Identity',
            'Brand Guidelines',
            'Brand Positioning',
            'Complete Branding'
        ],
        timelines: ['Within 2 weeks', 'Within 1 month', '1-2 months', '2-3 months', 'Flexible'],
        budgets: ['₦100k – ₦300k', '₦300k – ₦600k', '₦600k – ₦1M', '₦1M – ₦3M', '₦3M+', "Let's discuss"]
    },
    ai: {
        name: 'AI Creative Services',
        icon: 'fa-robot',
        desc: 'Tell us about your AI project.',
        types: [
            'AI Video Production',
            'AI Music Composition',
            'AI Voice / Audio',
            'AI Content Creation',
            'AI Automation'
        ],
        timelines: ['ASAP (1-2 weeks)', 'Within 3 weeks', 'Within 1 month', '1-2 months', 'Flexible'],
        budgets: ['₦50k – ₦150k', '₦150k – ₦300k', '₦300k – ₦600k', '₦600k – ₦1.5M', '₦1.5M+', "Let's discuss"]
    },
    digital: {
        name: 'Digital Solutions',
        icon: 'fa-lightbulb',
        desc: 'Tell us about your digital tool.',
        types: [
            'Custom Forms',
            'Automation Tool',
            'Data Collection',
            'Business System',
            'Custom Software'
        ],
        timelines: ['ASAP (2-3 weeks)', 'Within 1 month', '1-2 months', '2-3 months', 'Flexible'],
        budgets: ['₦100k – ₦300k', '₦300k – ₦600k', '₦600k – ₦1.2M', '₦1.2M – ₦3M', '₦3M+', "Let's discuss"]
    },
    academy: {
        name: 'Technology Education',
        icon: 'fa-graduation-cap',
        desc: 'Tell us about your learning goals.',
        types: [
            'Web Development Course',
            'AI & ML Course',
            'Design Course',
            'Full Stack Program',
            'Custom Training'
        ],
        timelines: ['Start ASAP', 'Start within 1 month', 'Start within 2 months', 'Custom schedule'],
        budgets: ['₦30k – ₦60k', '₦60k – ₦120k', '₦120k – ₦250k', '₦250k – ₦500k', '₦500k+', "Let's discuss"]
    }
};

// ============================================================
// DOM REFS (Will be set after DOM ready)
// ============================================================

var modal = null;
var closeBtn = null;
var cancelBtn = null;
var sendBtn = null;
var modalServiceName = null;
var modalServiceDesc = null;
var modalIcon = null;
var modalProjectType = null;
var modalTimeline = null;
var modalBudget = null;
var modalNote = null;

var currentServiceKey = '';

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    modal = document.getElementById('serviceModal');
    if (!modal) {
        console.error('SOLVATECH: Modal element not found!');
        return;
    }

    closeBtn = document.getElementById('closeModal');
    cancelBtn = document.getElementById('cancelModal');
    sendBtn = document.getElementById('sendWhatsApp');
    modalServiceName = document.getElementById('modalServiceName');
    modalServiceDesc = document.getElementById('modalServiceDesc');
    modalIcon = document.getElementById('modalIcon');
    modalProjectType = document.getElementById('modalProjectType');
    modalTimeline = document.getElementById('modalTimeline');
    modalBudget = document.getElementById('modalBudget');
    modalNote = document.getElementById('modalNote');

    // ---- Close on X button ----
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // ---- Close on Cancel button ----
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // ---- Close on backdrop click ----
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // ---- Close on Escape key ----
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // ---- Send WhatsApp ----
    if (sendBtn) {
        sendBtn.addEventListener('click', sendWhatsApp);
    }

    console.log('✅ SOLVATECH: Services JS ready.');
    console.log('📦 Services loaded:', Object.keys(SERVICE_DATA).length);
    console.log('📱 WhatsApp number:', window.CONTACT_CONFIG ? window.CONTACT_CONFIG.whatsapp : 'Not set');
});

// ============================================================
// OPEN MODAL
// ============================================================

function openModal(serviceKey) {
    // Ensure modal exists
    if (!modal) {
        console.error('SOLVATECH: Modal not initialized.');
        return;
    }

    var data = SERVICE_DATA[serviceKey];
    if (!data) {
        console.error('SOLVATECH: Service data not found for:', serviceKey);
        return;
    }

    currentServiceKey = serviceKey;

    // Update header
    if (modalServiceName) modalServiceName.textContent = data.name;
    if (modalServiceDesc) modalServiceDesc.textContent = data.desc;
    if (modalIcon) modalIcon.innerHTML = '<i class="fas ' + data.icon + '"></i>';

    // Update project types
    if (modalProjectType) {
        modalProjectType.innerHTML = '';
        for (var i = 0; i < data.types.length; i++) {
            var opt = document.createElement('option');
            opt.value = data.types[i];
            opt.textContent = data.types[i];
            modalProjectType.appendChild(opt);
        }
        modalProjectType.selectedIndex = 0;
    }

    // Update timelines
    if (modalTimeline) {
        modalTimeline.innerHTML = '';
        for (var i = 0; i < data.timelines.length; i++) {
            var opt = document.createElement('option');
            opt.value = data.timelines[i];
            opt.textContent = data.timelines[i];
            modalTimeline.appendChild(opt);
        }
        modalTimeline.selectedIndex = 0;
    }

    // Update budgets
    if (modalBudget) {
        modalBudget.innerHTML = '';
        for (var i = 0; i < data.budgets.length; i++) {
            var opt = document.createElement('option');
            opt.value = data.budgets[i];
            opt.textContent = data.budgets[i];
            modalBudget.appendChild(opt);
        }
        modalBudget.selectedIndex = 0;
    }

    // Clear note
    if (modalNote) modalNote.value = '';

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================================
// CLOSE MODAL (Immediate)
// ============================================================

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ============================================================
// SEND WHATSAPP
// ============================================================

function sendWhatsApp() {
    var data = SERVICE_DATA[currentServiceKey];
    if (!data) {
        console.error('SOLVATECH: No service data for current key.');
        return;
    }

    var type = modalProjectType ? modalProjectType.value || 'Not specified' : 'Not specified';
    var timeline = modalTimeline ? modalTimeline.value || 'Not specified' : 'Not specified';
    var budget = modalBudget ? modalBudget.value || 'Not specified' : 'Not specified';
    var note = modalNote ? modalNote.value.trim() || '' : '';

    // Get WhatsApp number from global config
    var whatsapp = window.CONTACT_CONFIG ? window.CONTACT_CONFIG.whatsapp : '+2349049979183';
    // Remove any '+' or spaces for clean number
    var cleanNumber = whatsapp.replace(/[^0-9]/g, '');

    var msg = 'Hello SOLVATECH, I\'m interested in ' + data.name + '.\n\n';
    msg += '📌 Type: ' + type + '\n';
    msg += '⏱ Timeline: ' + timeline + '\n';
    msg += '💰 Budget: ' + budget + '\n';
    if (note) msg += '\n📝 Note: ' + note + '\n\n';
    msg += 'Please get back to me. Thank you!';

    var encodedMsg = encodeURIComponent(msg);
    var url = 'https://wa.me/' + cleanNumber + '?text=' + encodedMsg;

    window.open(url, '_blank');

    // Close modal after sending
    setTimeout(closeModal, 500);
}

// Expose openModal globally
window.openModal = openModal;