"use strict";


/* =========================================
   STORAGE KEYS
========================================= */

const STUDENT_DB_KEY =
    "gyanAstraStudentsDB";

const ADMIN_USERS_KEY =
    "adminUsers";

const LOGIN_STATUS_KEY =
    "isGyanAstraLoggedIn";

const LOGGED_STUDENT_KEY =
    "loggedInStudent";

const LOGGED_STUDENT_ID_KEY =
    "loggedInStudentId";

const USER_ROLE_KEY =
    "gyanAstraUserRole";


/* =========================================
   DOM ELEMENTS
========================================= */

const loginSection =
    document.getElementById(
        "loginSection"
    );

const signupSection =
    document.getElementById(
        "signupSection"
    );


const loginEmail =
    document.getElementById(
        "loginEmail"
    );

const loginPass =
    document.getElementById(
        "loginPass"
    );


const signupName =
    document.getElementById(
        "signupName"
    );

const signupEmail =
    document.getElementById(
        "signupEmail"
    );

const signupPass =
    document.getElementById(
        "signupPass"
    );

const signupConfirmPass =
    document.getElementById(
        "signupConfirmPass"
    );


const loginBtn =
    document.getElementById(
        "loginBtn"
    );

const signupBtn =
    document.getElementById(
        "signupBtn"
    );


const showSignupBtn =
    document.getElementById(
        "showSignupBtn"
    );

const showLoginBtn =
    document.getElementById(
        "showLoginBtn"
    );


const loginStatus =
    document.getElementById(
        "loginStatus"
    );

const signupStatus =
    document.getElementById(
        "signupStatus"
    );


/* =========================================
   STATUS MESSAGE
========================================= */

function showStatus(
    element,
    message,
    type = "info"
) {

    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        "status-message " + type;
}


function clearStatus(element) {

    if (!element) {
        return;
    }


    element.textContent =
        "";


    element.className =
        "status-message";
}


/* =========================================
   FORM SWITCHING
========================================= */

function showLoginForm() {

    signupSection.classList.add(
        "hidden"
    );

    loginSection.classList.remove(
        "hidden"
    );


    clearStatus(
        signupStatus
    );

    clearStatus(
        loginStatus
    );


    setTimeout(
        function () {

            loginEmail.focus();

        },
        50
    );
}


function showSignupForm() {

    loginSection.classList.add(
        "hidden"
    );

    signupSection.classList.remove(
        "hidden"
    );


    clearStatus(
        loginStatus
    );

    clearStatus(
        signupStatus
    );


    setTimeout(
        function () {

            signupName.focus();

        },
        50
    );
}


if (showSignupBtn) {

    showSignupBtn.addEventListener(
        "click",
        showSignupForm
    );
}


if (showLoginBtn) {

    showLoginBtn.addEventListener(
        "click",
        showLoginForm
    );
}


/* =========================================
   DATABASE
========================================= */

function getStudentDatabase() {

    try {

        const savedDB =
            localStorage.getItem(
                STUDENT_DB_KEY
            );


        if (!savedDB) {

            return {};
        }


        const database =
            JSON.parse(savedDB);


        if (
            typeof database !== "object" ||
            database === null ||
            Array.isArray(database)
        ) {

            return {};
        }


        return database;

    } catch (error) {

        console.error(
            "Database load error:",
            error
        );

        return {};
    }
}


function saveStudentDatabase(
    database
) {

    try {

        localStorage.setItem(
            STUDENT_DB_KEY,
            JSON.stringify(database)
        );


        return true;

    } catch (error) {

        console.error(
            "Database save error:",
            error
        );

        return false;
    }
}


/* =========================================
   EMAIL VALIDATION
========================================= */

function isValidEmail(email) {

    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(
        email
    );
}


/* =========================================
   PASSWORD SHOW / HIDE
========================================= */

function setupPasswordToggle(
    input,
    button
) {

    if (!input || !button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            const isPassword =
                input.type === "password";


            input.type =
                isPassword
                    ? "text"
                    : "password";


            button.textContent =
                isPassword
                    ? "🙈"
                    : "👁";


            button.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );
        }
    );
}


setupPasswordToggle(
    loginPass,
    document.getElementById(
        "loginPasswordToggle"
    )
);


setupPasswordToggle(
    signupPass,
    document.getElementById(
        "signupPasswordToggle"
    )
);


setupPasswordToggle(
    signupConfirmPass,
    document.getElementById(
        "confirmPasswordToggle"
    )
);


/* =========================================
   SIGN UP
========================================= */

function handleSignup() {

    clearStatus(
        signupStatus
    );


    const name =
        signupName.value.trim();


    const email =
        signupEmail.value
            .trim()
            .toLowerCase();


    const password =
        signupPass.value;


    const confirmPassword =
        signupConfirmPass.value;


    /* -------------------------------------
       Name
    -------------------------------------- */

    if (!name) {

        showStatus(
            signupStatus,
            "⚠️ Please enter your full name.",
            "error"
        );

        signupName.focus();

        return;
    }


    if (name.length < 2) {

        showStatus(
            signupStatus,
            "⚠️ Name must contain at least 2 characters.",
            "error"
        );

        signupName.focus();

        return;
    }


    /* -------------------------------------
       Email
    -------------------------------------- */

    if (!email) {

        showStatus(
            signupStatus,
            "⚠️ Please enter your email address.",
            "error"
        );

        signupEmail.focus();

        return;
    }


    if (!isValidEmail(email)) {

        showStatus(
            signupStatus,
            "⚠️ Please enter a valid email address.",
            "error"
        );

        signupEmail.focus();

        return;
    }


    /* -------------------------------------
       Password
    -------------------------------------- */

    if (!password) {

        showStatus(
            signupStatus,
            "⚠️ Please create a password.",
            "error"
        );

        signupPass.focus();

        return;
    }


    if (password.length < 6) {

        showStatus(
            signupStatus,
            "⚠️ Password must contain at least 6 characters.",
            "error"
        );

        signupPass.focus();

        return;
    }


    /* -------------------------------------
       Confirm Password
    -------------------------------------- */

    if (
        password !==
        confirmPassword
    ) {

        showStatus(
            signupStatus,
            "⚠️ Passwords do not match.",
            "error"
        );

        signupConfirmPass.focus();

        return;
    }


    /* -------------------------------------
       Load database
    -------------------------------------- */

    const database =
        getStudentDatabase();


    /* -------------------------------------
       Duplicate email
    -------------------------------------- */

    const existingUser =
        Object.keys(
            database
        ).find(
            function (key) {

                return (
                    key.toLowerCase() ===
                    email
                );

            }
        );


    if (existingUser) {

        showStatus(
            signupStatus,
            "⚠️ This email is already registered. Please login.",
            "error"
        );


        setTimeout(
            showLoginForm,
            1500
        );


        return;
    }


    /* -------------------------------------
       Create account
    -------------------------------------- */

    database[email] = {

        name:
            name,

        email:
            email,

        pass:
            password,

        course:
            "All Access / General",

        source:
            "Website Signup",

        createdAt:
            new Date().toISOString()
    };


    /* -------------------------------------
       Save
    -------------------------------------- */

    const saved =
        saveStudentDatabase(
            database
        );


    if (!saved) {

        showStatus(
            signupStatus,
            "❌ Account could not be saved.",
            "error"
        );

        return;
    }


    /* -------------------------------------
       Local Admin List
       
       Temporary prototype only.
    -------------------------------------- */

    try {

        let adminUsers =
            JSON.parse(
                localStorage.getItem(
                    ADMIN_USERS_KEY
                )
            ) || [];


        const exists =
            adminUsers.some(
                function (user) {

                    return (
                        user.email &&
                        user.email.toLowerCase() ===
                        email
                    );

                }
            );


        if (!exists) {

            adminUsers.push({

                name:
                    name,

                email:
                    email,

                course:
                    "General",

                source:
                    "Website",

                createdAt:
                    new Date().toISOString()
            });


            localStorage.setItem(
                ADMIN_USERS_KEY,
                JSON.stringify(
                    adminUsers
                )
            );
        }

    } catch (error) {

        console.warn(
            "Admin list sync skipped:",
            error
        );
    }


    /* -------------------------------------
       Success
    -------------------------------------- */

    showStatus(
        signupStatus,
        "✅ Registration successful! Please login.",
        "success"
    );


    /* Clear */

    signupName.value =
        "";

    signupEmail.value =
        "";

    signupPass.value =
        "";

    signupConfirmPass.value =
        "";


    /* Go Login */

    setTimeout(
        showLoginForm,
        1500
    );
}


/* =========================================
   LOGIN
========================================= */

function handleLogin() {

    clearStatus(
        loginStatus
    );


    const emailInput =
        loginEmail.value
            .trim()
            .toLowerCase();


    const passwordInput =
        loginPass.value;


    /* -------------------------------------
       Validation
    -------------------------------------- */

    if (!emailInput) {

        showStatus(
            loginStatus,
            "⚠️ Please enter your Gmail / Student ID.",
            "error"
        );

        loginEmail.focus();

        return;
    }


    if (!passwordInput) {

        showStatus(
            loginStatus,
            "⚠️ Please enter your password.",
            "error"
        );

        loginPass.focus();

        return;
    }


    /* -------------------------------------
       Student Database
    -------------------------------------- */

    const database =
        getStudentDatabase();


    /* -------------------------------------
       Temporary owner account
       
       ONLY FOR LOCAL DEVELOPMENT.
       
       Production में इसे हटाएँगे.
    -------------------------------------- */

    const ownerAccount = {

        "GA-SUMIT": {

            pass:
                "123456",

            name:
                "Sumit (Owner)",

            role:
                "owner"
        }
    };


    const users = {

        ...ownerAccount,

        ...database
    };


    /* -------------------------------------
       Find user
    -------------------------------------- */

    let matchedUser =
        null;

    let matchedKey =
        null;


    for (
        const key in users
    ) {

        if (
            key.toLowerCase() ===
            emailInput.toLowerCase()
        ) {

            matchedUser =
                users[key];

            matchedKey =
                key;

            break;
        }
    }


    /* -------------------------------------
       Check
    -------------------------------------- */

    if (
        matchedUser &&
        String(
            matchedUser.pass
        ) ===
        String(
            passwordInput
        )
    ) {


        /* ---------------------------------
           Session
        ---------------------------------- */

        localStorage.setItem(
            LOGIN_STATUS_KEY,
            "true"
        );


        localStorage.setItem(
            LOGGED_STUDENT_KEY,
            matchedUser.name ||
            "Student"
        );


        localStorage.setItem(
            LOGGED_STUDENT_ID_KEY,
            matchedKey
        );


        localStorage.setItem(
            USER_ROLE_KEY,
            matchedUser.role ||
            "student"
        );


        /* ---------------------------------
           Success
        ---------------------------------- */

        showStatus(
            loginStatus,
            "✅ Login successful! Opening GyanAstra...",
            "success"
        );


        loginBtn.disabled =
            true;


        /* ---------------------------------
           Redirect
        ---------------------------------- */

        setTimeout(
            function () {

                window.location.href =
                    "./categories.html";

            },
            800
        );


    } else {

        showStatus(
            loginStatus,
            "❌ Invalid Gmail / Student ID or password.",
            "error"
        );
    }
}


/* =========================================
   BUTTON EVENTS
========================================= */

if (signupBtn) {

    signupBtn.addEventListener(
        "click",
        handleSignup
    );
}


if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        handleLogin
    );
}


/* =========================================
   ENTER KEY
========================================= */

if (loginEmail) {

    loginEmail.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                loginPass.focus();
            }
        }
    );
}


if (loginPass) {

    loginPass.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                handleLogin();
            }
        }
    );
}


if (signupName) {

    signupName.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                signupEmail.focus();
            }
        }
    );
}


if (signupEmail) {

    signupEmail.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                signupPass.focus();
            }
        }
    );
}


if (signupPass) {

    signupPass.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                signupConfirmPass.focus();
            }
        }
    );
}


if (signupConfirmPass) {

    signupConfirmPass.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                handleSignup();
            }
        }
    );
}


/* =========================================
   CLEAR STATUS WHILE TYPING
========================================= */

[
    loginEmail,
    loginPass
].forEach(
    function (element) {

        if (!element) {
            return;
        }


        element.addEventListener(
            "input",
            function () {

                clearStatus(
                    loginStatus
                );
            }
        );
    }
);


[
    signupName,
    signupEmail,
    signupPass,
    signupConfirmPass
].forEach(
    function (element) {

        if (!element) {
            return;
        }


        element.addEventListener(
            "input",
            function () {

                clearStatus(
                    signupStatus
                );
            }
        );
    }
);


/* =========================================
   PAGE LOAD
========================================= */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        if (loginEmail) {

            loginEmail.focus();
        }
    }
);