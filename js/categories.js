"use strict";


/* =========================================
   STORAGE KEYS
========================================= */

const LOGIN_STATUS_KEY =
    "isGyanAstraLoggedIn";

const LOGGED_STUDENT_KEY =
    "loggedInStudent";

const STREAK_KEY =
    "gyanAstraStreak";

const TOTAL_XP_KEY =
    "gyanAstraTotalXP";

const COURSE_COUNT_KEY =
    "gyanAstraCourseCount";


/* =========================================
   DOM ELEMENTS
========================================= */

const studentName =
    document.getElementById(
        "studentName"
    );

const welcomeName =
    document.getElementById(
        "welcomeName"
    );

const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );

const profileInitial =
    document.getElementById(
        "profileInitial"
    );

const dailyXP =
    document.getElementById(
        "dailyXP"
    );

const streakCount =
    document.getElementById(
        "streakCount"
    );

const totalXP =
    document.getElementById(
        "totalXP"
    );

const courseCount =
    document.getElementById(
        "courseCount"
    );

const studentLevel =
    document.getElementById(
        "studentLevel"
    );

const categorySearch =
    document.getElementById(
        "categorySearch"
    );

const categoryGrid =
    document.getElementById(
        "categoryGrid"
    );

const noResults =
    document.getElementById(
        "noResults"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const profileBtn =
    document.getElementById(
        "profileBtn"
    );

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );

const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );


/* =========================================
   AUTH CHECK
========================================= */

function checkLogin() {

    const isLoggedIn =
        localStorage.getItem(
            LOGIN_STATUS_KEY
        );


    if (
        isLoggedIn !== "true"
    ) {

        window.location.href =
            "./login.html";

        return false;
    }


    return true;
}


if (!checkLogin()) {

    throw new Error(
        "User is not logged in."
    );
}


/* =========================================
   USER NAME
========================================= */

function loadStudentName() {

    let name =
        localStorage.getItem(
            LOGGED_STUDENT_KEY
        );


    if (!name) {
        name = "Student";
    }


    if (studentName) {
        studentName.textContent =
            name;
    }


    if (welcomeName) {
        welcomeName.textContent =
            name.split(" ")[0];
    }


    const initial =
        name
            .charAt(0)
            .toUpperCase();


    if (profileAvatar) {
        profileAvatar.textContent =
            initial;
    }


    if (profileInitial) {
        profileInitial.textContent =
            initial;
    }
}


/* =========================================
   NUMBER STORAGE HELPER
========================================= */

function getNumber(
    key,
    defaultValue = 0
) {

    const value =
        Number(
            localStorage.getItem(key)
        );


    if (
        Number.isNaN(value)
    ) {

        return defaultValue;
    }


    return value;
}


/* =========================================
   STUDENT STATS
========================================= */

function loadStudentStats() {

    const streak =
        getNumber(
            STREAK_KEY,
            0
        );


    const xp =
        getNumber(
            TOTAL_XP_KEY,
            0
        );


    const courses =
        getNumber(
            COURSE_COUNT_KEY,
            0
        );


    const level =
        Math.max(
            1,
            Math.floor(
                xp / 500
            ) + 1
        );


    const todayXP =
        Math.min(
            xp,
            50
        );


    if (streakCount) {
        streakCount.textContent =
            streak;
    }


    if (totalXP) {
        totalXP.textContent =
            xp;
    }


    if (courseCount) {
        courseCount.textContent =
            courses;
    }


    if (studentLevel) {
        studentLevel.textContent =
            level;
    }


    if (dailyXP) {
        dailyXP.textContent =
            todayXP;
    }
}


/* =========================================
   CATEGORY SEARCH
========================================= */

function searchCategories() {

    if (!categorySearch) {
        return;
    }


    const searchTerm =
        categorySearch.value
            .trim()
            .toLowerCase();


    const cards =
        categoryGrid.querySelectorAll(
            ".category-card"
        );


    let visibleCount =
        0;


    cards.forEach(
        function (card) {

            const searchData =
                (
                    card.dataset.search ||
                    ""
                ).toLowerCase();


            const cardText =
                card.textContent
                    .toLowerCase();


            const matched =
                !searchTerm ||
                searchData.includes(
                    searchTerm
                ) ||
                cardText.includes(
                    searchTerm
                );


            if (matched) {

                card.style.display =
                    "";

                visibleCount++;

            } else {

                card.style.display =
                    "none";
            }
        }
    );


    if (noResults) {

        noResults.classList.toggle(
            "hidden",
            visibleCount !== 0
        );
    }
}


if (categorySearch) {

    categorySearch.addEventListener(
        "input",
        searchCategories
    );
}


/* =========================================
   MOBILE SIDEBAR
========================================= */

function openSidebar() {

    if (sidebar) {
        sidebar.classList.add(
            "open"
        );
    }


    if (sidebarOverlay) {
        sidebarOverlay.classList.add(
            "open"
        );
    }
}


function closeSidebar() {

    if (sidebar) {
        sidebar.classList.remove(
            "open"
        );
    }


    if (sidebarOverlay) {
        sidebarOverlay.classList.remove(
            "open"
        );
    }
}


if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener(
        "click",
        openSidebar
    );
}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );
}


/* =========================================
   CLOSE SIDEBAR AFTER NAVIGATION
========================================= */

document
    .querySelectorAll(".nav-item")
    .forEach(
        function (item) {

            item.addEventListener(
                "click",
                closeSidebar
            );
        }
    );


/* =========================================
   LOGOUT
========================================= */

function logout() {

    const confirmed =
        window.confirm(
            "Kya aap GyanAstra se logout karna chahte hain?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        LOGIN_STATUS_KEY
    );

    localStorage.removeItem(
        LOGGED_STUDENT_KEY
    );

    localStorage.removeItem(
        "loggedInStudentId"
    );

    localStorage.removeItem(
        "gyanAstraUserRole"
    );


    window.location.href =
        "./login.html";
}


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logout
    );
}


/* =========================================
   PROFILE BUTTON
========================================= */

if (profileBtn) {

    profileBtn.addEventListener(
        "click",
        function () {

            alert(
                "Profile page hum next phase mein add karenge."
            );

        }
    );
}


/* =========================================
   NOTIFICATION
========================================= */

if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        function () {

            alert(
                "🔔 Abhi koi new notification nahi hai."
            );

        }
    );
}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadStudentName();

        loadStudentStats();

        searchCategories();
    }
);