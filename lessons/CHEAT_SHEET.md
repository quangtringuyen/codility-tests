# Codility Pattern Cheat Sheet 📝

Quick reference for test day. Print this out!

---

## 🎯 Pattern Recognition (Read this FIRST!)

| Problem Mentions... | Likely Pattern | Week |
|---------------------|----------------|------|
| "range queries", "sum from i to j" | **Prefix Sum** | 2 |
| "brackets", "nesting", "matching" | **Stack** | 4 |
| "maximum subarray", "max sum" | **Kadane's** | 5 |
| "majority element", "> N/2 times" | **Boyer-Moore** | 4 |
| "sorted array", "find element" | **Binary Search** | 6 |
| "prime numbers", "divisors" | **Sieve / Math** | 6 |
| "peaks", "flags", "blocks" | **Greedy + Preprocessing** | 6 |
| "buy/sell stock", "profit" | **Kadane's Variant** | 5 |

---

## 💻 Code Templates

### 1. Prefix Sum
```typescript
// Build: O(N)
const prefix = [0];
for (const num of A) {
    prefix.push(prefix[prefix.length - 1] + num);
}

// Query [i, j]: O(1)
const sum = prefix[j + 1] - prefix[i];
```

### 2. Stack Simulation
```typescript
const stack: number[] = [];

for (const item of items) {
    // Pop while condition
    while (stack.length > 0 && stack[stack.length - 1] > item) {
        stack.pop();
    }
    
    // Push if needed
    if (shouldPush(item)) {
        stack.push(item);
    }
}
```

### 3. Kadane's Algorithm
```typescript
let maxEnding = A[0];
let maxSoFar = A[0];

for (let i = 1; i < A.length; i++) {
    maxEnding = Math.max(A[i], maxEnding + A[i]);
    maxSoFar = Math.max(maxSoFar, maxEnding);
}

return maxSoFar;
```

### 4. Boyer-Moore Voting
```typescript
// Find candidate
let candidate = A[0];
let count = 1;

for (let i = 1; i < A.length; i++) {
    if (count === 0) {
        candidate = A[i];
        count = 1;
    } else if (A[i] === candidate) {
        count++;
    } else {
        count--;
    }
}

// MUST verify!
let actualCount = 0;
for (const num of A) {
    if (num === candidate) actualCount++;
}

return actualCount > A.length / 2 ? candidate : -1;
```

### 5. Binary Search
```typescript
let left = 0;
let right = A.length - 1;

while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (A[mid] === target) return mid;
    
    if (A[mid] < target) {
        left = mid + 1;
    } else {
        right = mid - 1;
    }
}

return -1;
```

### 6. Two Pointers
```typescript
let left = 0;
let right = A.length - 1;

while (left < right) {
    const sum = A[left] + A[right];
    
    if (sum === target) {
        return [left, right];
    } else if (sum < target) {
        left++;
    } else {
        right--;
    }
}
```

### 7. Sieve of Eratosthenes
```typescript
function sieve(n: number): boolean[] {
    const isPrime = new Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;
    
    for (let i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (let j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    return isPrime;
}
```

---

## ⚡ Quick Wins

### TypeScript Sorting
```typescript
// Numbers - ALWAYS use comparator!
nums.sort((a, b) => a - b);  // Ascending
nums.sort((a, b) => b - a);  // Descending
```

### Array Helpers
```typescript
// Max/Min
Math.max(...array);
Math.min(...array);

// Sum
array.reduce((a, b) => a + b, 0);

// Unique count
new Set(array).size;

// Last element
array[array.length - 1];
array.at(-1);  // ES2022
```

### Math
```typescript
// GCD
function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

// Check prime
function isPrime(n: number): boolean {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return false;
    }
    return true;
}

// Count divisors
let count = 0;
for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
        count += (i * i === n ? 1 : 2);
    }
}
```

---

## 🚨 Edge Cases Checklist

**ALWAYS test**:
- [ ] Empty array: `[]`
- [ ] Single element: `[5]`
- [ ] Two elements: `[1, 2]`
- [ ] All same: `[3, 3, 3]`
- [ ] All increasing: `[1, 2, 3, 4]`
- [ ] All decreasing: `[4, 3, 2, 1]`
- [ ] Negatives: `[-5, -3, -1]`
- [ ] With zero: `[0, 1, 2]`
- [ ] Max values: `[1000000000]`

---

## ⏱️ Time Management

### 90-Minute Test Strategy
```
0-5 min:   Read all 3 problems, identify difficulty
5-30 min:  Easiest problem
30-65 min: Medium problem
65-90 min: Hardest problem
```

### Per Problem (30 min)
```
0-2 min:   Read carefully
2-3 min:   Identify pattern
3-5 min:   Plan solution
5-20 min:  Code
20-25 min: Test examples
25-28 min: Check edge cases
28-30 min: Final review & submit
```

---

## 🎯 Problem-Solving Flowchart

```
1. Read problem TWICE
   ↓
2. Identify constraints (N ≤ ?)
   ↓
3. Match to pattern
   ↓
4. Plan algorithm
   ↓
5. Consider time complexity
   ↓
6. Code solution
   ↓
7. Test with examples
   ↓
8. Check edge cases
   ↓
9. Submit!
```

---

## ⚠️ Common Mistakes

### TypeScript
```typescript
// ❌ WRONG
[10, 2, 8].sort();  // Treats as strings!

// ✅ RIGHT
[10, 2, 8].sort((a, b) => a - b);
```

### Off-by-One
```typescript
// ❌ WRONG
for (let i = 0; i <= A.length; i++)  // Goes out of bounds!

// ✅ RIGHT
for (let i = 0; i < A.length; i++)
```

### Empty Check
```typescript
// ❌ WRONG
let max = A[0];  // Error if empty!

// ✅ RIGHT
if (A.length === 0) return -1;
let max = A[0];
```

### Boyer-Moore
```typescript
// ❌ WRONG
return candidate;  // Didn't verify!

// ✅ RIGHT
// Verify candidate appears > N/2 times
if (actualCount > A.length / 2) {
    return candidate;
}
```

---

## 🏆 Most Common Problems

### You MUST Know
1. **GenomicRangeQuery** - Multiple prefix sums
2. **StoneWall** - Stack simulation ⭐⭐⭐
3. **Fish** - Stack with directions
4. **Flags** - Greedy with constraints ⭐⭐⭐
5. **MaxDoubleSliceSum** - Two DP arrays
6. **Dominator** - Boyer-Moore

### Very Likely to See
7. **PermCheck** - Boolean array
8. **FrogRiverOne** - Counting
9. **MaxProfit** - Kadane's variant
10. **TapeEquilibrium** - Prefix sum

---

## 📊 Complexity Guide

| N Size | Max Complexity | Patterns |
|--------|----------------|----------|
| N ≤ 10 | O(N!) | Brute force |
| N ≤ 100 | O(N³) | Triple loops |
| N ≤ 1,000 | O(N²) | Double loops |
| N ≤ 100,000 | O(N log N) | Sort, binary search |
| N ≤ 1,000,000 | O(N) | Single pass, hash map |
| N ≤ 1,000,000,000 | O(log N) | Binary search, math |

---

## 🧠 Mental Checklist

**Before coding**:
- [ ] Understood the problem?
- [ ] Identified the pattern?
- [ ] Know time complexity needed?
- [ ] Planned the algorithm?

**Before submitting**:
- [ ] Tested with examples?
- [ ] Checked edge cases?
- [ ] No off-by-one errors?
- [ ] Correct time complexity?

---

## 💪 Test Day Mindset

**Remember**:
1. You've trained 8 weeks - you're ready!
2. Read problem carefully (twice!)
3. Identify pattern quickly
4. Start coding only after planning
5. Test thoroughly before submit
6. If stuck, move on and come back
7. Stay calm - you know this!

---

## 🎯 Goal

**Target**: 85-90% correctness
**Strategy**: Accuracy > Speed
**Mindset**: Confident but careful

---

**Good luck! You've got this!** 🚀

Print this sheet and keep it handy during practice! 📄
