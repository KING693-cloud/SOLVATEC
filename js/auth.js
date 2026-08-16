// ============================================================
// SOLVATECH - AUTH JS (STRICT REGISTRATION + REALTIME DB)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 0. AUTH GUARD (Prevent infinite loop)
    // ============================================================
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var currentPath = window.location.pathname;
                if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
                    if (currentPath.includes('register.html') && window.location.search.includes('complete=true')) {
                        return;
                    }
                    window.location.href = 'acad/acad.html';
                }
            }
        });
    }

    // ============================================================
    // 1. PASSWORD TOGGLE
    // ============================================================
    window.togglePasswordVisibility = function(inputId, btn) {
        var input = document.getElementById(inputId);
        if (!input) return;
        var icon = btn.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fa-regular fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fa-regular fa-eye';
        }
    };

    // ============================================================
    // 2. FORGOT PASSWORD MODAL
    // ============================================================
    var forgotModal = document.getElementById('forgotModal');
    var forgotCloseBtn = document.getElementById('forgotModalClose');
    var forgotBackBtn = document.getElementById('forgotModalBack');
    var forgotLink = document.getElementById('forgotPasswordLink');
    var forgotForm = document.getElementById('forgotPasswordForm');
    var resetEmailInput = document.getElementById('resetEmail');
    var resetEmailError = document.getElementById('resetEmailError');
    var resetBtn = document.getElementById('resetPasswordBtn');
    var successState = document.querySelector('.success-state');
    var notfoundState = document.querySelector('.email-notfound-state');
    var formEl = document.querySelector('.forgot-modal-content form');

    function openForgotModal() {
        if (forgotModal) {
            forgotModal.classList.add('active');
            if (resetEmailInput) {
                resetEmailInput.value = '';
                resetEmailInput.classList.remove('invalid');
            }
            if (resetEmailError) resetEmailError.style.display = 'none';
            if (formEl) formEl.style.display = 'block';
            if (successState) successState.style.display = 'none';
            if (notfoundState) notfoundState.style.display = 'none';
            if (resetBtn) {
                resetBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
                resetBtn.disabled = false;
            }
            document.body.style.overflow = 'hidden';
        }
    }

    function closeForgotModal() {
        if (forgotModal) {
            forgotModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            openForgotModal();
        });
    }
    if (forgotCloseBtn) forgotCloseBtn.addEventListener('click', closeForgotModal);
    if (forgotBackBtn) forgotBackBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeForgotModal();
    });
    if (forgotModal) forgotModal.addEventListener('click', function(e) {
        if (e.target === forgotModal) closeForgotModal();
    });

    // ----- Forgot Password Form Submit (with Telegram notification) -----
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var email = resetEmailInput.value.trim();
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                resetEmailError.style.display = 'block';
                resetEmailInput.classList.add('invalid');
                return;
            } else {
                resetEmailError.style.display = 'none';
                resetEmailInput.classList.remove('invalid');
            }

            resetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
            resetBtn.disabled = true;

            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().sendPasswordResetEmail(email)
                    .then(function() {
                        if (formEl) formEl.style.display = 'none';
                        if (successState) {
                            successState.style.display = 'block';
                            var msg = document.getElementById('successMessage');
                            if (msg) {
                                msg.innerHTML = 'We\'ve sent a reset link to <strong>' + email + '</strong>.';
                            }
                        }
                        resetBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                        resetBtn.style.background = '#10b981';
                        resetBtn.disabled = false;

                        // Send Telegram notification (if configured)
                        try {
                            var tgMsg = "🔐 *Password Reset Requested*\n\n📧 Email: " + email + "\n🕒 Time: " + new Date().toLocaleString();
                            if (typeof window.sendTelegramMessage === 'function') {
                                window.sendTelegramMessage(tgMsg);
                            }
                        } catch (e) { /* ignore */ }

                        setTimeout(function() {
                            resetBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
                            resetBtn.style.background = '';
                            resetBtn.disabled = false;
                        }, 3000);
                        setTimeout(function() {
                            closeForgotModal();
                            if (formEl) formEl.style.display = 'block';
                            if (successState) successState.style.display = 'none';
                            if (resetEmailInput) resetEmailInput.value = '';
                        }, 5000);
                        showToast('✅ Password reset link sent!');
                    })
                    .catch(function(error) {
                        if (error.code === 'auth/too-many-requests') {
                            showToast('❌ Too many attempts. Please try again later.', true);
                        }
                        resetBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
                        resetBtn.disabled = false;
                    });
            }
        });
    }

    // ============================================================
    // 3. LOGIN FORM
    // ============================================================
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var email = document.getElementById('loginEmail').value.trim();
            var password = document.getElementById('loginPassword').value;
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            var isValid = true;

            // Validate Email
            if (!emailRegex.test(email)) {
                document.getElementById('loginEmailError').style.display = 'block';
                document.getElementById('loginEmail').classList.add('invalid');
                isValid = false;
            } else {
                document.getElementById('loginEmailError').style.display = 'none';
                document.getElementById('loginEmail').classList.remove('invalid');
            }

            // Validate Password (just ensure it's not empty)
            if (!password || password.length === 0) {
                document.getElementById('loginPasswordError').style.display = 'block';
                document.getElementById('loginPassword').classList.add('invalid');
                isValid = false;
            } else {
                document.getElementById('loginPasswordError').style.display = 'none';
                document.getElementById('loginPassword').classList.remove('invalid');
            }

            if (!isValid) return;

            showLoading('Signing you in...');

            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(function(userCredential) {
                        hideLoading();
                        showToast('✅ Welcome back! Redirecting...');
                        setTimeout(function() {
                            window.location.href = 'acad/acad.html';
                        }, 1500);
                    })
                    .catch(function(error) {
                        hideLoading();
                        var msg = 'Login failed. Please try again.';
                        if (error.code === 'auth/user-not-found') {
                            msg = 'No account found with this email.';
                            document.getElementById('loginEmail').classList.add('invalid');
                            document.getElementById('loginEmailError').textContent = msg;
                            document.getElementById('loginEmailError').style.display = 'block';
                        } else if (error.code === 'auth/wrong-password') {
                            msg = 'Incorrect password. Please try again.';
                            document.getElementById('loginPassword').classList.add('invalid');
                            document.getElementById('loginPasswordError').textContent = msg;
                            document.getElementById('loginPasswordError').style.display = 'block';
                        } else if (error.code === 'auth/too-many-requests') {
                            msg = 'Too many failed attempts. Please wait a few minutes.';
                        } else if (error.code === 'auth/network-request-failed') {
                            msg = 'Network error. Please check your internet connection.';
                        }
                        showToast('❌ ' + msg, true);
                    });
            }
        });
    }

    // Real-time validation clearing for login form
    var loginInputs = document.querySelectorAll('#loginForm input');
    loginInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            var errorId = this.id + 'Error';
            var errorEl = document.getElementById(errorId);
            if (errorEl && errorEl.style.display === 'block') {
                errorEl.style.display = 'none';
                this.classList.remove('invalid');
            }
        });
    });

    // ============================================================
    // 4. REGISTER FORM (Strict Email + Password, dot allowed)
    // ============================================================
    var registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var email = document.getElementById('email').value.trim();
            var password = document.getElementById('password').value;

            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Password: at least 8 chars, upper, lower, number, and special char from !@#$%^&*.
            var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,}$/;

            var isValid = true;

            // Validate Email
            if (!emailRegex.test(email)) {
                document.getElementById('emailError').style.display = 'block';
                document.getElementById('email').classList.add('invalid');
                isValid = false;
            } else {
                document.getElementById('emailError').style.display = 'none';
                document.getElementById('email').classList.remove('invalid');
            }

            // Validate Password
            if (!passwordRegex.test(password)) {
                document.getElementById('passwordError').style.display = 'block';
                document.getElementById('password').classList.add('invalid');
                isValid = false;
            } else {
                document.getElementById('passwordError').style.display = 'none';
                document.getElementById('password').classList.remove('invalid');
            }

            if (!isValid) return;

            showLoading('Creating your account...');

            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(function(userCredential) {
                        var user = userCredential.user;
                        // We don't set displayName because we don't collect it here.
                        return user;
                    })
                    .then(function(user) {
                        // Save minimal info to Realtime Database (so Academy knows user exists)
                        if (typeof window.rtdb !== 'undefined' && window.rtdb) {
                            window.rtdb.ref('users/' + user.uid).set({
                                email: email,
                                createdAt: new Date().toISOString()
                            }).catch(function(err) {
                                console.warn('SOLVATECH: Could not save initial RTDB entry:', err);
                            });
                        }

                        // Save to localStorage (TrebEdit fallback)
                        localStorage.setItem('solvatech_local_user_' + user.uid, JSON.stringify({
                            email: email,
                            createdAt: new Date().toISOString()
                        }));

                        // Send Telegram notification (if configured)
                        try {
                            var tgMsg = "🎓 *New User Registered!*\n\n📧 Email: " + email + "\n🕒 Time: " + new Date().toLocaleString();
                            if (typeof window.sendTelegramMessage === 'function') {
                                window.sendTelegramMessage(tgMsg);
                            }
                        } catch (e) { /* ignore */ }

                        hideLoading();
                        showToast('🎉 Account created! Redirecting...');
                        setTimeout(function() {
                            window.location.href = 'acad/acad.html';
                        }, 1500);
                    })
                    .catch(function(error) {
                        hideLoading();
                        console.error('SOLVATECH: Registration error:', error);
                        var msg = 'Registration failed. Please try again.';
                        if (error.code === 'auth/email-already-in-use') {
                            msg = 'This email is already registered. Please log in instead.';
                            document.getElementById('email').classList.add('invalid');
                            document.getElementById('emailError').textContent = msg;
                            document.getElementById('emailError').style.display = 'block';
                        } else if (error.code === 'auth/weak-password') {
                            msg = 'Password is too weak. Use at least 8 characters with a mix.';
                        } else if (error.code === 'auth/invalid-email') {
                            msg = 'Invalid email address.';
                        } else if (error.code === 'auth/network-request-failed') {
                            msg = 'Network error. Check your internet connection and try again.';
                        }
                        showToast('❌ ' + msg, true);
                    });
            } else {
                // Fallback if Firebase not available
                hideLoading();
                showToast('❌ Firebase not available. Try again later.', true);
            }
        });
    }

    // Real-time validation clearing for register form
    var registerInputs = document.querySelectorAll('#registerForm input');
    registerInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            var errorId = this.id + 'Error';
            var errorEl = document.getElementById(errorId);
            if (errorEl && errorEl.style.display === 'block') {
                errorEl.style.display = 'none';
                this.classList.remove('invalid');
            }
        });
    });

    console.log('✅ SOLVATECH: Auth JS ready (strict registration, dot allowed).');
});