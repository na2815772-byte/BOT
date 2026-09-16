// ==========================================
// Helper Function: Text to Speech (Voice) - 1.5x Speed
// ==========================================
function speakMessage(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // পূর্বের ভয়েস থামানো

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.5; // নির্দেশনামতো ১.৫x স্পিড
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

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!isStrongPassword(password)) {
            const errorMsg = "Password must be at least 8 characters with uppercase, lowercase, number, and symbol.";
            showMessage('regMsgBox', errorMsg);
            speakMessage("Password is too weak. Please follow the password rules.");
            return;
        }

        if (password !== confirmPassword) {
            const errorMsg = "Sorry, passwords do not match!";
            showMessage('regMsgBox', errorMsg);
            speakMessage(errorMsg);
            return;
        }

        let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        const isEmailExists = users.some(user => user.email === email);

        if (isEmailExists) {
            const errorMsg = "Sorry, don't know match allowed.";
            showMessage('regMsgBox', errorMsg);
            speakMessage(errorMsg);
            return;
        }

        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };

        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));

        const successMsg = "Registration successful! Redirecting to login page...";
        showMessage('regMsgBox', successMsg, true);
        speakMessage("Please complete your registration first, then return to the home page.");

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

        let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        const validUser = users.find(user => user.email === email && user.password === password);

        if (validUser) {
            localStorage.setItem('currentUser', JSON.stringify(validUser));

            const successMsg = "Login successful! Welcome back.";
            showMessage('loginMsgBox', successMsg, true);
            speakMessage("Welcome back to the page");

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

// ==========================================
// HOME PAGE (INDEX.HTML) MAIN LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const navAuthLinks = document.getElementById('navAuthLinks');
    const logoutBtn = document.getElementById('logoutBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const heroSection = document.getElementById('heroSection');
    const botSection = document.getElementById('botSection');

    // ১. নেভবার এবং লগইন স্টেট আপডেট
    if (currentUser) {
        if (navAuthLinks) navAuthLinks.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
    } else {
        if (navAuthLinks) navAuthLinks.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
    }

    // ২. লগআউট হ্যান্ডলার
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    // ৩. Get Started বাটন ক্লিক লজিক
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function () {
            if (!currentUser) {
                // ইউজার লগইন না থাকলে ভয়েস দিবে
                speakMessage("Please complete your registration first, then return to the home page.");
            } else {
                // ইউজার লগইন করা থাকলে অন্য সেকশনে (বট পেজে) নিয়ে যাবে
                if (heroSection) heroSection.classList.add('hidden');
                if (botSection) botSection.classList.remove('hidden');
                speakMessage("Welcome back to the page");
            }
        });
    }

    // ৪. ব্যাকগ্রাউন্ড স্পিচ রিকগনিশন (অদৃশ্য টেক্সট প্রসেসিং)
    const startRecordBtn = document.getElementById('startRecordBtn');
    const stopRecordBtn = document.getElementById('stopRecordBtn');
    const submitBtn = document.getElementById('submitBtn');
    const userInputText = document.getElementById('userInputText');
    const botResponseArea = document.getElementById('botResponseArea');
    const responseText = document.getElementById('responseText');
    const visualizer = document.getElementById('visualizer');

    let recognition = null;
    let recordedText = "";

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'bn-BD';
        recognition.continuous = true;

        recognition.onresult = function (event) {
            let result = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                result += event.results[i][0].transcript;
            }
            recordedText = result; // ব্যাকগ্রাউন্ডে সেভ হবে
        };
    }

    if (startRecordBtn) {
        startRecordBtn.addEventListener('click', function () {
            if (!recognition) return alert("Speech recognition not supported in this browser.");
            
            recordedText = "";
            recognition.start();
            if (visualizer) visualizer.classList.add('recording');
            startRecordBtn.disabled = true;
            if (stopRecordBtn) stopRecordBtn.disabled = false;
        });
    }

    if (stopRecordBtn) {
        stopRecordBtn.addEventListener('click', function () {
            if (recognition) recognition.stop();
            if (visualizer) visualizer.classList.remove('recording');
            startRecordBtn.disabled = false;
            stopRecordBtn.disabled = true;
        });
    }

    // ৫. সাবমিট বাটন লজিক (index.js ব্যাকএন্ড রাউটের সাথে ম্যাচ করবে)
    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            const query = recordedText.trim() || (userInputText ? userInputText.value.trim() : "");
            
            if (!query) return;

            fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query })
            })
            .then(res => res.json())
            .then(data => {
                const answer = data.answer || "Sorry, I could not find a matching answer.";
                if (responseText) responseText.innerText = answer;
                if (botResponseArea) botResponseArea.classList.remove('hidden');
                speakMessage(answer);
                recordedText = ""; // রিসেট
            })
            .catch(err => {
                const fallbackMsg = "Sorry, I could not find a matching answer in my database.";
                if (responseText) responseText.innerText = fallbackMsg;
                if (botResponseArea) botResponseArea.classList.remove('hidden');
                speakMessage(fallbackMsg);
            });
        });
    }
});
