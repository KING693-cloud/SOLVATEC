// ============================================================
// SOLVATECH - CONTACT JS
// Only loaded on contact.html
// ============================================================

// ---------- WAIT FOR DOM ----------
document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // SECTION 1: WHATSAPP & EMAIL CLICK HANDLERS
    // ============================================================

    // Get all WhatsApp and Email cards
    var whatsappCards = document.querySelectorAll('.contact-card-whatsapp');
    var emailCards = document.querySelectorAll('.contact-card-email');

    // ---------- WHATSAPP CARD CLICK ----------
    for (var i = 0; i < whatsappCards.length; i++) {
        whatsappCards[i].addEventListener('click', function(e) {
            // Show a toast notification
            showToast('📱 Opening WhatsApp...');

            // Send Telegram notification to admin (optional)
            sendTelegramMessage('📱 *New WhatsApp Contact*' +
                '\n\nSomeone is reaching out via WhatsApp from the SOLVATECH website.' +
                '\n\n📅 Time: ' + new Date().toLocaleString());

            console.log('SOLVATECH: WhatsApp card clicked.');
        });
    }

    // ---------- EMAIL CARD CLICK ----------
    for (var i = 0; i < emailCards.length; i++) {
        emailCards[i].addEventListener('click', function(e) {
            // Show a toast notification
            showToast('📧 Opening Email...');

            // Send Telegram notification to admin (optional)
            sendTelegramMessage('📧 *New Email Contact*' +
                '\n\nSomeone is reaching out via Email from the SOLVATECH website.' +
                '\n\n📅 Time: ' + new Date().toLocaleString());

            console.log('SOLVATECH: Email card clicked.');
        });
    }

    // ============================================================
    // SECTION 2: WHY CONTACT ITEMS - HOVER EFFECT (Optional)
    // ============================================================

    var whyItems = document.querySelectorAll('.contact-why-item');
    for (var i = 0; i < whyItems.length; i++) {
        whyItems[i].addEventListener('mouseenter', function() {
            // Just a subtle console log – no visual change needed
            // The CSS handles the hover effect
        });
    }

    // ============================================================
    // SECTION 3: CONTACT FORM (if you add one later)
    // ============================================================

    // If you want to add a contact form in the future, uncomment this block
    /*
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var message = document.getElementById('message').value.trim();

            // Validate
            if (!name || !email || !message) {
                showToast('Please fill in all fields.', true);
                return;
            }

            // Show loading
            showLoading('Sending your message...');

            // Prepare data for Firebase
            var formData = {
                name: name,
                email: email,
                message: message,
                createdAt: new Date().toISOString(),
                status: 'unread'
            };

            // Save to Firebase Firestore
            if (typeof db !== 'undefined') {
                db.collection('messages').add(formData)
                    .then(function(docRef) {
                        console.log('SOLVATECH: Message saved with ID:', docRef.id);

                        // Send Telegram notification
                        var telegramMsg = '📩 *New Contact Message*' +
                            '\n\n👤 Name: ' + name +
                            '\n📧 Email: ' + email +
                            '\n📝 Message: ' + message +
                            '\n\n📅 Time: ' + new Date().toLocaleString();

                        sendTelegramMessage(telegramMsg);

                        hideLoading();
                        showToast('✅ Message sent! We\'ll get back to you soon.');
                        contactForm.reset();
                    })
                    .catch(function(error) {
                        console.error('SOLVATECH: Firestore error:', error);
                        hideLoading();
                        showToast('❌ Something went wrong. Please try again.', true);
                    });
            } else {
                // Fallback: save to localStorage
                var messages = JSON.parse(localStorage.getItem('solvatech_messages') || '[]');
                messages.push(formData);
                localStorage.setItem('solvatech_messages', JSON.stringify(messages));

                hideLoading();
                showToast('✅ Message saved locally!');
                contactForm.reset();
            }
        });
    }
    */

    // ============================================================
    // SECTION 4: LOG
    // ============================================================

    console.log('✅ SOLVATECH: Contact JS ready.');
    console.log('📱 WhatsApp:', window.CONTACT_CONFIG ? window.CONTACT_CONFIG.whatsapp : 'Not set');
    console.log('📧 Email:', window.CONTACT_CONFIG ? window.CONTACT_CONFIG.email : 'Not set');

});