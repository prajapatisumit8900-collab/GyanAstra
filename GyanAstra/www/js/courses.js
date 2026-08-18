"use strict";

/* =========================================
   GyanAstra Courses
   ========================================= */


/* =========================================
   LOGIN CHECK
   ========================================= */

const isLoggedIn =
    localStorage.getItem("isGyanAstraLoggedIn");

if (isLoggedIn !== "true") {
    window.location.href = "./login.html";
}


/* =========================================
   ELEMENTS
   ========================================= */

const courseGrid =
    document.getElementById("courseGrid");

const courseSearch =
    document.getElementById("courseSearch");

const levelFilter =
    document.getElementById("levelFilter");

const typeFilter =
    document.getElementById("typeFilter");

const courseCount =
    document.getElementById("courseCount");

const loading =
    document.getElementById("loading");

const emptyState =
    document.getElementById("emptyState");

const userAvatar =
    document.getElementById("userAvatar");
  
const notificationBtn =
    document.getElementById("notificationBtn");


/* =========================================
   USER
   ========================================= */

const studentName =
    localStorage.getItem("loggedInStudent") ||
    "Student";

if (userAvatar) {

    userAvatar.textContent =
        studentName
            .charAt(0)
            .toUpperCase();

}


/* =========================================
   COURSE DATA
   ========================================= */

let allCourses = [];


/* =========================================
   LOAD COURSES FROM BACKEND
   ========================================= */

async function loadCourses() {

    showLoading();

    try {

        const response =
            await fetch("http://localhost:5000/api/courses");

        if (!response.ok) {

            throw new Error(
                "Backend se courses load nahi ho paye"
            );

        }


        const data =
            await response.json();

        if (data.success && data.courses) {
            allCourses = data.courses;
        } else {
            allCourses = [];
        }


        hideLoading();

        applyFilters();

    }

    catch (error) {

        console.error(
            "Courses Error:",
            error
        );

        hideLoading();

        showEmpty(
            "Backend server se connect nahi ho paya. Server start karke dobara koshish karein."
        );

    }

}


/* =========================================
   SHOW LOADING
   ========================================= */

function showLoading() {

    if (loading) {
        loading.classList.remove("hidden");
    }

    if (courseGrid) {
        courseGrid.innerHTML = "";
    }

    if (emptyState) {
        emptyState.classList.add("hidden");
    }

}


/* =========================================
   HIDE LOADING
   ========================================= */

function hideLoading() {

    if (loading) {
        loading.classList.add("hidden");
    }

}


/* =========================================
   FILTER COURSES
   ========================================= */

function applyFilters() {

    const searchText =
        courseSearch
            ? courseSearch.value
                .trim()
                .toLowerCase()
            : "";


    const selectedLevel =
        levelFilter
            ? levelFilter.value
            : "all";


    const selectedType =
        typeFilter
            ? typeFilter.value
            : "all";


    const filteredCourses =
        allCourses.filter(course => {

            /* SEARCH */

            const title =
                String(
                    course.title || ""
                ).toLowerCase();


            const description =
                String(
                    course.description || ""
                ).toLowerCase();


            const category =
                String(
                    course.categoryName ||
                    course.category ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                !searchText ||
                title.includes(searchText) ||
                description.includes(searchText) ||
                category.includes(searchText);


            /* LEVEL */

            const courseLevel =
                String(
                    course.level || ""
                ).toLowerCase();


            const matchesLevel =
                selectedLevel === "all" ||
                courseLevel === selectedLevel;


            /* TYPE */

            const courseType =
                String(
                    course.type || "free"
                ).toLowerCase();


            const matchesType =
                selectedType === "all" ||
                courseType === selectedType;


            return (
                matchesSearch &&
                matchesLevel &&
                matchesType
            );

        });


    renderCourses(filteredCourses);

}


/* =========================================
   RENDER COURSES
   ========================================= */

function renderCourses(courses) {

    if (!courseGrid) {
        return;
    }


    courseGrid.innerHTML = "";


    /* COURSE COUNT */

    if (courseCount) {

        courseCount.textContent =
            `${courses.length} ${
                courses.length === 1
                    ? "Course"
                    : "Courses"
            }`;

    }


    /* EMPTY */

    if (!courses.length) {

        showEmpty(
            "Search या filter बदलकर फिर कोशिश करें।"
        );

        return;

    }


    if (emptyState) {
        emptyState.classList.add("hidden");
    }


    /* CREATE CARDS */

    courses.forEach(course => {

        const card =
            document.createElement("article");

        card.className =
            "course-card";


        const progress =
            Number(
                course.progress || 0
            );


        const courseType =
            String(
                course.type || "free"
            ).toLowerCase();


        const isPremium =
            courseType === "premium";


        card.innerHTML = `

            <div class="course-card-image">

                <div class="course-placeholder">
                    📚
                </div>

                <span class="course-badge">
                    ${
                        isPremium
                            ? "PREMIUM"
                            : "FREE"
                    }
                </span>

            </div>


            <div class="course-card-content">

                <span class="course-category">
                    ${escapeHTML(
                        course.categoryName ||
                        course.category ||
                        "Course"
                    )}
                </span>


                <h3>
                    ${escapeHTML(
                        course.title
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        course.description
                    )}
                </p>


                <div class="course-info">

                    <span>
                        🎓
                        ${escapeHTML(
                            course.level ||
                            "Beginner"
                        )}
                    </span>

                    <span>
                        📚
                        ${course.lessons || 0}
                        Lessons
                    </span>

                    <span>
                        ⏱️
                        ${escapeHTML(
                            course.duration ||
                            "N/A"
                        )}
                    </span>

                </div>


                <div class="progress-section">

                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width: ${progress}%"
                        ></div>

                    </div>

                    <small>
                        ${progress}% Complete
                    </small>

                </div>


                <button
                    class="view-course-btn"
                    data-course-id="${escapeHTML(course.id)}"
                >

                    ${
                        progress > 0
                            ? "Continue Learning →"
                            : "View Course →"
                    }

                </button>

            </div>

        `;


        /* BUTTON EVENT */

        const button =
            card.querySelector(
                ".view-course-btn"
            );


        button.addEventListener(
            "click",
            () => {

                openCourse(
                    course.id
                );

            }
        );


        courseGrid.appendChild(card);

    });

}


/* =========================================
   OPEN COURSE
   ========================================= */

function openCourse(courseId) {

    if (!courseId) {
        return;
    }


    window.location.href =
        "./course-details.html?id=" +
        encodeURIComponent(courseId);

}


/* =========================================
   EMPTY STATE
   ========================================= */

function showEmpty(message) {

    if (courseGrid) {
        courseGrid.innerHTML = "";
    }


    if (courseCount) {
        courseCount.textContent =
            "0 Courses";
    }


    if (emptyState) {

        emptyState.classList.remove(
            "hidden"
        );


        const paragraph =
            emptyState.querySelector("p");


        if (paragraph) {
            paragraph.textContent =
                message;
        }

    }

}


/* =========================================
   SEARCH EVENT
   ========================================= */

if (courseSearch) {

    courseSearch.addEventListener(
        "input",
        applyFilters
    );

}


/* =========================================
   LEVEL FILTER
   ========================================= */

if (levelFilter) {

    levelFilter.addEventListener(
        "change",
        applyFilters
    );

}


/* =========================================
   TYPE FILTER
   ========================================= */

if (typeFilter) {

    typeFilter.addEventListener(
        "change",
        applyFilters
    );

}


/* =========================================
   NOTIFICATION
   ========================================= */

if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        () => {

            alert(
                "🔔 अभी कोई नई notification नहीं है।"
            );

        }
    );

}


/* =========================================
   HTML SECURITY
   ========================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================
   START
   ========================================= */

loadCourses();