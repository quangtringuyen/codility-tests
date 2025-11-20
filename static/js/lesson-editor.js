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
const uploadImageBtn = document.getElementById('uploadImageBtn');
const insertImageLinkBtn = document.getElementById('insertImageLinkBtn');
const imageFileInput = document.getElementById('imageFileInput');

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

        // Enable sticky toolbar scroll listener
        enableStickyToolbar();
    } else {
        // Exit edit mode
        lessonContentView.style.display = 'block';
        lessonEditorWrapper.style.display = 'none';
        toggleEditBtn.classList.remove('active');
        toggleEditBtn.querySelector('.edit-text').textContent = 'Edit';

        // Disable sticky toolbar scroll listener
        disableStickyToolbar();
    }
}

// Sticky toolbar on scroll
let scrollListener = null;

function enableStickyToolbar() {
    const editorToolbar = document.querySelector('.editor-toolbar');
    if (!editorToolbar) return;

    scrollListener = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const toolbarRect = editorToolbar.getBoundingClientRect();

        // Add 'scrolled' class when toolbar is stuck to top
        if (toolbarRect.top <= 0) {
            editorToolbar.classList.add('scrolled');
        } else {
            editorToolbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', scrollListener);
}

function disableStickyToolbar() {
    if (scrollListener) {
        window.removeEventListener('scroll', scrollListener);
        scrollListener = null;
    }

    const editorToolbar = document.querySelector('.editor-toolbar');
    if (editorToolbar) {
        editorToolbar.classList.remove('scrolled');
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

// ===== IMAGE HANDLING FUNCTIONALITY =====

// Helper function to insert text at cursor position
function insertTextAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    textarea.value = value.substring(0, start) + text + value.substring(end);

    // Set cursor position after inserted text
    const newCursorPos = start + text.length;
    textarea.selectionStart = textarea.selectionEnd = newCursorPos;

    // Trigger input event to resize textarea
    textarea.dispatchEvent(new Event('input'));
    textarea.focus();
}

// Upload Image Button - Opens file picker
uploadImageBtn?.addEventListener('click', () => {
    imageFileInput.click();
});

// Handle file selection
imageFileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    await uploadImageFile(file);

    // Reset input so same file can be uploaded again
    imageFileInput.value = '';
});

// Insert Image Link Button - Prompts for URL
insertImageLinkBtn?.addEventListener('click', () => {
    const url = prompt('Enter image URL:');
    if (url) {
        const altText = prompt('Enter alt text (optional):') || 'image';
        const markdown = `![${altText}](${url})`;
        insertTextAtCursor(lessonEditor, markdown);
    }
});

// Paste Image Support - Handle Ctrl+V with images
lessonEditor?.addEventListener('paste', async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    // Look for image in clipboard
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            e.preventDefault();

            const blob = items[i].getAsFile();
            await uploadImageFile(blob);

            break;
        }
    }
});

// Drag and Drop Support
lessonEditor?.addEventListener('dragover', (e) => {
    e.preventDefault();
    lessonEditor.classList.add('drag-over');
});

lessonEditor?.addEventListener('dragleave', (e) => {
    lessonEditor.classList.remove('drag-over');
});

lessonEditor?.addEventListener('drop', async (e) => {
    e.preventDefault();
    lessonEditor.classList.remove('drag-over');

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    // Upload first file if it's an image
    const file = files[0];
    if (file.type.indexOf('image') !== -1) {
        await uploadImageFile(file);
    }
});

// Upload image file to server
async function uploadImageFile(file) {
    if (!file) return;

    // Show uploading status
    const originalStatus = saveStatus.textContent;
    saveStatus.textContent = '📤 Uploading image...';
    saveStatus.className = 'save-status saving';

    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload_image', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Insert markdown image syntax
            const filename = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
            const altText = filename || 'image';
            const markdown = `![${altText}](${result.url})`;
            insertTextAtCursor(lessonEditor, markdown);

            // Success feedback
            saveStatus.textContent = '✓ Image uploaded!';
            saveStatus.className = 'save-status success';

            setTimeout(() => {
                saveStatus.textContent = originalStatus;
                saveStatus.className = 'save-status';
            }, 2000);
        } else {
            // Error feedback
            saveStatus.textContent = '✕ Upload failed: ' + (result.error || 'Unknown error');
            saveStatus.className = 'save-status error';

            setTimeout(() => {
                saveStatus.textContent = originalStatus;
                saveStatus.className = 'save-status';
            }, 3000);
        }
    } catch (err) {
        saveStatus.textContent = '✕ Upload error: ' + err.message;
        saveStatus.className = 'save-status error';

        setTimeout(() => {
            saveStatus.textContent = originalStatus;
            saveStatus.className = 'save-status';
        }, 3000);
    }
}

console.log('Lesson Editor initialized ✓');
