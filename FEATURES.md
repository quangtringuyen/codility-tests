# Features & Screenshots Guide

This document describes what you'll see when you run the Codility Training Tracker.

## Dashboard View (/)

### Header Section
- **App Title**: "Codility Training Tracker" in blue
- **Navigation**: Link back to dashboard

### Progress Statistics Section
Three cards displaying:

1. **Days Completed Card**
   - Large number showing completed days
   - Text: "out of 56"
   - Visual counter

2. **Tasks Completed Card**
   - Number of tasks finished
   - Text: "out of total tasks"
   - Progress indicator

3. **Overall Progress Card**
   - Percentage (0-100%)
   - Visual progress bar
   - Color-coded fill (blue to green gradient)

### 8-Week Grid
Eight cards arranged in a responsive grid:

**Each Week Card Shows:**
- Week number with emoji indicator:
  - Week 1: 🟦 (Blue)
  - Week 2: 🟩 (Green)
  - Week 3: 🟧 (Orange)
  - Week 4: 🟨 (Yellow)
  - Week 5: 🟥 (Red)
  - Week 6: 🟫 (Brown)
  - Week 7: 🟪 (Purple)
  - Week 8: 🟧 (Orange)
- Week title (e.g., "Foundations (TypeScript + Basic DSA)")
- Focus description
- Number of days
- "View Week" button

### Training Tips Section
Bulleted list of helpful tips:
- Study consistently 2 hours/day
- Solve problems independently first
- Understand patterns, not memorize
- Take mock tests seriously
- Review difficult problems multiple times
- Track progress and identify weaknesses

## Week View (/week/<number>)

### Navigation
- Back arrow link to dashboard
- Week title and number
- Focus description

### Daily Cards
Each day is a separate card containing:

#### Day Header
- Day number and title (e.g., "Day 1: TypeScript Language Basics")
- Completion checkbox with label "Mark day as complete"
- Completed days have green border

#### Topics Section (if applicable)
- Bulleted list of topics to learn
- Example: "Functions", "Arrays & objects", "For / while loops"

#### Tasks Section
- List of tasks to complete
- Each task has:
  - Checkbox to mark complete
  - Task name (clickable/interactive)
  - Score input field (for mock tests)
    - Accepts 0-100 percentage
    - Only shown for mock test tasks

#### Notes Section
- Text area for personal notes
- Placeholder: "Add your notes, solutions, or reflections here..."
- "Save Notes" button
- Shows "Saved!" confirmation on successful save
- Auto-saves 2 seconds after typing stops

## Interactive Features

### Checkboxes
- Custom styled with dark background
- Green checkmark when completed
- Smooth animation
- Hover effect shows blue border
- Immediate database update

### Progress Bar
- Animated fill on load
- Gradient color (blue to green)
- Updates in real-time as you complete tasks

### Cards
- Hover effect: lifts up slightly
- Shadow effect on hover
- Smooth transitions
- Click anywhere to interact

### Buttons
- Blue primary color
- Darker blue on hover
- Rounded corners
- Clear clickable appearance

## Color Scheme

### Main Colors
- **Background**: Dark blue gradient (#1a1a2e to #16213e)
- **Cards**: Dark navy (#16213e)
- **Primary**: Bright blue (#4a90e2)
- **Success**: Green (#50c878)
- **Text Primary**: Light gray (#eee)
- **Text Secondary**: Medium gray (#aaa)
- **Borders**: Subtle blue (#2d3561)

### Status Colors
- **Completed**: Green (#27ae60)
- **In Progress**: Blue (#4a90e2)
- **Warning**: Orange (#f39c12)
- **Error**: Red (#e74c3c)

## Responsive Design

### Desktop (1200px+)
- Three-column grid for stats
- Two-column grid for week cards
- Full-width day cards
- Side-by-side layouts

### Tablet (768px-1199px)
- Two-column grid for stats
- Two-column grid for week cards
- Stacked day cards

### Mobile (<768px)
- Single column layout
- Stacked stats cards
- Full-width week cards
- Vertical day layouts
- Touch-friendly buttons and checkboxes

## User Flow Example

### First Time User
1. **Lands on Dashboard**
   - Sees 0% progress
   - All weeks available
   - Tips section at bottom

2. **Clicks "View Week" on Week 1**
   - Sees 7 days (Day 1-7)
   - All unchecked
   - Empty notes

3. **Starts Day 1**
   - Reads topics
   - Checks off tasks as completed
   - Adds notes about learning
   - Marks day as complete when done

4. **Returns to Dashboard**
   - Sees updated progress (1 day completed)
   - Progress bar shows small percentage
   - Motivated to continue!

### Returning User
1. **Opens Dashboard**
   - Sees previous progress
   - Knows exactly where to continue
   - Can review completed weeks

2. **Continues from Last Day**
   - Previous notes are saved
   - Completed tasks still checked
   - Can review and update

## Data Persistence

All data is saved automatically:
- Task completion (immediate)
- Day completion (immediate)
- Notes (2 second delay or manual save)
- Scores (immediate on blur)

**Database**: SQLite locally, PostgreSQL in production

## Mock Test Features

Mock tests (appears on specific days):
- Special indicator in task name
- Score input field (0-100%)
- Score saved separately
- Can track improvement over time

**Mock Test Days:**
- Day 14 (Week 2): Target 70%+
- Day 21 (Week 3): Target 75%+
- Day 28 (Week 4): Target 80%+
- Day 35 (Week 5): Target 80-85%
- Day 42 (Week 6): Target 85%+
- Days 51, 53, 55 (Week 8): Final assessments

## Accessibility Features

- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Readers**: Semantic HTML with proper labels
- **High Contrast**: Dark theme with clear text
- **Large Touch Targets**: 44px minimum for mobile
- **Focus Indicators**: Clear blue outline on focus

## Performance

- **Load Time**: <2 seconds on average connection
- **Interaction**: Instant feedback on all actions
- **Database**: Optimized queries, minimal lag
- **No Page Reloads**: AJAX for smooth experience

## Special Day Types

### Regular Study Days
- Topics to learn
- Tasks/problems to solve
- Note taking

### Review Days
- Revisit previous problems
- Strengthen weak areas
- No new content

### Mock Test Days
- Timed practice (noted in title)
- Score tracking
- Performance targets
- Full simulation mode

### Rest Day
- Day 7 (Week 1)
- No tasks assigned
- Recovery and reflection

## Footer
- Simple text
- App description
- Centered layout
- Dark background

---

This comprehensive feature set ensures you have everything needed to successfully complete your 8-week Codility training journey!
