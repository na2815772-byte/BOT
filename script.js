// ==========================================
// Helper Function: Text to Speech (Voice)
// ==========================================
function speakMessage(text) {
    if ('speechSynthesis' in window) {
        // আগের কোনো ভয়েস চলতে থাকলে তা বন্ধ করা
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9; // স্মুথ ও স্পষ্ট ভয়েস স্পিড
        window.speechSynthesis.speak(utterance);
    }
}

// ==========================================
// Helper Function: Show Message in UI
// ==========================================
function showMessage(elementId, text, isSuccess = false) {
    const msgBox = document.getElementById(elementId);
    if (!msgBox) return;

    msgBox.style.display = 'block';
    msgBox.innerText = text;

    if (isSuccess) {
        msgBox.style.background = 'rgba(34, 197, 94, 0.2)';
        msgBox.style.border = '1px solid rgba(34, 197, 94, 0.4)';
        msgBox.style.color = '#86efac';
    } else {
        msgBox.style.background = 'rgba(220, 38, 38, 0.2)';
        msgBox.style.border = '1px solid rgba(220, 38, 38, 0.4)';
        msgBox.style.color = '#fca5a5';
    }
}

// ==========================================
// Helper Function: Strong Password Regex
// (Min 8 chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Char)
// ==========================================
function isStrongPassword(password) {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
}

// ==========================================
// REGISTRATION FORM LOGIC
// ==========================================
const regForm = document.getElementById('registrationForm');

if (regForm) {
    regForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // ফর্ম ইনপুট ভ্যালু নেওয়া
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // ১. পাসওয়ার্ড স্ট্রং কিনা যাচাই
        if (!isStrongPassword(password)) {
            const errorMsg = "Password must be at least 8 characters with uppercase, lowercase, number, and symbol.";
            showMessage('regMsgBox', errorMsg);
            speakMessage("Password is too weak. Please follow the password rules.");
            return;
        }

        // ২. পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড ম্যাচ যাচাই
        if (password !== confirmPassword) {
            const errorMsg = "Sorry, passwords do not match!";
            showMessage('regMsgBox', errorMsg);
            speakMessage(errorMsg);
            return;
        }

        // ৩. পূর্বে রেজিস্টার্ড ইউজার লিস্ট আনা (localStorage থেকে)
        let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        // ৪. ডুপ্লিকেট ইমেইল চেক
        const isEmailExists = users.some(user => user.email === email);

        if (isEmailExists) {
            const errorMsg = "Sorry, this email is already registered!";
            showMessage('regMsgBox', errorMsg);
            speakMessage(errorMsg);
            return;
        }

        // ৫. নতুন ইউজার অবজেক্ট তৈরি ও সেভ করা
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };

        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));

        // সফল মেসেজ ও রিডাইরেক্ট
        const successMsg = "Registration successful! Redirecting to login page...";
        showMessage('regMsgBox', successMsg, true);
        speakMessage("Registration successful! Redirecting to login page.");

        setTimeout(function () {
            window.location.href = 'login.html';
        }, 2000);
    });
}

// ==========================================
// LOGIN FORM LOGIC
// ==========================================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        // localStorage থেকে সব রেজিস্টার্ড ইউজার আনা
        let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        // ইউজার ম্যাচ চেক
        const validUser = users.find(user => user.email === email && user.password === password);

        if (validUser) {
            // সফলভাবে লগইন হলে সক্রিয় ইউজার হিসেবে সেভ
            localStorage.setItem('currentUser', JSON.stringify(validUser));

            const successMsg = "Login successful! Welcome back.";
            showMessage('loginMsgBox', successMsg, true);
            speakMessage(`Welcome back, ${validUser.firstName}!`);

            setTimeout(function () {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            const errorMsg = "Invalid email or password!";
            showMessage('loginMsgBox', errorMsg);
            speakMessage("Sorry, invalid email or password. Please try again.");
        }
    });
          }
