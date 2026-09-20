"use strict";

/* =========================================
   GyanAstra - Course Details (Firestore Connected)
   ========================================= */

/* =========================================
   LOGIN CHECK
   ========================================= */
const isLoggedIn = localStorage.getItem("isGyanAstraLoggedIn");
if (isLoggedIn !== "true") {
    window.location.href = "./login.html";
}

/* =========================================
   GET COURSE ID FROM URL
   ========================================= */
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get("id");

/* =========================================
   ELEMENTS
   ========================================= */
const courseTitle = document.getElementById("courseTitle");
const courseDescription = document.getElementById("courseDescription");
const courseCategory = document.getElementById("courseCategory");
const courseLevel = document.getElementById("courseLevel");
const courseLessons = document.getElementById("courseLessons");
const courseDuration = document.getElementById("courseDuration");
const courseType = document.getElementById("courseType");
const courseProgress = document.getElementById("courseProgress");
const progressFill = document.getElementById("progressFill");
const subjectsGrid = document.getElementById("subjectsGrid");
const subjectCount = document.getElementById("subjectCount");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const userAvatar = document.getElementById("userAvatar");
const notificationBtn = document.getElementById("notificationBtn");

/* =========================================
   USER AVATAR
   ========================================= */
const studentName = localStorage.getItem("loggedInStudent") || "Student";
if (userAvatar) {
    userAvatar.textContent = studentName.charAt(0).toUpperCase();
}

/* =========================================
   START
   ========================================= */
loadCourse();

/* =========================================
   LOAD COURSE FROM FIRESTORE
   ========================================= */
async function loadCourse() {
    showLoading();

    if (!courseId) {
        showError("Course ID नहीं मिला। कृपया Courses page से course खोलें।");
        return;
    }

    try {
        // 1. Fetch Course details from Firestore
        const courseDoc = await db.collection("courses").doc(courseId).get();

        if (!courseDoc.exists) {
            showError("यह course उपलब्ध नहीं है या हटा दिया गया है।");
            return;
        }

        const courseData = { id: courseDoc.id, ...courseDoc.data() };

        // 2. Fetch Subjects linked to this course
        let subjects = [];
        try {
            const subjectsSnapshot = await db.collection("subjects")
                .where("courseId", "==", courseId)
                .get();

            subjectsSnapshot.forEach((doc) => {
                subjects.push({ id: doc.id, ...doc.data() });
            });
        } catch (subErr) {
            console.warn("Subjects fetch warning:", subErr);
        }

        // Display course details
        displayCourse(courseData, subjects);
        hideLoading();

    } catch (error) {
        console.error("Firestore Course Details Error:", error);
        showError("Course information load नहीं हो पाई। Kripya refresh karein.");
    }
}

/* =========================================
   DISPLAY COURSE
   ========================================= */
function displayCourse(course, subjects) {
    if (courseTitle) {
        courseTitle.textContent = course.title || "GyanAstra Course";
    }

    if (courseDescription) {
        courseDescription.textContent = course.description || "Course description उपलब्ध नहीं है।";
    }

    if (courseCategory) {
        courseCategory.textContent = course.category || "COURSE";
    }

    if (courseLevel) {
        courseLevel.textContent = "🎓 " + (course.level || "Beginner");
    }

    if (courseLessons) {
        courseLessons.textContent = "📚 " + (course.lessons || subjects.length || 0) + " Lessons";
    }

    if (courseDuration) {
        courseDuration.textContent = "⏱️ " + (course.duration || "Self-Paced");
    }

    if (courseType) {
        const type = String(course.type || "free").toLowerCase();
        courseType.textContent = type === "premium" ? "💎 Premium" : "🆓 Free";
    }

    const progress = Math.min(100, Math.max(0, Number(course.progress || 0)));

    if (courseProgress) {
        courseProgress.textContent = progress + "%";
    }

    if (progressFill) {
        progressFill.style.width = progress + "%";
    }

    document.title = `${course.title || "Course"} | GyanAstra`;

    renderSubjects(subjects);
}

/* =========================================
   RENDER SUBJECTS
   ========================================= */
function renderSubjects(subjects) {
    if (!subjectsGrid) return;

    subjectsGrid.innerHTML = "";

    if (subjectCount) {
        subjectCount.textContent = `${subjects.length} ${subjects.length === 1 ? "Subject" : "Subjects"}`;
    }

    if (!subjects.length) {
        showSubjectMessage();
        return;
    }

    subjects.forEach((subject, index) => {
        const card = document.createElement("article");
        card.className = "subject-card";

        const progress = Math.min(100, Math.max(0, Number(subject.progress || 0)));

        card.innerHTML = `
            <div class="subject-top">
                <div class="subject-icon">
                    ${escapeHTML(subject.icon || "📚")}
                </div>
                <span class="subject-number">
                    SUBJECT ${String(index + 1).padStart(2, "0")}
                </span>
            </div>

            <h3>
                ${escapeHTML(subject.title || subject.name || "Subject")}
            </h3>

            <p>
                ${escapeHTML(subject.description || "Subject content available.")}
            </p>

            <div class="subject-info">
                <span>📚 ${subject.lessons || 0} Lessons</span>
                <span>🎥 ${subject.videos || 0} Videos</span>
            </div>

            <div class="subject-progress">
                <div class="subject-progress-bar">
                    <div class="subject-progress-fill" style="width:${progress}%"></div>
                </div>
            </div>

            <button class="subject-btn" type="button">
                Open Subject →
            </button>
        `;

        const button = card.querySelector(".subject-btn");
        button.addEventListener("click", () => {
            openSubject(subject.id);
        });

        subjectsGrid.appendChild(card);
    });
}

/* =========================================
   OPEN SUBJECT
   ========================================= */
function openSubject(subjectId) {
    if (!subjectId) {
        alert("इस subject की ID अभी उपलब्ध नहीं है।");
        return;
    }

    window.location.href = "./subject.html?course=" + encodeURIComponent(courseId) + "&subject=" + encodeURIComponent(subjectId);
}

/* =========================================
   NO SUBJECT MESSAGE
   ========================================= */
function showSubjectMessage() {
    if (!subjectsGrid) return;

    subjectsGrid.innerHTML = `
        <div class="course-error">
            <div class="error-icon">📚</div>
            <h3>Subjects अभी add नहीं किए गए हैं</h3>
            <p>इस course के subjects admin panel se jodein.</p>
        </div>
    `;
}

/* =========================================
   LOADING & HELPERS
   ========================================= */
function showLoading() {
    if (loading) loading.classList.remove("hidden");
    if (emptyState) emptyState.classList.add("hidden");
}

function hideLoading() {
    if (loading) loading.classList.add("hidden");
}

function showError(message) {
    hideLoading();
    if (emptyState) {
        emptyState.classList.remove("hidden");
        const paragraph = emptyState.querySelector("p");
        if (paragraph) paragraph.textContent = message;
    }
}

if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
        alert("🔔 अभी कोई नई notification नहीं है।");
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