"use strict";

/* =========================================
   GyanAstra - Subject Page
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
   URL PARAMETERS
   Example:
   subject.html?course=upsc-foundation&subject=upsc-polity
   ========================================= */

const params =
    new URLSearchParams(window.location.search);

const courseId =
    params.get("course");

const subjectId =
    params.get("subject");


/* =========================================
   ELEMENTS
   ========================================= */

const courseName =
    document.getElementById("courseName");

const subjectTitle =
    document.getElementById("subjectTitle");

const subjectDescription =
    document.getElementById("subjectDescription");

const subjectIcon =
    document.getElementById("subjectIcon");

const lessonCount =
    document.getElementById("lessonCount");

const videoCount =
    document.getElementById("videoCount");

const subjectProgress =
    document.getElementById("subjectProgress");

const chapterCount =
    document.getElementById("chapterCount");

const chaptersContainer =
    document.getElementById("chaptersContainer");

const loading =
    document.getElementById("loading");

const emptyState =
    document.getElementById("emptyState");

const emptyMessage =
    document.getElementById("emptyMessage");

const backButton =
    document.getElementById("backButton");

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
   BACK BUTTON
   ========================================= */

if (backButton) {

    if (courseId) {

        backButton.href =
            "./course-details.html?id=" +
            encodeURIComponent(courseId);

    } else {

        backButton.href =
            "./courses.html";

    }

}


/* =========================================
   START
   ========================================= */

loadSubject();


/* =========================================
   LOAD DATA
   ========================================= */

async function loadSubject() {

    showLoading();


    if (!courseId || !subjectId) {

        showError(
            "Course या Subject ID नहीं मिली।"
        );

        return;

    }


    try {

        const response =
            await fetch("./data/courses.json");


        if (!response.ok) {

            throw new Error(
                "courses.json load नहीं हुआ।"
            );

        }


        const courses =
            await response.json();


        /* FIND COURSE */

        const course =
            courses.find(
                item =>
                    String(item.id) ===
                    String(courseId)
            );


        if (!course) {

            showError(
                "Course नहीं मिला।"
            );

            return;

        }


        /* FIND SUBJECT */

        const subject =
            (course.subjects || [])
                .find(
                    item =>
                        String(item.id) ===
                        String(subjectId)
                );


        if (!subject) {

            showError(
                "Subject नहीं मिला।"
            );

            return;

        }


        displaySubject(
            course,
            subject
        );


        hideLoading();


    } catch (error) {

        console.error(
            "Subject Error:",
            error
        );


        showError(
            "Subject data load नहीं हो पाया। कृपया Live Server से website चलाएँ।"
        );

    }

}


/* =========================================
   DISPLAY SUBJECT
   ========================================= */

function displaySubject(
    course,
    subject
) {

    /* COURSE NAME */

    if (courseName) {

        courseName.textContent =
            course.title ||
            "GyanAstra Course";

    }


    /* SUBJECT TITLE */

    if (subjectTitle) {

        subjectTitle.textContent =
            subject.title ||
            subject.name ||
            "Subject";

    }


    /* DESCRIPTION */

    if (subjectDescription) {

        subjectDescription.textContent =
            subject.description ||
            "Subject content available.";

    }


    /* ICON */

    if (subjectIcon) {

        subjectIcon.textContent =
            subject.icon ||
            "📚";

    }


    /* LESSON COUNT */

    const chapters =
        Array.isArray(subject.chapters)
            ? subject.chapters
            : [];


    const lessons =
        getAllLessons(chapters);


    if (lessonCount) {

        lessonCount.textContent =
            "📚 " +
            lessons.length +
            " Lessons";

    }


    /* VIDEO COUNT */

    const videos =
        lessons.filter(
            lesson =>
                lesson.type === "video" ||
                lesson.video
        );


    if (videoCount) {

        videoCount.textContent =
            "🎥 " +
            videos.length +
            " Videos";

    }


    /* PROGRESS */

    const progress =
        getSubjectProgress(
            subject,
            lessons
        );


    if (subjectProgress) {

        subjectProgress.textContent =
            "📈 " +
            progress +
            "% Complete";

    }


    /* CHAPTER COUNT */

    if (chapterCount) {

        chapterCount.textContent =
            chapters.length +
            (
                chapters.length === 1
                    ? " Chapter"
                    : " Chapters"
            );

    }


    /* PAGE TITLE */

    document.title =
        `${subject.title || "Subject"} | GyanAstra`;


    /* RENDER */

    renderChapters(
        chapters
    );

}


/* =========================================
   GET ALL LESSONS
   ========================================= */

function getAllLessons(chapters) {

    const lessons = [];


    chapters.forEach(
        chapter => {

            if (
                Array.isArray(
                    chapter.lessons
                )
            ) {

                lessons.push(
                    ...chapter.lessons
                );

            }

        }
    );


    return lessons;

}


/* =========================================
   SUBJECT PROGRESS
   ========================================= */

function getSubjectProgress(
    subject,
    lessons
) {

    /*
       अगर JSON में progress दिया है
       तो वही इस्तेमाल करेंगे।
    */

    if (
        typeof subject.progress ===
        "number"
    ) {

        return Math.min(
            100,
            Math.max(
                0,
                subject.progress
            )
        );

    }


    /*
       Future में completed lessons
       के आधार पर भी progress निकाली जा सकती है।
    */

    if (!lessons.length) {
        return 0;
    }


    const completed =
        lessons.filter(
            lesson =>
                lesson.completed === true
        ).length;


    return Math.round(
        (completed / lessons.length) *
        100
    );

}


/* =========================================
   RENDER CHAPTERS
   ========================================= */

function renderChapters(chapters) {

    if (!chaptersContainer) {
        return;
    }


    chaptersContainer.innerHTML = "";


    if (!chapters.length) {

        chaptersContainer.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    📚
                </div>

                <h3>
                    अभी कोई Chapter उपलब्ध नहीं है
                </h3>

                <p>
                    इस subject में chapters बाद में add किए जाएँगे।
                </p>

            </div>

        `;

        return;

    }


    chapters.forEach(
        (chapter, index) => {

            const chapterElement =
                document.createElement(
                    "article"
                );


            chapterElement.className =
                "chapter";


            const lessons =
                Array.isArray(
                    chapter.lessons
                )
                    ? chapter.lessons
                    : [];


            chapterElement.innerHTML = `

                <div
                    class="chapter-header"
                    role="button"
                    tabindex="0"
                >

                    <div class="chapter-left">

                        <div class="chapter-number">

                            ${String(
                                index + 1
                            ).padStart(2, "0")}

                        </div>


                        <div>

                            <h3 class="chapter-title">

                                ${escapeHTML(
                                    chapter.title ||
                                    "Chapter " +
                                    (index + 1)
                                )}

                            </h3>


                            <div class="chapter-lesson-count">

                                ${lessons.length}

                                ${
                                    lessons.length === 1
                                        ? "Lesson"
                                        : "Lessons"
                                }

                            </div>

                        </div>

                    </div>


                    <div class="chapter-arrow">
                        ▼
                    </div>

                </div>


                <div class="lesson-list">

                    ${renderLessons(
                        lessons
                    )}

                </div>

            `;


            const header =
                chapterElement.querySelector(
                    ".chapter-header"
                );


            /* OPEN/CLOSE */

            header.addEventListener(
                "click",
                () => {

                    chapterElement.classList.toggle(
                        "open"
                    );

                }
            );


            header.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter" ||
                        event.key ===
                        " "
                    ) {

                        event.preventDefault();

                        chapterElement.classList.toggle(
                            "open"
                        );

                    }

                }
            );


            /* OPEN FIRST CHAPTER */

            if (index === 0) {

                chapterElement.classList.add(
                    "open"
                );

            }


            chaptersContainer.appendChild(
                chapterElement
            );

        }
    );

}


/* =========================================
   RENDER LESSONS
   ========================================= */

function renderLessons(lessons) {

    if (!lessons.length) {

        return `

            <div class="lesson-item">

                <div class="lesson-main">

                    <div class="lesson-icon">
                        📚
                    </div>

                    <div class="lesson-info">

                        <p class="lesson-title">
                            इस chapter में अभी lessons नहीं हैं।
                        </p>

                    </div>

                </div>

            </div>

        `;

    }


    return lessons
        .map(
            (lesson, index) => {

                const isLocked =
                    lesson.locked === true;


                const icon =
                    getLessonIcon(
                        lesson
                    );


                const title =
                    lesson.title ||
                    "Lesson " +
                    (index + 1);


                const duration =
                    lesson.duration ||
                    "Duration unavailable";


                return `

                    <div
                        class="lesson-item ${
                            isLocked
                                ? "locked"
                                : ""
                        }"
                    >

                        <div class="lesson-main">

                            <div class="lesson-icon">

                                ${icon}

                            </div>


                            <div class="lesson-info">

                                <p class="lesson-title">

                                    ${escapeHTML(
                                        title
                                    )}

                                </p>


                                <span class="lesson-duration">

                                    ${escapeHTML(
                                        duration
                                    )}

                                </span>

                            </div>

                        </div>


                        <div class="lesson-actions">

                            ${
                                lesson.pdf
                                    ? `
                                        <button
                                            class="lesson-btn"
                                            type="button"
                                            data-action="pdf"
                                            data-url="${escapeAttribute(
                                                lesson.pdf
                                            )}"
                                        >
                                            📄 PDF
                                        </button>
                                      `
                                    : ""
                            }


                            ${
                                lesson.notes
                                    ? `
                                        <button
                                            class="lesson-btn"
                                            type="button"
                                            data-action="notes"
                                            data-url="${escapeAttribute(
                                                lesson.notes
                                            )}"
                                        >
                                            📝 Notes
                                        </button>
                                      `
                                    : ""
                            }


                            <button
                                class="lesson-btn primary"
                                type="button"
                                data-action="open"
                                data-id="${escapeAttribute(
                                    lesson.id || ""
                                )}"
                                ${
                                    isLocked
                                        ? "disabled"
                                        : ""
                                }
                            >

                                ${
                                    isLocked
                                        ? "🔒 Locked"
                                        : "▶ Start"
                                }

                            </button>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


/* =========================================
   LESSON ICON
   ========================================= */

function getLessonIcon(lesson) {

    if (lesson.locked) {
        return "🔒";
    }


    if (
        lesson.type === "pdf"
    ) {
        return "📄";
    }


    if (
        lesson.type === "notes"
    ) {
        return "📝";
    }


    if (
        lesson.type === "audio"
    ) {
        return "🎧";
    }


    if (
        lesson.type === "quiz"
    ) {
        return "🧠";
    }


    return "🎥";

}


/* =========================================
   LESSON ACTION HANDLER
   ========================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".lesson-btn"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;


        const lessonId =
            button.dataset.id;


        const url =
            button.dataset.url;


        /* OPEN LESSON */

        if (action === "open") {

            if (!lessonId) {

                alert(
                    "Lesson ID उपलब्ध नहीं है।"
                );

                return;

            }


            window.location.href =
                "./lesson.html?course=" +
                encodeURIComponent(
                    courseId
                ) +
                "&subject=" +
                encodeURIComponent(
                    subjectId
                ) +
                "&lesson=" +
                encodeURIComponent(
                    lessonId
                );

        }


        /* PDF */

        if (action === "pdf") {

            if (url) {

                window.open(
                    url,
                    "_blank"
                );

            }

        }


        /* NOTES */

        if (action === "notes") {

            if (url) {

                window.open(
                    url,
                    "_blank"
                );

            }

        }

    }
);


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
   LOADING
   ========================================= */

function showLoading() {

    if (loading) {

        loading.classList.remove(
            "hidden"
        );

    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }

}


function hideLoading() {

    if (loading) {

        loading.classList.add(
            "hidden"
        );

    }

}


/* =========================================
   ERROR
   ========================================= */

function showError(message) {

    hideLoading();


    if (emptyState) {

        emptyState.classList.remove(
            "hidden"
        );

    }


    if (emptyMessage) {

        emptyMessage.textContent =
            message;

    }

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


function escapeAttribute(value) {

    return escapeHTML(
        value
    );

}