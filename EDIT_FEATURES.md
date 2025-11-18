# ✏️ Edit & Save Features Guide

This document describes the edit and save functionality added to the Codility Training Tracker.

## 📝 Features Overview

### **Lesson Editing**
- Edit lesson content directly from the web interface
- Real-time markdown editing with syntax highlighting
- Auto-save with visual feedback
- Keyboard shortcuts for efficient editing

## 🎯 How to Use

### **Editing Lessons**

1. **Open any lesson** from the Lessons page
2. **Click the ✏️ Edit button** (floating button, bottom-right, next to Code button)
3. **Edit the markdown content** in the textarea editor
4. **Save your changes**:
   - Click the "💾 Save" button, OR
   - Press `Ctrl/Cmd + S`
5. **Cancel editing** by clicking "✕ Cancel" (asks for confirmation)

### **Edit Mode Features**

#### **Visual Editor**
- Large textarea with monospace font
- Auto-resizing based on content
- Syntax highlighting for better readability
- Tab key inserts 4 spaces (doesn't change focus)

#### **Toolbar**
- **💾 Save** - Save changes and reload the page
- **✕ Cancel** - Discard changes and return to view mode
- **Status Indicator** - Shows save progress:
  - **Saving...** - Blue background
  - **✓ Saved successfully!** - Green background
  - **✕ Error** - Red background with error message

#### **Markdown Help**
Quick reference displayed below the editor:
- `#` for headings
- `**` for bold
- `*` for italic
- ` ``` ` for code blocks
- `-` for lists

## 🔧 Technical Details

### **New API Endpoints**

#### `POST /api/save_lesson`
Save edited lesson content

**Request Body:**
```json
{
  "lesson_file": "week1-foundations.md",
  "content": "# Updated content\n\nNew lesson text..."
}
```

**Response:**
```json
{
  "success": true
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

#### `GET /api/get_lesson_content`
Get raw markdown content for a lesson

**Query Parameters:**
- `lesson_file` - The lesson filename (e.g., "week1-foundations.md")

**Response:**
```json
{
  "success": true,
  "content": "# Week 1: Foundations\n\n..."
}
```

### **Security Features**

1. **Path Validation**
   - Prevents directory traversal attacks (`..` not allowed)
   - Only `.md` files can be edited
   - File must exist in lessons directory

2. **Input Sanitization**
   - Server-side validation of lesson file names
   - Error handling for file operations

### **Files Modified**

#### **Backend** - [app.py](app.py)
```python
# New routes added:
@app.route('/api/save_lesson', methods=['POST'])
@app.route('/api/get_lesson_content', methods=['GET'])

# Updated route:
@app.route('/lessons/<lesson_file>')  # Now passes markdown_content to template
```

#### **Frontend HTML** - [templates/lesson_view.html](templates/lesson_view.html)
- Added edit button (floating)
- Added editor wrapper with toolbar
- Added textarea for markdown editing
- Added help section
- Added lesson-editor.js script

#### **Frontend JavaScript** - [static/js/lesson-editor.js](static/js/lesson-editor.js) (NEW FILE)
- Toggle edit mode functionality
- Auto-resize textarea
- Save/cancel handlers
- Keyboard shortcuts (Ctrl/Cmd + S, Tab)
- Visual feedback for save operations

#### **Frontend CSS** - [static/css/style.css](static/css/style.css)
- Edit button styles (floating, bottom-right)
- Editor wrapper styles
- Toolbar styles
- Textarea styles with focus states
- Save status indicators
- Responsive mobile adjustments

## 🎨 UI/UX Design

### **Edit Button**
- **Position**: Fixed, bottom-right (next to Code button)
- **Desktop**: `right: 96px` (to the left of Code button)
- **Mobile**: Stacked vertically above Code button
- **Colors**: Orange-to-red gradient
- **Active State**: Green background
- **Hover Effect**: Scales to 1.1x with enhanced shadow

### **Editor Interface**
- **Layout**: Full-width within lesson container
- **Background**: Card background with border
- **Toolbar**: Horizontal layout with Save/Cancel buttons and status
- **Textarea**: Monospace font, auto-resizing, min-height 600px
- **Focus State**: Blue border with subtle shadow
- **Help Section**: Gray background with markdown tips

### **Visual Feedback**
- **Saving**: Blue indicator with "Saving..." text
- **Success**: Green indicator with "✓ Saved successfully!"
- **Error**: Red indicator with error message
- **Button States**: Disabled during save operation

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save lesson |
| `Tab` | Insert 4 spaces (in editor) |
| `Escape` | (Future: Exit edit mode) |

## 📱 Mobile Support

### **Responsive Behavior**
- Edit button moves to stack vertically on mobile
- Editor uses full width
- Toolbar buttons stack on very small screens
- Textarea remains usable with virtual keyboard

### **Touch Optimization**
- Large touch targets (56px buttons)
- Proper spacing for finger taps
- No hover effects on touch devices

## 🚀 Usage Examples

### **Example 1: Fix a Typo in Week 1 Lesson**

1. Navigate to Week 1 lesson
2. Click ✏️ Edit button
3. Find the typo in the markdown
4. Correct it
5. Press Ctrl/Cmd + S to save
6. Page reloads with updated content

### **Example 2: Add New Section to Cheat Sheet**

1. Open the Pattern Cheat Sheet
2. Click ✏️ Edit button
3. Scroll to end of content
4. Add new section:
   ```markdown
   ## New Pattern

   Description here...

   ```typescript
   // Code example
   ```
   ```
5. Click 💾 Save button
6. Confirm success message
7. View updated cheat sheet

### **Example 3: Update Code Example**

1. Open any lesson with code examples
2. Click ✏️ Edit button
3. Find the code block (enclosed in ` ``` `)
4. Update the code
5. Save with Ctrl/Cmd + S
6. Verify the updated code renders correctly

## 🔒 Best Practices

### **Before Editing**
- ✅ Make sure you understand markdown syntax
- ✅ Consider backing up the lesson file first
- ✅ Review existing content structure

### **During Editing**
- ✅ Use the markdown help guide
- ✅ Keep formatting consistent
- ✅ Test code examples in the playground
- ✅ Save frequently

### **After Editing**
- ✅ Review the rendered content
- ✅ Check all links and code blocks
- ✅ Verify formatting is correct
- ✅ Test on mobile if adding large content

## 🐛 Troubleshooting

### **Edit Button Not Showing**
- **Check**: Are you on a lesson page? (Edit button only appears on lesson view)
- **Fix**: Navigate to any lesson from /lessons

### **Save Button Not Working**
- **Check**: Browser console for JavaScript errors (F12)
- **Check**: Network tab for failed API requests
- **Fix**: Ensure server is running and API endpoints are accessible

### **Changes Not Persisting**
- **Check**: File permissions on lessons directory
- **Check**: Docker volume mounts (if using Docker)
- **Fix**: Ensure web server has write access to lessons folder

### **Editor Looks Broken**
- **Check**: CSS file loaded correctly
- **Check**: Dark mode compatibility
- **Fix**: Clear browser cache, hard reload (Ctrl+Shift+R)

### **Can't Type in Editor**
- **Check**: Is edit mode actually active?
- **Check**: Browser compatibility (use Chrome/Firefox/Edge)
- **Fix**: Click inside the textarea to focus it

## 🎓 Advanced Tips

### **Markdown Formatting**

#### **Headings**
```markdown
# H1 - Main Title
## H2 - Section
### H3 - Subsection
#### H4 - Sub-subsection
```

#### **Code Blocks**
````markdown
```typescript
function solution(A: number[]): number {
    return A.length;
}
```
````

#### **Lists**
```markdown
- Unordered item 1
- Unordered item 2

1. Ordered item 1
2. Ordered item 2
```

#### **Emphasis**
```markdown
**bold text**
*italic text*
***bold and italic***
`inline code`
```

#### **Links**
```markdown
[Link text](https://example.com)
[Internal link](#section-heading)
```

#### **Tables**
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

### **Efficient Editing Workflow**

1. **Plan First**: Know what you want to change before entering edit mode
2. **Use Templates**: Copy existing sections as templates for new content
3. **Preview in Mind**: Visualize how markdown will render
4. **Save Often**: Use Ctrl/Cmd + S frequently
5. **Test Code**: Copy code to playground to verify it works
6. **Incremental Changes**: Make small changes and save, rather than large rewrites

## 🔄 Future Enhancements

Potential features to add:

- [ ] **Live Preview**: Side-by-side markdown and rendered view
- [ ] **Version Control**: Keep history of changes with restore capability
- [ ] **Auto-save**: Periodic automatic saves to prevent data loss
- [ ] **Syntax Highlighting**: Color-coded markdown syntax in editor
- [ ] **Spell Check**: Built-in spell checker for content
- [ ] **Image Upload**: Drag-and-drop image insertion
- [ ] **Export**: Download edited lessons as files
- [ ] **Multi-file Edit**: Edit multiple lessons in tabs
- [ ] **Undo/Redo**: Better editing history management
- [ ] **Search & Replace**: Find and replace within lessons

## 📊 Summary

The edit functionality provides a powerful, user-friendly way to modify lesson content directly from the web interface. With proper security, visual feedback, and keyboard shortcuts, it's designed for both quick edits and comprehensive content updates.

**Key Benefits:**
- ✅ No need to edit files manually
- ✅ Immediate visual feedback
- ✅ Secure with validation
- ✅ Works on all devices
- ✅ Keyboard-friendly workflow
- ✅ Professional UI/UX

Happy editing! 🎉
