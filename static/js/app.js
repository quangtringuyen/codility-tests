// General application JavaScript
console.log('Codility Training Tracker initialized');

// ============ DARK MODE TOGGLE ============
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-toggle-icon');
const themeText = document.querySelector('.theme-toggle-text');

// Load saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
    themeText.textContent = 'Light';
}

// Toggle theme
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');

        // Update icon and text
        themeIcon.textContent = isDark ? '☀️' : '🌙';
        themeText.textContent = isDark ? 'Light' : 'Dark';

        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// ============ READING PROGRESS BAR ============
const progressBar = document.getElementById('readingProgress');

if (progressBar) {
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;

        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

// ============ COPY CODE BUTTON ============
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('.lesson-content pre');

    codeBlocks.forEach((block) => {
        // Skip if button already exists
        if (block.querySelector('.copy-code-btn')) return;

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);

        // Create copy button
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code');

        button.addEventListener('click', async () => {
            const code = block.querySelector('code')?.textContent || block.textContent;

            try {
                await navigator.clipboard.writeText(code);
                button.textContent = 'Copied!';
                button.classList.add('copied');

                setTimeout(() => {
                    button.textContent = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                button.textContent = 'Failed';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }
        });

        wrapper.appendChild(button);
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', addCopyButtons);

// ============ SMOOTH SCROLLING ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============ AUTO-SAVE NOTES ============
let notesTimeout;
document.querySelectorAll('.notes-textarea').forEach(textarea => {
    textarea.addEventListener('input', function() {
        clearTimeout(notesTimeout);
        const saveBtn = document.querySelector(`button[data-week="${this.dataset.week}"][data-day="${this.dataset.day}"]`);
        if (saveBtn) {
            saveBtn.textContent = 'Saving...';
        }

        notesTimeout = setTimeout(() => {
            if (saveBtn) {
                saveBtn.click();
            }
        }, 2000);
    });
});

// ============ LESSON COMPLETION TRACKING ============
function initLessonCompletion() {
    const lessonCheckbox = document.getElementById('lessonComplete');

    if (lessonCheckbox) {
        const lessonFile = lessonCheckbox.dataset.lesson;

        // Load saved state
        const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
        if (completedLessons.includes(lessonFile)) {
            lessonCheckbox.checked = true;
        }

        // Save on change
        lessonCheckbox.addEventListener('change', function() {
            let completed = JSON.parse(localStorage.getItem('completedLessons') || '[]');

            if (this.checked) {
                if (!completed.includes(lessonFile)) {
                    completed.push(lessonFile);
                }
            } else {
                completed = completed.filter(l => l !== lessonFile);
            }

            localStorage.setItem('completedLessons', JSON.stringify(completed));

            // Show feedback
            showNotification('Lesson marked as ' + (this.checked ? 'complete' : 'incomplete'));
        });
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', initLessonCompletion);

// ============ LESSON STATUS BADGES ============
function updateLessonBadges() {
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');

    // Add status badges to lesson cards
    document.querySelectorAll('.card').forEach(card => {
        const link = card.querySelector('a[href*="/lessons/"]');
        if (link) {
            const href = link.getAttribute('href');
            const lessonFile = href.split('/').pop();

            if (completedLessons.includes(lessonFile)) {
                const title = card.querySelector('.card-title');
                if (title && !title.querySelector('.lesson-status')) {
                    const badge = document.createElement('span');
                    badge.className = 'lesson-status completed';
                    badge.innerHTML = '✓ Completed';
                    title.appendChild(badge);
                }
            }
        }
    });
}

// Run on lessons page
if (window.location.pathname.includes('/lessons')) {
    document.addEventListener('DOMContentLoaded', updateLessonBadges);
}

// ============ NOTIFICATION SYSTEM ============
function showNotification(message, duration = 3000) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--success);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Add animation styles
if (!document.querySelector('#notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============ TABLE OF CONTENTS AUTO-HIGHLIGHT ============
function initTOC() {
    const tocLinks = document.querySelectorAll('.toc-wrapper a');
    if (tocLinks.length === 0) return;

    const headings = Array.from(document.querySelectorAll('.lesson-content h2, .lesson-content h3'))
        .map(h => ({
            element: h,
            id: h.id,
            top: h.offsetTop
        }));

    function highlightCurrentSection() {
        const scrollPos = window.scrollY + 100;

        let current = headings[0];
        for (const heading of headings) {
            if (scrollPos >= heading.top) {
                current = heading;
            }
        }

        tocLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${current.id}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightCurrentSection);
    highlightCurrentSection();
}

document.addEventListener('DOMContentLoaded', initTOC);

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', (e) => {
    // Toggle dark mode: Ctrl/Cmd + Shift + D
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        if (themeToggle) themeToggle.click();
    }

    // Navigate lessons: Alt + Left/Right
    if (e.altKey) {
        if (e.key === 'ArrowLeft') {
            const prevLink = document.querySelector('.nav-lesson.prev');
            if (prevLink) {
                e.preventDefault();
                prevLink.click();
            }
        } else if (e.key === 'ArrowRight') {
            const nextLink = document.querySelector('.nav-lesson.next');
            if (nextLink) {
                e.preventDefault();
                nextLink.click();
            }
        }
    }
});

console.log('All features initialized ✓');
