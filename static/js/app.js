// General application JavaScript
console.log('Codility Training Tracker initialized');

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Auto-save notes after typing stops
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
