// ============================================================
// script.js
// MAIN AUTHENTICATION + REDIRECT SYSTEM
// ============================================================


// ============================================================
// TEXT TO SPEECH
// ============================================================

function speakMessage(text) {

    if ("speechSynthesis" in window) {

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.lang = "en-US";
        utterance.rate = 1.5;

        window.speechSynthesis.speak(utterance);
    }
}


// ============================================================
// SHOW MESSAGE
// ============================================================

function showMessage(
    elementId,
    text,
    isSuccess = false
) {

    const msgBox =
        document.getElementById(elementId);

    if (!msgBox) return;

    msgBox.style.display = "block";
    msgBox.innerText = text;

    if (isSuccess) {

        msgBox.style.background =
            "rgba(34, 197, 94, 0.2)";

        msgBox.style.border =
            "1px solid rgba(34, 197, 94, 0.4)";

        msgBox.style.color =
            "#86efac";

    } else {

        msgBox.style.background =
            "rgba(220, 38, 38, 0.2)";

        msgBox.style.border =
            "1px solid rgba(220, 38, 38, 0.4)";

        msgBox.style.color =
            "#fca5a5";
    }
}


// ============================================================
// STRONG PASSWORD CHECK
// ============================================================

function isStrongPassword(password) {

    const minLength =
        password.length >= 8;

    const hasUpper =
        /[A-Z]/.test(password);

    const hasLower =
        /[a-z]/.test(password);

    const hasNumber =
        /[0-9]/.test(password);

    const hasSpecial =
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return (
        minLength &&
        hasUpper &&
        hasLower &&
        hasNumber &&
        hasSpecial
    );
}


// ============================================================
// REGISTRATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const regForm =
            document.getElementById(
                "registrationForm"
            );

        if (regForm) {

            regForm.addEventListener(
                "submit",
                function (e) {

                    e.preventDefault();


                    const firstNameElement =
                        document.getElementById(
                            "firstName"
                        );

                    const lastNameElement =
                        document.getElementById(
                            "lastName"
                        );

                    const emailElement =
                        document.getElementById(
                            "regEmail"
                        );

                    const passwordElement =
                        document.getElementById(
                            "regPassword"
                        );

                    const confirmPasswordElement =
                        document.getElementById(
                            "confirmPassword"
                        );


                    if (
                        !firstNameElement ||
                        !lastNameElement ||
                        !emailElement ||
                        !passwordElement ||
                        !confirmPasswordElement
                    ) {

                        return;
                    }


                    const firstName =
                        firstNameElement.value.trim();

                    const lastName =
                        lastNameElement.value.trim();

                    const email =
                        emailElement.value
                            .trim()
                            .toLowerCase();

                    const password =
                        passwordElement.value;

                    const confirmPassword =
                        confirmPasswordElement.value;


                    // ----------------------------------------
                    // PASSWORD VALIDATION
                    // ----------------------------------------

                    if (
                        !isStrongPassword(password)
                    ) {

                        const errorMsg =
                            "Password must be at least 8 characters with uppercase, lowercase, number, and symbol.";

                        showMessage(
                            "regMsgBox",
                            errorMsg
                        );

                        speakMessage(
                            "Password is too weak. Please follow the password rules."
                        );

                        return;
                    }


                    // ----------------------------------------
                    // PASSWORD MATCH
                    // ----------------------------------------

                    if (
                        password !== confirmPassword
                    ) {

                        const errorMsg =
                            "Sorry, passwords do not match!";

                        showMessage(
                            "regMsgBox",
                            errorMsg
                        );

                        speakMessage(
                            errorMsg
                        );

                        return;
                    }


                    // ----------------------------------------
                    // GET USERS
                    // ----------------------------------------

                    let users =
                        JSON.parse(
                            localStorage.getItem(
                                "registeredUsers"
                            )
                        ) || [];


                    // ----------------------------------------
                    // EMAIL CHECK
                    // ----------------------------------------

                    const isEmailExists =
                        users.some(
                            function (user) {

                                return (
                                    user.email ===
                                    email
                                );

                            }
                        );


                    if (isEmailExists) {

                        const errorMsg =
                            "This email is already registered.";

                        showMessage(
                            "regMsgBox",
                            errorMsg
                        );

                        speakMessage(
                            "This email is already registered. Please use another email."
                        );

                        return;
                    }


                    // ----------------------------------------
                    // CREATE USER
                    // ----------------------------------------

                    const newUser = {

                        firstName:
                            firstName,

                        lastName:
                            lastName,

                        email:
                            email,

                        password:
                            password
                    };


                    users.push(newUser);


                    // ----------------------------------------
                    // SAVE USER
                    // ----------------------------------------

                    localStorage.setItem(
                        "registeredUsers",
                        JSON.stringify(users)
                    );


                    // ----------------------------------------
                    // REGISTRATION COMPLETE
                    //
                    // এখনো Login করা হয়নি
                    // ----------------------------------------

                    localStorage.removeItem(
                        "currentUser"
                    );

                    localStorage.setItem(
                        "isLoggedIn",
                        "false"
                    );


                    const successMsg =
                        "Registration successful! Redirecting to login page...";

                    showMessage(
                        "regMsgBox",
                        successMsg,
                        true
                    );

                    speakMessage(
                        "Registration successful. Please login to continue."
                    );


                    // ----------------------------------------
                    // LOGIN PAGE
                    // ----------------------------------------

                    setTimeout(
                        function () {

                            window.location.href =
                                "login.html";

                        },
                        1500
                    );

                }
            );
        }


        // ====================================================
        // LOGIN
        // ====================================================

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                function (e) {

                    e.preventDefault();


                    const emailElement =
                        document.getElementById(
                            "loginEmail"
                        );

                    const passwordElement =
                        document.getElementById(
                            "loginPassword"
                        );


                    if (
                        !emailElement ||
                        !passwordElement
                    ) {

                        return;
                    }


                    const email =
                        emailElement.value
                            .trim()
                            .toLowerCase();

                    const password =
                        passwordElement.value;


                    // ----------------------------------------
                    // GET USERS
                    // ----------------------------------------

                    let users =
                        JSON.parse(
                            localStorage.getItem(
                                "registeredUsers"
                            )
                        ) || [];


                    // ----------------------------------------
                    // FIND USER
                    // ----------------------------------------

                    const validUser =
                        users.find(
                            function (user) {

                                return (
                                    user.email ===
                                    email &&
                                    user.password ===
                                    password
                                );

                            }
                        );


                    // ----------------------------------------
                    // LOGIN SUCCESS
                    // ----------------------------------------

                    if (validUser) {

                        /*
                         * Current user save
                         */

                        localStorage.setItem(
                            "currentUser",
                            JSON.stringify(
                                validUser
                            )
                        );


                        /*
                         * IMPORTANT
                         *
                         * index.html এই value দেখে
                         * বুঝবে user logged in.
                         */

                        localStorage.setItem(
                            "isLoggedIn",
                            "true"
                        );


                        const successMsg =
                            "Login successful! Welcome back.";

                        showMessage(
                            "loginMsgBox",
                            successMsg,
                            true
                        );

                        speakMessage(
                            "Welcome back to the page."
                        );


                        // ------------------------------------
                        // HOME PAGE
                        // ------------------------------------

                        setTimeout(
                            function () {

                                window.location.href =
                                    "index.html";

                            },
                            1200
                        );


                    } else {

                        const errorMsg =
                            "Invalid email or password!";

                        showMessage(
                            "loginMsgBox",
                            errorMsg
                        );

                        speakMessage(
                            "Sorry, invalid email or password. Please try again."
                        );

                    }

                }
            );
        }


        // ====================================================
        // HOME PAGE
        // ====================================================

        const currentUserText =
            localStorage.getItem(
                "currentUser"
            );


        let currentUser = null;


        try {

            currentUser =
                currentUserText
                    ? JSON.parse(
                        currentUserText
                    )
                    : null;

        } catch (error) {

            currentUser = null;

            localStorage.removeItem(
                "currentUser"
            );

            localStorage.setItem(
                "isLoggedIn",
                "false"
            );
        }


        const isLoggedIn =
            localStorage.getItem(
                "isLoggedIn"
            ) === "true";


        const navAuthLinks =
            document.getElementById(
                "navAuthLinks"
            );


        const authLinks =
            document.getElementById(
                "authLinks"
            );


        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        const getStartedBtn =
            document.getElementById(
                "getStartedBtn"
            );


        const menuBtn =
            document.getElementById(
                "menuBtn"
            );


        const dropdownMenu =
            document.getElementById(
                "dropdownMenu"
            );


        // ====================================================
        // UPDATE HOME LOGIN STATUS
        // ====================================================

        if (
            currentUser &&
            isLoggedIn
        ) {

            /*
             * Login + Registration Hide
             */

            if (navAuthLinks) {

                navAuthLinks.classList.add(
                    "hidden"
                );

            }

            if (authLinks) {

                authLinks.classList.add(
                    "hidden"
                );

            }


            /*
             * Logout Show
             */

            if (logoutBtn) {

                logoutBtn.classList.remove(
                    "hidden"
                );

            }

        } else {

            /*
             * User logged out
             *
             * Login + Registration Show
             */

            if (navAuthLinks) {

                navAuthLinks.classList.remove(
                    "hidden"
                );

            }

            if (authLinks) {

                authLinks.classList.remove(
                    "hidden"
                );

            }


            /*
             * Logout Hide
             */

            if (logoutBtn) {

                logoutBtn.classList.add(
                    "hidden"
                );

            }
        }


        // ====================================================
        // THREE LINE MENU
        // ====================================================

        if (menuBtn && dropdownMenu) {

            menuBtn.addEventListener(
                "click",
                function (e) {

                    e.stopPropagation();

                    dropdownMenu.classList.toggle(
                        "hidden"
                    );

                }
            );
        }


        // ====================================================
        // CLOSE MENU WHEN CLICKING OUTSIDE
        // ====================================================

        document.addEventListener(
            "click",
            function (e) {

                if (
                    dropdownMenu &&
                    menuBtn &&
                    !dropdownMenu.contains(e.target) &&
                    !menuBtn.contains(e.target)
                ) {

                    dropdownMenu.classList.add(
                        "hidden"
                    );

                }

            }
        );


        // ====================================================
        // LOGOUT
        // ====================================================

        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                function () {

                    /*
                     * Current user remove
                     */

                    localStorage.removeItem(
                        "currentUser"
                    );


                    /*
                     * Login status false
                     */

                    localStorage.setItem(
                        "isLoggedIn",
                        "false"
                    );


                    /*
                     * Login page
                     */

                    window.location.href =
                        "login.html";

                }
            );
        }


        // ====================================================
        // GET STARTED
        // ====================================================

        if (getStartedBtn) {

            getStartedBtn.addEventListener(
                "click",
                function () {

                    const loggedInNow =
                        localStorage.getItem(
                            "isLoggedIn"
                        ) === "true";


                    // ----------------------------------------
                    // NEW / LOGGED OUT USER
                    // ----------------------------------------

                    if (!loggedInNow) {

                        speakMessage(
                            "Please login or complete your registration first."
                        );


                        /*
                         * Login / Registration page
                         */

                        window.location.href =
                            "login.html";

                        return;
                    }


                    // ----------------------------------------
                    // LOGGED IN USER
                    // ----------------------------------------

                    speakMessage(
                        "Welcome back. Opening the record page."
                    );


                    /*
                     * Directly Record Page
                     */

                    window.location.href =
                        "record.html";

                }
            );
        }


        // ====================================================
        // HELP CENTER
        // ====================================================

        const helpBtn =
            document.getElementById(
                "helpBtn"
            );


        const helpCenterBtn =
            document.getElementById(
                "helpCenterBtn"
            );


        const helpElement =
            helpBtn || helpCenterBtn;


        if (helpElement) {

            helpElement.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();

                    /*
                     * এখানে পরে Help Center page
                     * যুক্ত করা যাবে।
                     */

                    alert(
                        "Help Center"
                    );

                }
            );
        }

    }
);
