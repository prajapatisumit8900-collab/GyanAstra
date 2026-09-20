"use strict";

/* =========================================
   LOGIN CHECK
   ========================================= */
const isLoggedIn = localStorage.getItem("isGyanAstraLoggedIn");
if (isLoggedIn !== "true") {
    window.location.href = "./login.html";
}

/* =========================================
   FIREBASE CONFIG & INITIALIZATION
   ========================================= */
const firebaseConfig = {
  apiKey: "AIzaSyDqcL86o1UwOGn9wcLQqvHdF0lzJQD1NG8",
  authDomain: "gyanastra-30557.firebaseapp.com",
  projectId: "gyanastra-30557",
  storageBucket: "gyanastra-30557.firebasestorage.app",
  messagingSenderId: "691234854780",
  appId: "1:691234854780:web:c1213c6b4e99ee4815f6f9",
  measurementId: "G-96793NR52M"
};

// Initialize Firebase & Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* =========================================
   ELEMENTS
   ========================================= */
const courseGrid = document.getElementById("courseGrid");
const courseSearch = document.getElementById("courseSearch");
const levelFilter = document.getElementById("levelFilter");
const typeFilter = document.getElementById("typeFilter");
const courseCount = document.getElementById("courseCount");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const userAvatar = document.getElementById("userAvatar");
const notificationBtn = document.getElementById("notificationBtn");

const studentName = localStorage.getItem("loggedInStudent") || "Student";
if (userAvatar) {
    userAvatar.textContent = studentName.charAt(0).toUpperCase();
}

let allCourses = [];

/* =========================================
   REAL-TIME DATA LOAD FROM FIRESTORE
   ========================================= */
function loadCoursesRealtime() {
    showLoading();

    // Firestore se realtime data sunna (Automatic sync)
    db.collection("courses").onSnapshot((snapshot) => {
        allCourses = [];
        snapshot.forEach((doc) => {
            allCourses.push({ id: doc.id, ...doc.data() });
        });

        hideLoading();
        applyFilters();
    }, (error) => {
        console.error("Firestore Error:", error);
        hideLoading();
        showEmpty("Courses load nahi ho sake. Kripya dobara check karein.");
    });
}

function showLoading() {
    if (loading) loading.classList.remove("hidden");
    if (courseGrid) courseGrid.innerHTML = "";
    if (emptyState) emptyState.classList.add("hidden");
}

function hideLoading() {
    if (loading) loading.classList.add("hidden");
}

function applyFilters() {
    const searchText = courseSearch ? courseSearch.value.trim().toLowerCase() : "";
    const selectedLevel = levelFilter ? levelFilter.value : "all";
    const selectedType = typeFilter ? typeFilter.value : "all";

    const filteredCourses = allCourses.filter(course => {
        const title = String(course.title || "").toLowerCase();
        const description = String(course.description || "").toLowerCase();
        const category = String(course.categoryName || course.category || "").toLowerCase();

        const matchesSearch = !searchText || title.includes(searchText) || description.includes(searchText) || category.includes(searchText);
        const courseLevel = String(course.level || "").toLowerCase();
        const matchesLevel = selectedLevel === "all" || courseLevel === selectedLevel;
        const courseType = String(course.type || "free").toLowerCase();
        const matchesType = selectedType === "all" || courseType === selectedType;

        return matchesSearch && matchesLevel && matchesType;
    });

    renderCourses(filteredCourses);
}

function renderCourses(courses) {
    if (!courseGrid) return;
    courseGrid.innerHTML = "";

    if (courseCount) {
        courseCount.textContent = `${courses.length} ${courses.length === 1 ? "Course" : "Courses"}`;
    }

    if (!courses.length) {
        showEmpty("Search ya filter badal kar fir koshish karein.");
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    courses.forEach(course => {
        const card = document.createElement("article");
        card.className = "course-card";
        const progress = Number(course.progress || 0);
        const courseType = String(course.type || "free").toLowerCase();
        const isPremium = courseType === "premium";

        card.innerHTML = `
            <div class="course-card-image">
                <div class="course-placeholder">📚</div>
                <span class="course-badge">${isPremium ? "PREMIUM" : "FREE"}</span>
            </div>
            <div class="course-card-content">
                <span class="course-category">${escapeHTML(course.categoryName || course.category || "Course")}</span>
                <h3>${escapeHTML(course.title)}</h3>
                <p>${escapeHTML(course.description)}</p>
                <div class="course-info">
                    <span>🎓 ${escapeHTML(course.level || "Beginner")}</span>
                    <span>📚 ${course.lessons || 0} Lessons</span>
                    <span>⏱️ ${escapeHTML(course.duration || "N/A")}</span>
                </div>
                <div class="progress-section">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <small>${progress}% Complete</small>
                </div>
                <button class="view-course-btn" data-course-id="${escapeHTML(course.id)}">
                    ${progress > 0 ? "Continue Learning →" : "View Course →"}
                </button>
            </div>
        `;

        const button = card.querySelector(".view-course-btn");
        button.addEventListener("click", () => openCourse(course.id));
        courseGrid.appendChild(card);
    });
}

function openCourse(courseId) {
    if (!courseId) return;
    window.location.href = "./course-details.html?id=" + encodeURIComponent(courseId);
}

function showEmpty(message) {
    if (courseGrid) courseGrid.innerHTML = "";
    if (courseCount) courseCount.textContent = "0 Courses";
    if (emptyState) {
        emptyState.classList.remove("hidden");
        const paragraph = emptyState.querySelector("p");
        if (paragraph) paragraph.textContent = message;
    }
}

if (courseSearch) courseSearch.addEventListener("input", applyFilters);
if (levelFilter) levelFilter.addEventListener("change", applyFilters);
if (typeFilter) typeFilter.addEventListener("change", applyFilters);

if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
        alert("🔔 Abhi koi nayi notification nahi hai.");
    });
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// Data fetching shuru karein
loadCoursesRealtime();