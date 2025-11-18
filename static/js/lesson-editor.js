// Lesson Editor
let isEditMode = false;
const lessonFile = document.querySelector('#lessonComplete')?.dataset.lesson;

// Get DOM elements
const toggleEditBtn = document.getElementById('toggleEditBtn');
const lessonContentView = document.getElementById('lessonContentView');
const lessonEditorWrapper = document.getElementById('lessonEditorWrapper');
const lessonEditor = document.getElementById('lessonEditor');
const saveBtn = document.getElementById('saveLesson');
const cancelBtn = document.getElementById('cancelEdit');
const saveStatus = document.getElementById('saveStatus');

// Toggle Edit Mode
toggleEditBtn?.addEventListener('click', toggleEditMode);

function toggleEditMode() {
    isEditMode = !isEditMode;

    if (isEditMode) {
        // Enter edit mode
        lessonContentView.style.display = 'none';
        lessonEditorWrapper.style.display = 'block';
        toggleEditBtn.classList.add('active');
        toggleEditBtn.querySelector('.edit-text').textContent = 'View';

        // Auto-resize textarea
        autoResizeTextarea();
    } else {
        // Exit edit mode
        lessonContentView.style.display = 'block';
        lessonEditorWrapper.style.display = 'none';
        toggleEditBtn.classList.remove('active');
        toggleEditBtn.querySelector('.edit-text').textContent = 'Edit';
    }
}

// Auto-resize textarea
function autoResizeTextarea() {
    if (lessonEditor) {
        lessonEditor.style.height = 'auto';
        lessonEditor.style.height = Math.max(600, lessonEditor.scrollHeight) + 'px';

        lessonEditor.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.max(600, this.scrollHeight) + 'px';
        });
    }
}

// Save Lesson
saveBtn?.addEventListener('click', async () => {
    const content = lessonEditor.value;

    // Show saving status
    saveBtn.disabled = true;
    saveBtn.textContent = '💾 Saving...';
    saveStatus.textContent = 'Saving...';
    saveStatus.className = 'save-status saving';

    try {
        const response = await fetch('/api/save_lesson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lesson_file: lessonFile,
                content: content
            })
        });

        const result = await response.json();

        if (result.success) {
            // Success feedback
            saveStatus.textContent = '✓ Saved successfully!';
            saveStatus.className = 'save-status success';

            // Reload page after 1 second to show updated content
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            // Error feedback
            saveStatus.textContent = '✕ Error: ' + (result.error || 'Failed to save');
            saveStatus.className = 'save-status error';
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Save';
        }
    } catch (err) {
        saveStatus.textContent = '✕ Error: ' + err.message;
        saveStatus.className = 'save-status error';
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save';
    }
});

// Cancel Edit
cancelBtn?.addEventListener('click', () => {
    if (confirm('Discard changes?')) {
        // Reload original content
        lessonEditor.value = lessonEditor.defaultValue;
        toggleEditMode();
    }
});

// Keyboard shortcuts for editor
lessonEditor?.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveBtn.click();
    }

    // Tab key inserts spaces instead of changing focus
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const value = this.value;

        // Insert 4 spaces
        this.value = value.substring(0, start) + '    ' + value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
    }
});

console.log('Lesson Editor initialized ✓');
