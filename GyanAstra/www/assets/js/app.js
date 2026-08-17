"use strict";


/* =========================================
   ELEMENTS
========================================= */

const welcomeScreen =
    document.getElementById("welcomeScreen");

const loadingScreen =
    document.getElementById("loadingScreen");

const startLearningBtn =
    document.getElementById("startLearningBtn");

const rocketBar =
    document.getElementById("rocketBar");

const statusText =
    document.getElementById("statusText");


/* =========================================
   START LEARNING
========================================= */

function startLearning() {

    if (
        !welcomeScreen ||
        !loadingScreen ||
        !startLearningBtn ||
        !rocketBar ||
        !statusText
    ) {
        return;
    }


    /* Prevent multiple clicks */

    startLearningBtn.disabled = true;


    /* Hide welcome */

    welcomeScreen.style.display = "none";


    /* Show loading */

    loadingScreen.style.display = "block";


    /* Start progress */

    rocketBar.style.animation =
        "loadProgress 3.5s forwards";


    /* =====================================
       STEP 1
    ====================================== */

    setTimeout(function () {

        statusText.textContent =
            "Preparing your learning environment...";

        statusText.style.color =
            "#ff9800";

        rocketBar.style.background =
            "#ff9800";

        rocketBar.style.boxShadow =
            "0 0 10px #ff9800";

    }, 1500);


    /* =====================================
       STEP 2
    ====================================== */

    setTimeout(function () {

        statusText.textContent =
            "GyanAstra is ready!";

        statusText.style.color =
            "#16a34a";

        rocketBar.style.background =
            "#16a34a";

        rocketBar.style.boxShadow =
            "0 0 10px #16a34a";

    }, 3000);


    /* =====================================
       LOGIN PAGE
    ====================================== */

    setTimeout(function () {

        window.location.href =
            "./login.html";

    }, 3500);
}


/* =========================================
   BUTTON EVENT
========================================= */

if (startLearningBtn) {

    startLearningBtn.addEventListener(
        "click",
        startLearning
    );
}