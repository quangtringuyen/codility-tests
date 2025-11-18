// TypeScript Playground
let editor;

// Code templates
const templates = {
    basic: `// Basic TypeScript function
function solution(A: number[]): number {
    // Write your solution here
    return 0;
}

// Test cases
console.log(solution([1, 2, 3, 4, 5])); // Expected: ?
console.log(solution([])); // Expected: ?`,

    array: `// Array manipulation example
function solution(A: number[]): number[] {
    // Example: Remove duplicates
    const seen = new Set<number>();
    const result: number[] = [];

    for (const num of A) {
        if (!seen.has(num)) {
            seen.add(num);
            result.push(num);
        }
    }

    return result;
}

// Test
console.log(solution([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]`,

    prefix: `// Prefix Sum pattern
function solution(A: number[]): number[] {
    const n = A.length;
    const prefix: number[] = new Array(n + 1).fill(0);

    // Build prefix sum array
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + A[i];
    }

    return prefix;
}

// Test
console.log(solution([1, 2, 3, 4, 5])); // [0, 1, 3, 6, 10, 15]`,

    twopointer: `// Two Pointer technique
function solution(A: number[]): boolean {
    let left = 0;
    let right = A.length - 1;

    while (left < right) {
        // Example: Check if array is palindrome
        if (A[left] !== A[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}

// Test
console.log(solution([1, 2, 3, 2, 1])); // true
console.log(solution([1, 2, 3, 4, 5])); // false`,

    stack: `// Stack usage example
function solution(S: string): boolean {
    const stack: string[] = [];
    const pairs: { [key: string]: string } = {
        ')': '(',
        '}': '{',
        ']': '['
    };

    for (const char of S) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            if (stack.length === 0 || stack.pop() !== pairs[char]) {
                return false;
            }
        }
    }

    return stack.length === 0;
}

// Test
console.log(solution("()[]{}"));  // true
console.log(solution("([)]"));    // false`,

    hashmap: `// HashMap/Object pattern
function solution(A: number[]): number {
    const count: { [key: number]: number } = {};

    // Count occurrences
    for (const num of A) {
        count[num] = (count[num] || 0) + 1;
    }

    // Find most frequent
    let maxCount = 0;
    let result = 0;

    for (const [num, freq] of Object.entries(count)) {
        if (freq > maxCount) {
            maxCount = freq;
            result = parseInt(num);
        }
    }

    return result;
}

// Test
console.log(solution([1, 2, 2, 3, 3, 3])); // 3`,

    greedy: `// Greedy algorithm example
function solution(A: number[]): number {
    // Example: Maximum profit (buy-sell stock)
    let minPrice = Infinity;
    let maxProfit = 0;

    for (const price of A) {
        minPrice = Math.min(minPrice, price);
        const profit = price - minPrice;
        maxProfit = Math.max(maxProfit, profit);
    }

    return maxProfit;
}

// Test
console.log(solution([7, 1, 5, 3, 6, 4])); // 5 (buy at 1, sell at 6)`,

    dp: `// Dynamic Programming example
function solution(n: number): number {
    // Example: Fibonacci with memoization
    const dp: number[] = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;

    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}

// Test
console.log(solution(10)); // 55
console.log(solution(15)); // 610`
};

// Initialize Monaco Editor
require.config({
    paths: {
        'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
    }
});

require(['vs/editor/editor.main'], function() {
    // Create editor
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: localStorage.getItem('playgroundCode') || templates.basic,
        language: 'typescript',
        theme: document.body.classList.contains('dark-mode') ? 'vs-dark' : 'vs-light',
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        tabSize: 4
    });

    // Auto-save code
    editor.onDidChangeModelContent(() => {
        localStorage.setItem('playgroundCode', editor.getValue());
    });

    // Update theme when dark mode changes
    const observer = new MutationObserver(() => {
        const isDark = document.body.classList.contains('dark-mode');
        monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});

// Template selector
document.getElementById('templateSelector')?.addEventListener('change', function(e) {
    const template = templates[e.target.value];
    if (template && editor) {
        if (confirm('This will replace your current code. Continue?')) {
            editor.setValue(template);
        }
        e.target.value = '';
    }
});

// Clear button
document.getElementById('clearBtn')?.addEventListener('click', () => {
    if (confirm('Clear all code?')) {
        editor?.setValue('');
    }
});

// Copy code button
document.getElementById('copyCodeBtn')?.addEventListener('click', async () => {
    const code = editor?.getValue() || '';
    try {
        await navigator.clipboard.writeText(code);
        const btn = document.getElementById('copyCodeBtn');
        const originalText = btn.textContent;
        btn.textContent = '✓';
        setTimeout(() => btn.textContent = originalText, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
});

// Clear output
document.getElementById('clearOutputBtn')?.addEventListener('click', () => {
    const output = document.getElementById('output');
    output.innerHTML = '<div class="output-placeholder">Output cleared. Run code to see results...</div>';
});

// Run code button
document.getElementById('runBtn')?.addEventListener('click', runCode);

// Keyboard shortcut (Ctrl/Cmd + S to run)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        runCode();
    }
});

// Run TypeScript code
async function runCode() {
    const code = editor?.getValue() || '';
    const output = document.getElementById('output');
    const runBtn = document.getElementById('runBtn');

    if (!code.trim()) {
        output.innerHTML = '<div class="output-error">⚠️ No code to run</div>';
        return;
    }

    // Show loading
    runBtn.disabled = true;
    runBtn.innerHTML = '⏳ Running...';
    output.innerHTML = '<div class="output-info">Compiling and executing...</div>';

    try {
        // Transpile TypeScript to JavaScript using browser API
        const result = await transpileAndRun(code);

        if (result.error) {
            output.innerHTML = `<div class="output-error">❌ Error:\\n${escapeHtml(result.error)}</div>`;
        } else {
            output.innerHTML = `<div class="output-success">${escapeHtml(result.output) || '✓ Code executed successfully (no output)'}</div>`;
        }
    } catch (err) {
        output.innerHTML = `<div class="output-error">❌ Runtime Error:\\n${escapeHtml(err.message)}</div>`;
    } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = '▶ Run Code';
    }
}

// Transpile and execute TypeScript code
async function transpileAndRun(tsCode) {
    return new Promise((resolve) => {
        try {
            // Simple TypeScript to JavaScript transpilation
            // Remove type annotations for basic execution
            let jsCode = tsCode
                .replace(/: (number|string|boolean|any|\w+(\[\])?)/g, '')
                .replace(/interface \w+ \{[^}]+\}/g, '')
                .replace(/type \w+ = [^;]+;/g, '')
                .replace(/<\w+>/g, '');

            // Capture console output
            const logs = [];
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;

            console.log = (...args) => logs.push(args.map(a => formatValue(a)).join(' '));
            console.error = (...args) => logs.push('ERROR: ' + args.map(a => formatValue(a)).join(' '));
            console.warn = (...args) => logs.push('WARN: ' + args.map(a => formatValue(a)).join(' '));

            try {
                // Execute the code
                eval(jsCode);

                resolve({
                    output: logs.join('\\n'),
                    error: null
                });
            } catch (err) {
                resolve({
                    output: logs.join('\\n'),
                    error: err.message
                });
            } finally {
                // Restore console
                console.log = originalLog;
                console.error = originalError;
                console.warn = originalWarn;
            }
        } catch (err) {
            resolve({
                output: '',
                error: err.message
            });
        }
    });
}

// Format values for display
function formatValue(value) {
    if (Array.isArray(value)) {
        return '[' + value.map(v => formatValue(v)).join(', ') + ']';
    }
    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value, null, 2);
    }
    return String(value);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('TypeScript Playground initialized ✓');
