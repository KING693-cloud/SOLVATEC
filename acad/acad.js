// ============================================================
// SOLVATECH ACADEMY - ULTIMATE PRIVATE JS (PREMIUM)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    console.log('🚀 SOLVATECH: Starting Academy System...');

    // ============================================================
    // 1. DOM REFERENCES
    // ============================================================
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    var logoutLink = document.getElementById('logoutLink');
    var accountBadge = document.getElementById('accountBadge');
    var welcomeSpan = document.getElementById('welcomeName');
    var profileName = document.getElementById('profileName');
    var profileEmail = document.getElementById('profileEmail');
    var profilePhone = document.getElementById('profilePhone');
    var profileWhatsapp = document.getElementById('profileWhatsapp');
    var profileAvatarImg = document.getElementById('profileAvatarImg');
    var uploadBtn = document.getElementById('uploadProfileBtn');
    var fileInput = document.getElementById('profileImageInput');
    var saveBtn = document.getElementById('profileSaveBtn');
    var pages = document.querySelectorAll('.acad-page');
    var navLinks = document.querySelectorAll('#navMenu ul li a[data-page]');

    // --- Completion Modal refs ---
    var completeModal = document.getElementById('completeProfileModal');
    var completeForm = document.getElementById('completeProfileForm');
    var completeEmail = document.getElementById('completeEmail');
    var completeFullName = document.getElementById('completeFullName');
    var completePhone = document.getElementById('completePhone');
    var completeWhatsapp = document.getElementById('completeWhatsapp');
    var completeBtn = document.getElementById('completeProfileBtn');
    var completeNameError = document.getElementById('completeNameError');
    var completePhoneError = document.getElementById('completePhoneError');
    var completeWhatsappError = document.getElementById('completeWhatsappError');

    // --- Dashboard Stats ---
    var statEnrolled = document.getElementById('statEnrolled');
    var statCompleted = document.getElementById('statCompleted');
    var statInProgress = document.getElementById('statInProgress');
    var statCertificates = document.getElementById('statCertificates');

    // --- Folder / Toggle UI (courses.html) ---
    var levelList = document.getElementById('levelList');
    var folderView = document.getElementById('folderView');
    var toggleButton = document.getElementById('toggleButton');
    var folderStatus = document.getElementById('folderStatus');
    var courseStatusBadge = document.getElementById('courseStatusBadge');

    // ============================================================
    // 2. TELEGRAM NOTIFICATION SYSTEM (Reads from Firebase)
    // ============================================================
    function sendAcademyTelegramAlert(message) {
        if (typeof window.rtdb === 'undefined' || !window.rtdb) {
            console.warn('⚠️ ACADEMY: rtdb not available. Telegram alert skipped.');
            return;
        }

        window.rtdb.ref('settings/telegram').once('value')
            .then(function(snapshot) {
                var tgData = snapshot.val();
                if (!tgData) {
                    console.log('ℹ️ ACADEMY: No Telegram settings found. Alert skipped.');
                    return;
                }

                var botToken = tgData.botToken1 || tgData.botToken2;
                var chatId = tgData.chatId1 || tgData.chatId2;

                if (!botToken || !chatId) {
                    console.log('ℹ️ ACADEMY: Telegram bot token or chat ID missing. Alert skipped.');
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
                        console.log('✅ ACADEMY: Telegram alert sent successfully.');
                    } else {
                        console.warn('⚠️ ACADEMY: Telegram API error:', result);
                    }
                })
                .catch(function(err) {
                    console.warn('⚠️ ACADEMY: Failed to send Telegram alert:', err);
                });
            })
            .catch(function(err) {
                console.warn('⚠️ ACADEMY: Could not read Telegram settings:', err);
            });
    }

    // ============================================================
    // 3. VALIDATION HELPERS
    // ============================================================
    function cleanNumber(num) {
        return num.replace(/\D/g, '');
    }

    function isValidWhatsApp(wa) {
        var cleaned = cleanNumber(wa);
        return cleaned.length === 11;
    }

    function isValidPhone(phone) {
        var cleaned = cleanNumber(phone);
        return cleaned.length >= 10 && cleaned.length <= 15;
    }

    function isValidName(name) {
        return name && name.trim().length >= 2;
    }

    // ============================================================
    // 4. CHECK IF VALUE EXISTS IN FIREBASE (Excluding Current User)
    // ============================================================
    function checkIfExistsInFirebase(field, value, currentUid) {
        return new Promise(function(resolve) {
            if (!window.rtdb) {
                resolve(false);
                return;
            }

            // Clean value for comparison
            var cleanValue = value;
            if (field === 'whatsapp' || field === 'phone') {
                cleanValue = cleanNumber(value);
            } else if (field === 'displayName') {
                cleanValue = value.trim().toLowerCase();
            }

            window.rtdb.ref('users').once('value')
                .then(function(snapshot) {
                    var users = snapshot.val() || {};
                    var exists = false;

                    for (var uid in users) {
                        // Skip current user
                        if (uid === currentUid) continue;

                        var userData = users[uid];
                        var userValue = userData[field];

                        if (!userValue) continue;

                        // Clean for comparison
                        if (field === 'whatsapp' || field === 'phone') {
                            userValue = cleanNumber(userValue);
                        } else if (field === 'displayName') {
                            userValue = userValue.trim().toLowerCase();
                        }

                        if (userValue === cleanValue) {
                            exists = true;
                            break;
                        }
                    }

                    resolve(exists);
                })
                .catch(function() {
                    resolve(false);
                });
        });
    }

    // ============================================================
    // 5. CHECK ALL FIELDS FOR DUPLICATES
    // ============================================================
    function checkAllFieldsForDuplicates(name, phone, whatsapp, currentUid) {
        return new Promise(function(resolve) {
            var checks = [];

            if (isValidName(name)) {
                checks.push(checkIfExistsInFirebase('displayName', name, currentUid));
            }
            if (phone && phone.trim().length > 0) {
                checks.push(checkIfExistsInFirebase('phone', phone, currentUid));
            }
            if (whatsapp && whatsapp.trim().length > 0) {
                checks.push(checkIfExistsInFirebase('whatsapp', whatsapp, currentUid));
            }

            Promise.all(checks)
                .then(function(results) {
                    var duplicates = {
                        displayName: false,
                        phone: false,
                        whatsapp: false
                    };

                    var index = 0;
                    if (isValidName(name)) {
                        duplicates.displayName = results[index] || false;
                        index++;
                    }
                    if (phone && phone.trim().length > 0) {
                        duplicates.phone = results[index] || false;
                        index++;
                    }
                    if (whatsapp && whatsapp.trim().length > 0) {
                        duplicates.whatsapp = results[index] || false;
                        index++;
                    }

                    resolve(duplicates);
                })
                .catch(function() {
                    resolve({ displayName: false, phone: false, whatsapp: false });
                });
        });
    }

    // ============================================================
    // 6. HAMBURGER KILLER (Clone & Replace)
    // ============================================================
    if (navToggle && navMenu) {
        console.log('🛠️ HAMBURGER: Cloning to remove global.js conflicts...');
        var newToggle = navToggle.cloneNode(true);
        navToggle.parentNode.replaceChild(newToggle, navToggle);
        var freshToggle = document.getElementById('navToggle');

        freshToggle.addEventListener('click', function(e) {
            e.preventDefault(); e.stopPropagation();
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            var icon = this.querySelector('i');
            if (icon) { icon.classList.toggle('fa-bars'); icon.classList.toggle('fa-times'); }
        });

        document.querySelectorAll('#navMenu ul li a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    var icon = freshToggle.querySelector('i');
                    if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
                }
            });
        });
    }

    // ============================================================
    // 7. GLOBAL LOGOUT (Clone & Replace)
    // ============================================================
    if (logoutLink) {
        console.log('🛠️ LOGOUT: Cloning to ensure it works on ALL pages...');
        var newLogout = logoutLink.cloneNode(true);
        logoutLink.parentNode.replaceChild(newLogout, logoutLink);
        var freshLogout = document.getElementById('logoutLink');

        freshLogout.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().signOut().then(function() {
                    var user = firebase.auth().currentUser;
                    if (user) localStorage.removeItem('solvatech_local_user_' + user.uid);
                    window.location.href = '../login.html';
                });
            } else { window.location.href = '../login.html'; }
        });
    }

    // ============================================================
    // 8. AUTH GUARD & USER DATA LOADER
    // ============================================================
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) { window.location.href = '../login.html'; return; }
            if (typeof window.rtdb !== 'undefined' && window.rtdb) {
                window.rtdb.ref('users/' + user.uid).once('value')
                    .then(function(snapshot) {
                        var data = snapshot.val();

                        // Existing data detection
                        if (data) {
                            console.log('✅ Existing user data found in Firebase:', data);
                            if (data.displayName) console.log('   📛 Name exists:', data.displayName);
                            if (data.phone) console.log('   📞 Phone exists:', data.phone);
                            if (data.whatsapp) console.log('   💬 WhatsApp exists:', data.whatsapp);
                            if (data.profileImage) console.log('   🖼️ Profile image exists');
                            if (data.completedLevels) console.log('   📚 Completed levels:', data.completedLevels.length);
                        } else {
                            console.log('ℹ️ No existing user data found in Firebase. New user.');
                        }

                        processUserData(user, data);
                    })
                    .catch(function(err) {
                        console.warn('⚠️ RTDB read failed. Falling back to localStorage.');
                        processLocalStorage(user);
                    });
            } else {
                console.warn('⚠️ RTDB not initialized. Falling back to localStorage.');
                processLocalStorage(user);
            }
        });
    } else {
        console.error('❌ Firebase Auth not initialized!');
    }

    function processLocalStorage(user) {
        var localDataStr = localStorage.getItem('solvatech_local_user_' + user.uid);
        if (localDataStr) {
            try {
                var localData = JSON.parse(localDataStr);
                console.log('📦 Existing local storage data found:', localData);
                processUserData(user, localData);
            } catch (e) {
                console.warn('⚠️ Invalid local storage data.');
                processUserData(user, null);
            }
        } else {
            console.log('ℹ️ No local storage data found.');
            processUserData(user, null);
        }
    }

    // ============================================================
    // 9. PROCESS USER DATA & RENDER UI
    // ============================================================
    function processUserData(user, data) {
        var displayName = data?.displayName || user.displayName || user.email || 'Student';
        var initial = displayName.charAt(0).toUpperCase();

        if (accountBadge) accountBadge.textContent = initial;
        if (welcomeSpan) welcomeSpan.textContent = displayName;

        if (profileName) profileName.value = displayName;
        if (profileEmail) profileEmail.value = user.email;
        if (profilePhone) profilePhone.value = data?.phone || 'Not set';
        if (profileWhatsapp) profileWhatsapp.value = data?.whatsapp || '';
        if (data?.profileImage && profileAvatarImg) profileAvatarImg.src = data.profileImage;

        if (profileName) profileName.removeAttribute('readonly');
        if (profileWhatsapp) profileWhatsapp.removeAttribute('readonly');
        if (saveBtn) saveBtn.disabled = false;

        var isComplete = data && data.displayName && data.phone && data.whatsapp;
        updateDashboardStats(user.uid, data);

        // UPDATE THE STATIC COURSE ELEMENTS (and send Telegram alerts)
        updateLevels(user.uid, data);

        if (!isComplete) {
            console.log('⚠️ PROFILE: Incomplete. Opening Completion Modal.');
            showCompletionModal(user, data);
        } else {
            console.log('✅ PROFILE: Complete! All required fields exist.');
        }

        setTimeout(function() {
            var overlay = document.getElementById('loadingOverlay');
            if (overlay && overlay.classList.contains('active')) {
                if (typeof hideLoading === 'function') hideLoading();
                else { overlay.classList.remove('active'); overlay.style.display = 'none'; }
            }
        }, 500);
    }

    // ============================================================
    // 10. DASHBOARD STATS
    // ============================================================
    function updateDashboardStats(uid, data) {
        if (!statEnrolled && !statCompleted) return;

        var hasCompleted = (data?.completedLevels || []).length > 0;
        var hasApproved = (data?.approvedLevels || []).length > 0;
        var hasPending = (data?.pendingLevels || []).length > 0;
        var hasCanPurchase = (data?.canPurchase || []).length > 0;

        var enrolled = (hasCompleted || hasApproved || hasPending || hasCanPurchase) ? 1 : 0;

        var completedLevels = data?.completedLevels || [];
        var completed = completedLevels.length;

        var pending = data?.pendingLevels || [];
        var approved = data?.approvedLevels || [];
        var inProgress = (pending.length + approved.length) > 0 ? 1 : 0;

        var certificates = data?.certificates || 0;

        if (statEnrolled) statEnrolled.textContent = enrolled;
        if (statCompleted) statCompleted.textContent = completed;
        if (statInProgress) statInProgress.textContent = inProgress;
        if (statCertificates) statCertificates.textContent = certificates;
    }

    // ============================================================
    // 11. UPDATE LEVELS
    // ============================================================
    function updateLevels(uid, data) {
        var completed = data?.completedLevels || [];
        var approved = data?.approvedLevels || [];
        var pending = data?.pendingLevels || [];
        var canPurchase = data?.canPurchase || [];

        var levelPrices = [1500, 2000, 2500, 3000, 3500, 4000];
        var isActive = completed.length > 0;
        var courseStatusText = isActive ? '🔥 Active' : '✅ Available';
        var courseStatusColor = isActive ? '#10b981' : '#1E88E5';
        var courseStatusBg = isActive ? 'rgba(16,185,129,0.1)' : 'rgba(30,136,229,0.1)';

        if (courseStatusBadge) {
            courseStatusBadge.textContent = courseStatusText;
            courseStatusBadge.style.background = courseStatusBg;
            courseStatusBadge.style.color = courseStatusColor;
        }
        if (folderStatus) {
            folderStatus.textContent = courseStatusText;
            folderStatus.style.color = courseStatusColor;
        }

        var displayName = data?.displayName || 'Student';

        for (let i = 1; i <= 6; i++) {
            var levelKey = 'web_dev_level_' + i;
            var isUnlocked = completed.includes(levelKey);
            var isApproved = approved.includes(levelKey);
            var isPending = pending.includes(levelKey);
            var canBuy = (i === 1) ? !isUnlocked && !isApproved && !isPending : canPurchase.includes(levelKey);

            var statusSpan = document.getElementById('status-' + i);
            var actionBtn = document.getElementById('action-' + i);
            var progressBar = document.getElementById('progress-bar-' + i);
            var progressText = document.getElementById('progress-text-' + i);

            if (!statusSpan) continue;

            var statusIcon, statusText, statusColor;
            var progress = 0;
            var progressLabel = 'Not Started';
            var btnHtml = '';
            var btnDisabled = true;
            var btnBg = '#f3f4f6';
            var btnColor = '#9ca3af';

            if (isUnlocked) {
                statusIcon = '🔓'; statusText = 'Available'; statusColor = '#10b981';
                progress = 100; progressLabel = '✅ Fully Added to Group';
                btnHtml = '✅ Unlocked (₦' + levelPrices[i-1].toLocaleString() + ')';
                btnBg = '#eef2f6'; btnColor = '#0B1A2E'; btnDisabled = true;
            } else if (isApproved) {
                statusIcon = '⏳'; statusText = 'Pending Approval'; statusColor = '#f59e0b';
                progress = 50; progressLabel = '⏳ Payment Approved – Awaiting Group';
                btnHtml = '⏳ Payment Approved'; btnBg = '#fffbeb'; btnColor = '#f59e0b'; btnDisabled = true;
            } else if (isPending) {
                statusIcon = '⏳'; statusText = 'Pending Approval'; statusColor = '#f59e0b';
                progress = 20; progressLabel = '⏳ Payment Initiated – Awaiting Approval';
                btnHtml = 'STUDY (₦' + levelPrices[i-1].toLocaleString() + ')';
                btnBg = '#1E88E5'; btnColor = '#fff'; btnDisabled = false;
            } else if (canBuy) {
                statusIcon = '🔒'; statusText = 'Locked'; statusColor = '#888';
                progress = 0; progressLabel = '🔒 Locked – Pay to Unlock';
                btnHtml = 'STUDY (₦' + levelPrices[i-1].toLocaleString() + ')';
                btnBg = '#1E88E5'; btnColor = '#fff'; btnDisabled = false;
            } else {
                statusIcon = '🔒'; statusText = 'Locked'; statusColor = '#888';
                progress = 0; progressLabel = '🔒 Waiting for Promotion';
                btnHtml = '🔒 Waiting for promotion'; btnBg = '#f3f4f6'; btnColor = '#9ca3af'; btnDisabled = true;
            }

            if (!btnDisabled) {
                actionBtn.onclick = function() {
                    if (typeof showLoading === 'function') {
                        showLoading('Redirecting to checkout...');
                    } else {
                        actionBtn.disabled = true;
                        actionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Please wait...';
                    }

                    setTimeout(function() {
                        window.location.href = `checkout.html?course=web_dev&level=${i}&price=${levelPrices[i-1]}`;
                    }, 400);
                };
            } else {
                actionBtn.onclick = null;
            }

            statusSpan.textContent = statusIcon + ' ' + statusText;
            statusSpan.style.color = statusColor;

            progressBar.style.width = progress + '%';
            if (progress === 100) progressBar.style.background = '#10b981';
            else if (progress === 50) progressBar.style.background = '#f59e0b';
            else if (progress === 20) progressBar.style.background = '#f97316';
            else progressBar.style.background = '#888';
            progressText.textContent = progressLabel;

            actionBtn.innerHTML = btnHtml;
            actionBtn.style.background = btnBg;
            actionBtn.style.color = btnColor;
            actionBtn.disabled = btnDisabled;
            if (btnDisabled) {
                actionBtn.style.cursor = 'default';
            } else {
                actionBtn.style.cursor = 'pointer';
            }
        }
    }

    // ============================================================
    // 12. PROFILE COMPLETION MODAL (WITH DUPLICATE CHECK)
    // ============================================================
    function showCompletionModal(user, existingData) {
        if (!completeModal) return;
        completeEmail.value = user.email;
        if (existingData) {
            if (existingData.displayName) completeFullName.value = existingData.displayName;
            if (existingData.phone) completePhone.value = existingData.phone;
            if (existingData.whatsapp) completeWhatsapp.value = existingData.whatsapp;
        }
        completeNameError.style.display = 'none';
        completePhoneError.style.display = 'none';
        completeWhatsappError.style.display = 'none';
        completeFullName.classList.remove('invalid');
        completePhone.classList.remove('invalid');
        completeWhatsapp.classList.remove('invalid');
        completeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (completeForm) {
        completeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var name = completeFullName.value.trim();
            var phone = completePhone.value.trim();
            var whatsapp = completeWhatsapp.value.trim();
            var user = firebase.auth().currentUser;

            if (!user) {
                showToast('❌ Not logged in.', true);
                return;
            }

            // Validate fields
            var valid = true;

            if (!isValidName(name)) {
                completeNameError.style.display = 'block';
                completeFullName.classList.add('invalid');
                valid = false;
            } else {
                completeNameError.style.display = 'none';
                completeFullName.classList.remove('invalid');
            }

            var phoneClean = cleanNumber(phone);
            if (phoneClean.length !== 11) {
                completePhoneError.style.display = 'block';
                completePhone.classList.add('invalid');
                valid = false;
            } else {
                completePhoneError.style.display = 'none';
                completePhone.classList.remove('invalid');
            }

            var whatsappClean = cleanNumber(whatsapp);
            if (whatsappClean.length !== 11) {
                completeWhatsappError.style.display = 'block';
                completeWhatsapp.classList.add('invalid');
                valid = false;
            } else {
                completeWhatsappError.style.display = 'none';
                completeWhatsapp.classList.remove('invalid');
            }

            if (!valid) return;

            // Check for duplicates in Firebase
            completeBtn.disabled = true;
            completeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';

            checkAllFieldsForDuplicates(name, phone, whatsapp, user.uid)
                .then(function(duplicates) {
                    var hasDuplicate = false;

                    if (duplicates.displayName) {
                        completeNameError.textContent = '❌ This name is already used by another user.';
                        completeNameError.style.display = 'block';
                        completeFullName.classList.add('invalid');
                        hasDuplicate = true;
                    } else {
                        completeNameError.style.display = 'none';
                        completeFullName.classList.remove('invalid');
                    }

                    if (duplicates.phone) {
                        completePhoneError.textContent = '❌ This phone number is already used by another user.';
                        completePhoneError.style.display = 'block';
                        completePhone.classList.add('invalid');
                        hasDuplicate = true;
                    } else {
                        completePhoneError.style.display = 'none';
                        completePhone.classList.remove('invalid');
                    }

                    if (duplicates.whatsapp) {
                        completeWhatsappError.textContent = '❌ This WhatsApp number is already used by another user.';
                        completeWhatsappError.style.display = 'block';
                        completeWhatsapp.classList.add('invalid');
                        hasDuplicate = true;
                    } else {
                        completeWhatsappError.style.display = 'none';
                        completeWhatsapp.classList.remove('invalid');
                    }

                    if (hasDuplicate) {
                        completeBtn.disabled = false;
                        completeBtn.innerHTML = '<i class="fas fa-save"></i> Save & Continue';
                        showToast('❌ Duplicate information found. Please use unique details.', true);
                        return;
                    }

                    // Save to Firebase
                    completeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

                    user.updateProfile({ displayName: name })
                        .then(function() {
                            var dbSave = Promise.resolve();
                            if (typeof window.rtdb !== 'undefined' && window.rtdb) {
                                dbSave = window.rtdb.ref('users/' + user.uid).set({
                                    displayName: name,
                                    email: user.email,
                                    phone: phoneClean,
                                    whatsapp: whatsappClean,
                                    createdAt: new Date().toISOString()
                                });
                            }
                            var localData = {
                                displayName: name,
                                email: user.email,
                                phone: phoneClean,
                                whatsapp: whatsappClean,
                                createdAt: new Date().toISOString()
                            };
                            localStorage.setItem('solvatech_local_user_' + user.uid, JSON.stringify(localData));
                            return dbSave;
                        })
                        .then(function() {
                            completeModal.classList.remove('active');
                            document.body.style.overflow = 'auto';
                            completeBtn.disabled = false;
                            completeBtn.innerHTML = '<i class="fas fa-save"></i> Save & Continue';
                            processUserData(user, { displayName: name, phone: phoneClean, whatsapp: whatsappClean, email: user.email });
                            showToast('✅ Profile completed successfully!');
                        })
                        .catch(function(err) {
                            console.error(err);
                            showToast('❌ Failed to save: ' + err.message, true);
                            completeBtn.disabled = false;
                            completeBtn.innerHTML = '<i class="fas fa-save"></i> Save & Continue';
                        });
                })
                .catch(function(err) {
                    console.error('Error checking duplicates:', err);
                    showToast('❌ Error checking duplicates. Please try again.', true);
                    completeBtn.disabled = false;
                    completeBtn.innerHTML = '<i class="fas fa-save"></i> Save & Continue';
                });
        });
    }

    // ============================================================
    // 13. SPA NAVIGATION
    // ============================================================
    function navigateTo(pageId) {
        if (!pages.length) return;
        pages.forEach(function(p) { p.classList.remove('active'); });
        var target = document.getElementById('page-' + pageId);
        if (target) target.classList.add('active');
        navLinks.forEach(function(link) { link.classList.remove('active'); if (link.dataset.page === pageId) link.classList.add('active'); });
        if (navMenu) { navMenu.classList.remove('active'); document.body.classList.remove('menu-open'); }
    }
    navLinks.forEach(function(link) { link.addEventListener('click', function(e) { e.preventDefault(); navigateTo(this.dataset.page); }); });

    // ============================================================
    // 14. PROFILE PICTURE UPLOAD
    // ============================================================
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', function() { fileInput.click(); });
        fileInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            if (file.size > 500000) { showToast('❌ Image too large.', true); return; }
            var reader = new FileReader();
            reader.onload = function(event) {
                var base64 = event.target.result;
                profileAvatarImg.src = base64;
                var user = firebase.auth().currentUser;
                if (user) {
                    if (typeof window.rtdb !== 'undefined' && window.rtdb) {
                        window.rtdb.ref('users/' + user.uid).update({ profileImage: base64 }).catch(function(err) { console.warn('⚠️ IMAGE: RTDB save failed.'); });
                    }
                    var localDataStr = localStorage.getItem('solvatech_local_user_' + user.uid);
                    if (localDataStr) { try { var localData = JSON.parse(localDataStr); localData.profileImage = base64; localStorage.setItem('solvatech_local_user_' + user.uid, JSON.stringify(localData)); } catch (e) {} }
                    showToast('✅ Profile picture updated!');
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // ============================================================
    // 15. PROFILE SAVE (WITH DUPLICATE CHECK)
    // ============================================================
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            var name = profileName.value.trim();
            var phone = profilePhone.value.trim();
            var whatsapp = profileWhatsapp.value.trim();
            var user = firebase.auth().currentUser;

            if (!user) {
                showToast('❌ You must be logged in.', true);
                return;
            }

            // Validate
            if (!isValidName(name)) {
                showToast('❌ Please enter a valid name (minimum 2 characters).', true);
                return;
            }

            var whatsappClean = cleanNumber(whatsapp);
            if (!isValidWhatsApp(whatsappClean)) {
                showToast('❌ WhatsApp must be exactly 11 digits.', true);
                return;
            }

            if (phone && phone.trim().length > 0) {
                var phoneClean = cleanNumber(phone);
                if (!isValidPhone(phoneClean)) {
                    showToast('❌ Please enter a valid phone number (10-15 digits).', true);
                    return;
                }
            }

            // Check for duplicates
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';

            checkAllFieldsForDuplicates(name, phone, whatsappClean, user.uid)
                .then(function(duplicates) {
                    var hasDuplicate = false;
                    var errorMsg = '';

                    if (duplicates.displayName) {
                        errorMsg += '❌ This name is already used by another user.\n';
                        hasDuplicate = true;
                    }
                    if (duplicates.phone) {
                        errorMsg += '❌ This phone number is already used by another user.\n';
                        hasDuplicate = true;
                    }
                    if (duplicates.whatsapp) {
                        errorMsg += '❌ This WhatsApp number is already used by another user.\n';
                        hasDuplicate = true;
                    }

                    if (hasDuplicate) {
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Profile';
                        showToast(errorMsg, true);
                        return;
                    }

                    // Save to Firebase
                    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

                    var updates = {
                        displayName: name,
                        whatsapp: whatsappClean
                    };
                    if (phone && phone.trim().length > 0) {
                        updates.phone = cleanNumber(phone);
                    }

                    user.updateProfile({ displayName: name })
                        .then(function() {
                            if (typeof window.rtdb !== 'undefined' && window.rtdb) {
                                return window.rtdb.ref('users/' + user.uid).update(updates);
                            }
                            return Promise.resolve();
                        })
                        .then(function() {
                            var localData = {
                                displayName: name,
                                email: user.email,
                                phone: phone || 'Not set',
                                whatsapp: whatsappClean
                            };
                            localStorage.setItem('solvatech_local_user_' + user.uid, JSON.stringify(localData));

                            if (welcomeSpan) welcomeSpan.textContent = name;
                            if (accountBadge) accountBadge.textContent = name.charAt(0).toUpperCase();

                            showToast('✅ Profile updated successfully!');
                            saveBtn.disabled = false;
                            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Profile';
                        })
                        .catch(function(err) {
                            console.error('❌ PROFILE: Error saving:', err);
                            showToast('❌ Failed to save profile: ' + err.message, true);
                            saveBtn.disabled = false;
                            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Profile';
                        });
                })
                .catch(function(err) {
                    console.error('Error checking duplicates:', err);
                    showToast('❌ Error checking duplicates. Please try again.', true);
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Profile';
                });
        });
    }

    // ============================================================
    // 16. TOAST & LOADING HELPERS
    // ============================================================
    function showToast(msg, isError) {
        var toast = document.getElementById('customToast');
        var msgEl = document.getElementById('toastMsg');
        if (!toast || !msgEl) return;
        var icon = toast.querySelector('i');
        icon.className = isError ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check';
        icon.style.color = isError ? '#ef4444' : '#10b981';
        msgEl.textContent = msg;
        toast.classList.add('show');
        clearTimeout(window.toastTimer);
        window.toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 4000);
    }

    function hideLoading() {
        var overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
        }
    }

    // Expose functions globally
    window.showToast = showToast;
    window.hideLoading = hideLoading;
    window.sendAcademyTelegramAlert = sendAcademyTelegramAlert;
    window.navigateTo = navigateTo;

    console.log('✅ SOLVATECH: Academy JS fully loaded.');
});