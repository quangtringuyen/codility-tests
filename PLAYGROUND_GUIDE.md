# 🎮 TypeScript Playground Guide

Welcome to the **TypeScript Playground** - your interactive coding environment for practicing algorithms!

## ✨ Features

### 🖥️ **VS Code Editor**
- Powered by **Monaco Editor** (same editor as VS Code)
- Full TypeScript support with IntelliSense
- Syntax highlighting
- Auto-completion
- Error detection
- Code formatting

### ⚡ **Instant Execution**
- Run TypeScript code directly in your browser
- No setup or installation required
- Instant feedback
- Console output capture

### 📚 **Built-in Templates**
Pre-loaded code templates for common patterns:
- **Basic Function** - Simple function structure
- **Array Manipulation** - Array operations and transformations
- **Prefix Sum** - Prefix sum pattern
- **Two Pointer** - Two pointer technique
- **Stack Usage** - Stack data structure examples
- **HashMap/Object** - Hash map patterns
- **Greedy Algorithm** - Greedy approach examples
- **Dynamic Programming** - DP with memoization

### 💾 **Auto-Save**
- Your code is automatically saved in the browser
- Persists across sessions
- Never lose your work

## 🚀 How to Use

### Getting Started

1. **Navigate to Playground**
   - Click "Playground" in the top navigation
   - Or visit `/playground`

2. **Write Your Code**
   - Type TypeScript code in the left editor panel
   - Use `console.log()` to print output

3. **Run Your Code**
   - Click the "▶ Run Code" button
   - Or press `Ctrl/Cmd + S`
   - Output appears in the right panel

### Loading Templates

1. Click the **"Load Template..."** dropdown
2. Select a template
3. Confirm to replace your current code
4. Start coding!

### Example Usage

```typescript
// Write a function
function findMax(A: number[]): number {
    let max = -Infinity;
    for (const num of A) {
        if (num > max) {
            max = num;
        }
    }
    return max;
}

// Test it
console.log(findMax([1, 5, 3, 9, 2])); // 9
console.log(findMax([-1, -5, -3]));     // -1
```

## 🎯 Features Explained

### Editor Features

- **IntelliSense**: Type `.` after an object to see methods
- **Error Detection**: Red underlines show errors
- **Auto-Format**: Code formats automatically
- **Minimap**: Overview of your code on the right
- **Line Numbers**: Easy navigation

### Toolbar Options

| Button | Action |
|--------|--------|
| Load Template... | Choose a code template |
| Clear | Clear all code |
| ▶ Run Code | Execute your code |
| 📋 | Copy code to clipboard |
| 🗑️ | Clear output |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Run code |
| `Ctrl/Cmd + /` | Toggle comment |
| `Ctrl/Cmd + D` | Duplicate line |
| `Alt + Up/Down` | Move line up/down |
| `Ctrl/Cmd + Shift + K` | Delete line |

## 💡 Tips & Tricks

### 1. Use Console.log
```typescript
console.log("Debug:", variable);
console.log("Array:", [1, 2, 3]);
console.log("Object:", { name: "test" });
```

### 2. Test Multiple Cases
```typescript
function solution(A: number[]): number {
    // Your solution
    return 0;
}

// Test cases
console.log(solution([1, 2, 3]));      // Test 1
console.log(solution([]));             // Test 2
console.log(solution([5]));            // Test 3
console.log(solution([-1, -2, -3]));   // Test 4
```

### 3. Debug Step by Step
```typescript
function solution(A: number[]): number {
    console.log("Input:", A);

    let result = 0;
    for (let i = 0; i < A.length; i++) {
        console.log(`Step ${i}:`, A[i]);
        result += A[i];
    }

    console.log("Final result:", result);
    return result;
}
```

### 4. Compare Algorithms
```typescript
// Approach 1: Brute force
function solution1(A: number[]): number {
    // O(n²) solution
    // ...
}

// Approach 2: Optimized
function solution2(A: number[]): number {
    // O(n) solution
    // ...
}

console.log("Approach 1:", solution1([1,2,3]));
console.log("Approach 2:", solution2([1,2,3]));
```

## 🎓 Common Patterns

### Array Iteration
```typescript
const arr = [1, 2, 3, 4, 5];

// For loop
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

// For...of loop
for (const num of arr) {
    console.log(num);
}

// forEach
arr.forEach(num => console.log(num));
```

### Object/HashMap
```typescript
const map: { [key: string]: number } = {};

// Add/update
map["key"] = 1;
map["key"]++;

// Check existence
if ("key" in map) {
    console.log(map["key"]);
}

// Iterate
for (const [key, value] of Object.entries(map)) {
    console.log(key, value);
}
```

### Array Methods
```typescript
const arr = [1, 2, 3, 4, 5];

console.log(arr.map(x => x * 2));       // [2, 4, 6, 8, 10]
console.log(arr.filter(x => x > 2));    // [3, 4, 5]
console.log(arr.reduce((a, b) => a + b)); // 15
console.log(arr.some(x => x > 3));      // true
console.log(arr.every(x => x > 0));     // true
```

## 🐛 Troubleshooting

### Code Not Running?
- Check for TypeScript syntax errors (red underlines)
- Ensure you're calling functions with `console.log()`
- Check the browser console for JavaScript errors

### No Output?
- Make sure you're using `console.log()`
- Check if your function is being called
- Verify the function returns a value

### Type Errors?
- TypeScript is strict about types
- Use `: number`, `: string`, `: boolean` for type hints
- Arrays: `number[]`, `string[]`
- Objects: `{ [key: string]: number }`

## 🎯 Practice Challenges

Try these challenges in the playground:

### Challenge 1: Reverse Array
```typescript
function reverse(A: number[]): number[] {
    // Your code here
}

console.log(reverse([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]
```

### Challenge 2: Find Duplicates
```typescript
function findDuplicates(A: number[]): number[] {
    // Your code here
}

console.log(findDuplicates([1, 2, 2, 3, 4, 4, 5])); // [2, 4]
```

### Challenge 3: Two Sum
```typescript
function twoSum(A: number[], target: number): number[] {
    // Your code here
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
```

## 🌟 Advanced Features

### Dark Mode Support
- Playground respects your dark mode setting
- Editor theme switches automatically
- Comfortable for long coding sessions

### Code Persistence
- Code is saved automatically
- Survives page refreshes
- Stored in browser localStorage

### Copy Code
- Click 📋 to copy all code
- Paste into your IDE
- Continue working offline

## 📖 Learning Path

**Week 1-2**: Basic patterns (arrays, loops)
**Week 3-4**: Hash maps, two pointers
**Week 5-6**: Stacks, prefix sums
**Week 7-8**: Advanced patterns (DP, greedy)

Use the playground to practice examples from each week's lessons!

## 🎉 Have Fun Coding!

The playground is your sandbox - experiment, break things, and learn!

**Pro Tip**: Combine lessons + playground for maximum learning!
1. Read lesson concept
2. Try example in playground
3. Modify and experiment
4. Solve practice problems
5. Review and optimize

Happy coding! 🚀
