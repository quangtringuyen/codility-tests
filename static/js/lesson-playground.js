// Sidebar Playground for Lessons
let editorMini;
let isPlaygroundOpen = false;

// Code templates (same as main playground)
const templates = {
    basic: `function solution(A: number[]): number {
    // Write your solution here
    return 0;
}

console.log(solution([1, 2, 3, 4, 5]));`,

    array: `function solution(A: number[]): number[] {
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

console.log(solution([1, 2, 2, 3, 4, 4, 5]));`,

    prefix: `function solution(A: number[]): number[] {
    const n = A.length;
    const prefix: number[] = new Array(n + 1).fill(0);

    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + A[i];
    }

    return prefix;
}

console.log(solution([1, 2, 3, 4, 5]));`,

    twopointer: `function solution(A: number[]): boolean {
    let left = 0;
    let right = A.length - 1;

    while (left < right) {
        if (A[left] !== A[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}

console.log(solution([1, 2, 3, 2, 1]));`,

    stack: `function solution(S: string): boolean {
    const stack: string[] = [];
    const pairs: { [key: string]: string } = {
        ')': '(', '}': '{', ']': '['
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

console.log(solution("()[]{}"));`,

    hashmap: `function solution(A: number[]): number {
    const count: { [key: number]: number } = {};

    for (const num of A) {
        count[num] = (count[num] || 0) + 1;
    }

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

console.log(solution([1, 2, 2, 3, 3, 3]));`
};

// Initialize Monaco Editor
require.config({
    paths: {
        'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
    }
});

require(['vs/editor/editor.main'], function() {
    // Create mini editor
    editorMini = monaco.editor.create(document.getElementById('editorMini'), {
        value: localStorage.getItem('lessonPlaygroundCode') || templates.basic,
        language: 'typescript',
        theme: document.body.classList.contains('dark-mode') ? 'vs-dark' : 'vs-light',
        automaticLayout: true,
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        readOnly: false,
        wordWrap: 'on'
    });

    // Auto-save code
    editorMini.onDidChangeModelContent(() => {
        localStorage.setItem('lessonPlaygroundCode', editorMini.getValue());
    });

    // Update theme when dark mode changes
    const observer = new MutationObserver(() => {
        const isDark = document.body.classList.contains('dark-mode');
        monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});

// Toggle Playground
const toggleBtn = document.getElementById('togglePlaygroundBtn');
const playground = document.getElementById('sidebarPlayground');
const closeBtn = document.getElementById('closePlayground');
const lessonContent = document.getElementById('lessonContent');

// Load saved state
const savedState = localStorage.getItem('playgroundOpen');
if (savedState === 'true') {
    openPlayground();
}

toggleBtn?.addEventListener('click', () => {
    if (isPlaygroundOpen) {
        closePlayground();
    } else {
        openPlayground();
    }
});

closeBtn?.addEventListener('click', closePlayground);

function openPlayground() {
    isPlaygroundOpen = true;
    playground.classList.add('open');
    lessonContent.classList.add('with-sidebar');
    toggleBtn.classList.add('active');
    localStorage.setItem('playgroundOpen', 'true');

    // Refresh editor layout
    setTimeout(() => {
        if (editorMini) editorMini.layout();
    }, 300);
}

function closePlayground() {
    isPlaygroundOpen = false;
    playground.classList.remove('open');
    lessonContent.classList.remove('with-sidebar');
    toggleBtn.classList.remove('active');
    localStorage.setItem('playgroundOpen', 'false');
}

// Template selector
document.getElementById('templateSelectorMini')?.addEventListener('change', function(e) {
    const template = templates[e.target.value];
    if (template && editorMini) {
        if (confirm('This will replace your current code. Continue?')) {
            editorMini.setValue(template);
        }
        e.target.value = '';
    }
});

// Run code
document.getElementById('runBtnMini')?.addEventListener('click', runCodeMini);

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (isPlaygroundOpen) {
            runCodeMini();
        } else {
            openPlayground();
        }
    }
});

async function runCodeMini() {
    const code = editorMini?.getValue() || '';
    const output = document.getElementById('outputMini');
    const runBtn = document.getElementById('runBtnMini');

    if (!code.trim()) {
        output.innerHTML = '<div class="output-error-mini">⚠️ No code to run</div>';
        return;
    }

    // Show loading
    runBtn.disabled = true;
    runBtn.innerHTML = '⏳';
    output.innerHTML = '<div class="output-info-mini">Running...</div>';

    try {
        const result = await transpileAndRun(code);

        if (result.error) {
            output.innerHTML = `<div class="output-error-mini">❌ ${escapeHtml(result.error)}</div>`;
        } else {
            output.innerHTML = `<div class="output-success-mini">${escapeHtml(result.output) || '✓ Success'}</div>`;
        }
    } catch (err) {
        output.innerHTML = `<div class="output-error-mini">❌ ${escapeHtml(err.message)}</div>`;
    } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = '▶ Run';
    }
}

// Transpile and execute (same as playground)
async function transpileAndRun(tsCode) {
    return new Promise((resolve) => {
        try {
            let jsCode = tsCode;

            // Remove type annotations
            jsCode = jsCode.replace(/\b(let|const|var)\s+(\w+)\s*:\s*[\w\[\]<>{}|&]+(\s*=)/g, '$1 $2$3');
            jsCode = jsCode.replace(/\(([^)]*)\)/g, (match, params) => {
                if (!params.trim()) return match;
                const cleanParams = params.split(',').map(param => {
                    return param.replace(/:\s*[\w\[\]<>{}|&\s]+/g, '').trim();
                }).filter(p => p).join(', ');
                return `(${cleanParams})`;
            });
            jsCode = jsCode.replace(/\):\s*[\w\[\]<>{}|&\s]+\{/g, ') {');
            jsCode = jsCode.replace(/\s+as\s+[\w\[\]<>{}|&]+/g, '');
            jsCode = jsCode.replace(/<[\w\[\]<>{}|&,\s]+>/g, '');
            jsCode = jsCode.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');
            jsCode = jsCode.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
            jsCode = jsCode.replace(/\b(readonly|public|private|protected)\s+/g, '');

            // Capture console output
            const logs = [];
            const originalLog = console.log;
            const originalError = console.error;

            console.log = (...args) => logs.push(args.map(a => formatValue(a)).join(' '));
            console.error = (...args) => logs.push('ERROR: ' + args.map(a => formatValue(a)).join(' '));

            try {
                eval(jsCode);
                resolve({ output: logs.join('\n'), error: null });
            } catch (err) {
                resolve({ output: logs.join('\n'), error: err.message });
            } finally {
                console.log = originalLog;
                console.error = originalError;
            }
        } catch (err) {
            resolve({ output: '', error: err.message });
        }
    });
}

function formatValue(value) {
    if (Array.isArray(value)) {
        return '[' + value.map(v => formatValue(v)).join(', ') + ']';
    }
    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value, null, 2);
    }
    return String(value);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Copy code from lesson examples
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy-code-btn')) {
        const codeBlock = e.target.closest('.code-block-wrapper')?.querySelector('code');
        if (codeBlock && editorMini) {
            const code = codeBlock.textContent;
            if (confirm('Copy this code to playground?')) {
                editorMini.setValue(code);
                openPlayground();
            }
        }
    }
});

console.log('Lesson Playground initialized ✓');
