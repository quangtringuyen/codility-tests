# Week 5: Maximum Slices + DP Basics

Focus: max subarray, max double slice, DP for Codility

---

## Day 29: Kadane's Algorithm

### Learning Objectives
- Master Kadane's algorithm for maximum subarray
- Understand the pattern
- Apply to stock profit problems

### The Maximum Subarray Problem

**Problem**: Find contiguous subarray with largest sum.

**Example**:
```
Array: [5, -3, 5]
All subarrays and their sums:
[5] = 5
[5, -3] = 2
[5, -3, 5] = 7 ← maximum
[-3] = -3
[-3, 5] = 2
[5] = 5

Maximum sum: 7
```

### Kadane's Algorithm

**Key Insight**: At each position, either:
1. Extend previous subarray, OR
2. Start new subarray from current element

```typescript
function maxSubarraySum(A: number[]): number {
    let maxEndingHere = A[0];  // Max sum ending at current position
    let maxSoFar = A[0];        // Overall maximum found
    
    for (let i = 1; i < A.length; i++) {
        // Either extend previous subarray or start new one
        maxEndingHere = Math.max(A[i], maxEndingHere + A[i]);
        
        // Update overall maximum
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}

// Test cases
console.log(maxSubarraySum([5, -3, 5]));           // 7
console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]));  // 6 ([4,-1,2,1])
console.log(maxSubarraySum([-1, -2, -3]));        // -1 (all negative)
```

**Time**: O(n), **Space**: O(1)

### Why It Works

**Trace Example**: `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`

```
i=0: maxEnd=-2, maxSo=-2
i=1: maxEnd=max(1, -2+1)=1,    maxSo=1
i=2: maxEnd=max(-3, 1-3)=-2,   maxSo=1
i=3: maxEnd=max(4, -2+4)=4,    maxSo=4
i=4: maxEnd=max(-1, 4-1)=3,    maxSo=4
i=5: maxEnd=max(2, 3+2)=5,     maxSo=5
i=6: maxEnd=max(1, 5+1)=6,     maxSo=6  ← found it!
i=7: maxEnd=max(-5, 6-5)=1,    maxSo=6
i=8: maxEnd=max(4, 1+4)=5,     maxSo=6

Result: 6 (subarray [4, -1, 2, 1])
```

### Codility Challenge: MaxSliceSum

**Problem**: Find maximum sum of any slice (subarray).

**Solution** (Direct Kadane's):
```typescript
function solution(A: number[]): number {
    let maxEnding = A[0];
    let maxSlice = A[0];
    
    for (let i = 1; i < A.length; i++) {
        maxEnding = Math.max(A[i], maxEnding + A[i]);
        maxSlice = Math.max(maxSlice, maxEnding);
    }
    
    return maxSlice;
}

// Test cases
console.log(solution([3, 2, -6, 4, 0]));  // 5 ([3, 2])
console.log(solution([-10]));              // -10
console.log(solution([5, -7, 3, 5, -2, 4, -1]));  // 10 ([3, 5, -2, 4])
```

### Codility Challenge: MaxProfit

**Problem**: Maximum profit from stock prices (buy once, sell once).

**Example**:
```
Prices: [23171, 21011, 21123, 21366, 21013, 21367]

Buy at 21011 (index 1)
Sell at 21367 (index 5)
Profit: 21367 - 21011 = 356
```

**Solution** (Kadane's variant):
```typescript
function solution(A: number[]): number {
    if (A.length < 2) return 0;
    
    let minPrice = A[0];
    let maxProfit = 0;
    
    for (let i = 1; i < A.length; i++) {
        // Calculate profit if we sell today
        const profit = A[i] - minPrice;
        maxProfit = Math.max(maxProfit, profit);
        
        // Update minimum price seen so far
        minPrice = Math.min(minPrice, A[i]);
    }
    
    return maxProfit;
}

// Alternative: Using Kadane's directly on price differences
function solutionKadane(A: number[]): number {
    if (A.length < 2) return 0;
    
    let maxEnding = 0;
    let maxProfit = 0;
    
    for (let i = 1; i < A.length; i++) {
        const change = A[i] - A[i - 1];
        maxEnding = Math.max(0, maxEnding + change);
        maxProfit = Math.max(maxProfit, maxEnding);
    }
    
    return maxProfit;
}

// Test cases
console.log(solution([23171, 21011, 21123, 21366, 21013, 21367]));  // 356
console.log(solution([5, 4, 3, 2, 1]));  // 0 (prices only decrease)
console.log(solution([1, 2, 3, 4, 5]));  // 4 (buy at 1, sell at 5)
```

**Time**: O(n), **Space**: O(1)

---

## Day 30: Max Double Slice

### Codility Challenge: MaxDoubleSliceSum

**Problem**: Find maximum sum of a "double slice".

**Double Slice Definition**:
- Triple (X, Y, Z) where 0 ≤ X < Y < Z < N
- Sum = A[X+1] + A[X+2] + ... + A[Y-1] + A[Y+1] + ... + A[Z-1]
- **Excludes** A[X], A[Y], and A[Z]!

**Example**:
```
A = [3, 2, 6, -1, 4, 5, -1, 2]

Triple (0, 3, 6):
Sum = A[1] + A[2] + A[4] + A[5]
    = 2 + 6 + 4 + 5
    = 17

This is the maximum!
```

**Key Insight**: For each middle point Y:
- Find max sum ending at Y-1 (from left)
- Find max sum starting at Y+1 (from right)
- Total = leftMax[Y-1] + rightMax[Y+1]

**Solution**:
```typescript
function solution(A: number[]): number {
    const n = A.length;
    if (n < 3) return 0;
    
    // leftMax[i] = max sum ending at position i (from left)
    const leftMax = new Array(n).fill(0);
    
    // rightMax[i] = max sum starting at position i (from right)
    const rightMax = new Array(n).fill(0);
    
    // Build leftMax using Kadane's from left
    for (let i = 1; i < n - 1; i++) {
        leftMax[i] = Math.max(0, leftMax[i - 1] + A[i]);
    }
    
    // Build rightMax using Kadane's from right
    for (let i = n - 2; i > 0; i--) {
        rightMax[i] = Math.max(0, rightMax[i + 1] + A[i]);
    }
    
    // Find maximum double slice sum
    let maxSum = 0;
    
    // Y can be any index from 1 to n-2 (middle of triple)
    for (let y = 1; y < n - 1; y++) {
        const doubleSlice = leftMax[y - 1] + rightMax[y + 1];
        maxSum = Math.max(maxSum, doubleSlice);
    }
    
    return maxSum;
}

// Test cases
console.log(solution([3, 2, 6, -1, 4, 5, -1, 2]));  // 17
console.log(solution([5, 17, 0, 3]));                // 17
console.log(solution([0, 10, -5, -2, 0]));           // 10
console.log(solution([-2, -3, -4]));                 // 0
```

**Time**: O(n), **Space**: O(n)

**Visualization**:
```
A = [3, 2, 6, -1, 4, 5, -1, 2]

leftMax:  [0, 2, 8,  7, 11, 16, 15, 0]
          ↑  ↑  ↑   ↑   ↑   ↑   ↑  ↑
          Can't use these positions as Y
          
rightMax: [0, 15, 9, 10, 9, 4, 2, 0]

For Y=3:
  leftMax[2] = 8  (sum of slice 1..2)
  rightMax[4] = 9 (sum of slice 4..5)
  Total = 17
```

---

## Day 31: DP Basics (Beginner Friendly)

### What is Dynamic Programming?

**Dynamic Programming (DP)** = Solving complex problems by breaking them into simpler subproblems.

**Key Concepts**:
1. **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems**: Same subproblems are solved multiple times
3. **Memoization**: Store results to avoid recomputation

### Classic Example: Fibonacci

**Naive Recursion** (Slow):
```typescript
function fib(n: number): number {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
// Time: O(2^n) - exponential!
// fib(5) calls fib(4), fib(3)
// fib(4) calls fib(3), fib(2)
// fib(3) is calculated TWICE!
```

**With Memoization** (Fast):
```typescript
function fib(n: number, memo: Map<number, number> = new Map()): number {
    if (n <= 1) return n;
    
    if (memo.has(n)) {
        return memo.get(n)!;  // Already calculated!
    }
    
    const result = fib(n - 1, memo) + fib(n - 2, memo);
    memo.set(n, result);
    return result;
}
// Time: O(n) - each subproblem solved once
```

**Iterative DP** (Best):
```typescript
function fib(n: number): number {
    if (n <= 1) return n;
    
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}
// Time: O(n), Space: O(n)
```

**Space-Optimized**:
```typescript
function fib(n: number): number {
    if (n <= 1) return n;
    
    let prev2 = 0;
    let prev1 = 1;
    
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}
// Time: O(n), Space: O(1)
```

### DP Problem-Solving Steps

1. **Define the state**: What does dp[i] represent?
2. **Find the recurrence relation**: How does dp[i] relate to previous states?
3. **Initialize base cases**: What are dp[0], dp[1]?
4. **Determine computation order**: Bottom-up or top-down?
5. **Compute the answer**: Usually dp[n] or max of dp array

---

## Day 32: DP Practice

### Codility Challenge: NumberSolitaire

**Problem**: Game board with dice (1-6). Start at 0, reach N-1. Maximize score.

**Example**:
```
A = [1, -2, 0, 9, -1, -2]
     0   1  2  3   4   5

Start at index 0 (score = 1)
Roll dice:
  1→5 → move 1-6 positions

Best path:
0 → 3 → 5
Score: 1 + 9 + (-2) = 8
```

**DP Solution**:
```typescript
function solution(A: number[]): number {
    const n = A.length;
    
    // dp[i] = maximum score to reach position i
    const dp = new Array(n).fill(-Infinity);
    dp[0] = A[0];  // Start position
    
    for (let i = 0; i < n; i++) {
        // Try all dice rolls (1 to 6)
        for (let dice = 1; dice <= 6 && i + dice < n; dice++) {
            const nextPos = i + dice;
            dp[nextPos] = Math.max(dp[nextPos], dp[i] + A[nextPos]);
        }
    }
    
    return dp[n - 1];
}

// Test cases
console.log(solution([1, -2, 0, 9, -1, -2]));  // 8
console.log(solution([-1, -2, -3, -4]));       // -7 (forced to step on all)
console.log(solution([1, 2, 3, 4, 5, 6, 7]));  // 22
```

**Time**: O(n), **Space**: O(n)

**How it works**:
```
A =  [1, -2, 0, 9, -1, -2]
dp = [1,  ?, ?, ?,  ?,  ?]

From position 0:
  Roll 1: dp[1] = max(-∞, 1 + (-2)) = -1
  Roll 2: dp[2] = max(-∞, 1 + 0) = 1
  Roll 3: dp[3] = max(-∞, 1 + 9) = 10
  ...

From position 1:
  Roll 1: dp[2] = max(1, -1 + 0) = 1
  Roll 2: dp[3] = max(10, -1 + 9) = 10
  ...

Continue until dp[5] calculated
```

### Classic DP: Climbing Stairs

**Problem**: Climb stairs with 1 or 2 steps at a time. How many ways to reach top?

**Solution**:
```typescript
function climbStairs(n: number): number {
    if (n <= 2) return n;
    
    // dp[i] = ways to reach step i
    const dp = new Array(n + 1);
    dp[1] = 1;  // 1 way to reach step 1
    dp[2] = 2;  // 2 ways to reach step 2 (1+1 or 2)
    
    for (let i = 3; i <= n; i++) {
        // Either came from i-1 (with 1 step) or i-2 (with 2 steps)
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

console.log(climbStairs(5));  // 8 ways
```

---

## Day 33: DP Review

### DP Patterns Summary

**Pattern 1: Kadane's Algorithm**
```typescript
// Maximum subarray/slice
let maxEnding = arr[0];
let maxSoFar = arr[0];
for (let i = 1; i < n; i++) {
    maxEnding = Math.max(arr[i], maxEnding + arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEnding);
}
```

**Pattern 2: Two DP Arrays**
```typescript
// MaxDoubleSliceSum pattern
const leftMax = [], rightMax = [];
// Build from left
for (let i = 1; i < n - 1; i++) {
    leftMax[i] = Math.max(0, leftMax[i-1] + A[i]);
}
// Build from right
for (let i = n - 2; i > 0; i--) {
    rightMax[i] = Math.max(0, rightMax[i+1] + A[i]);
}
```

**Pattern 3: State Transition**
```typescript
// NumberSolitaire pattern
const dp = new Array(n).fill(-Infinity);
dp[0] = initial;
for (let i = 0; i < n; i++) {
    for (const transition of possibleMoves) {
        dp[next] = Math.max(dp[next], dp[i] + value);
    }
}
```

### Speed Practice

Redo for speed:
1. **MaxSliceSum** - Target: < 5 minutes
2. **MaxProfit** - Target: < 7 minutes
3. **NumberSolitaire** - Target: < 10 minutes

---

## Day 34: Review

### Key Takeaways

**Kadane's Algorithm**:
- Solves maximum subarray in O(n)
- Core idea: maxEnding = max(current, previous + current)
- Works for MaxSliceSum, MaxProfit

**Double Slice**:
- Use TWO DP arrays (left and right)
- Combine at each middle point
- Watch out for exclude positions!

**DP Mindset**:
- Break problem into smaller subproblems
- Store results (memoization)
- Build solution bottom-up

### Common Mistakes

❌ **Forgetting base cases**
```typescript
// WRONG
const dp = new Array(n);
dp[0] = initial;  // What about dp[1]?

// RIGHT
const dp = new Array(n);
dp[0] = initial;
dp[1] = initial2;  // Handle all base cases
```

❌ **Wrong initialization for max problems**
```typescript
// WRONG
const dp = new Array(n).fill(0);  // 0 might not be min!

// RIGHT
const dp = new Array(n).fill(-Infinity);
```

---

## Day 35: MOCK TEST (75 minutes)

### Test Conditions
- **Time Limit**: 75 minutes
- **Target Score**: 80-85%
- **Problems**: 3 challenges

### Problems

**Problem 1: MaxSliceSum** (20 min)
**Problem 2: MaxProfit** (25 min)
**Problem 3: MaxDoubleSliceSum** (30 min)

### Post-Test Checklist

✅ Did you identify the DP pattern?
✅ Did you handle all base cases?
✅ Did you test with edge cases?
✅ Is your solution optimal?

---

## Week 5 Summary

### What You Learned
✅ Kadane's algorithm for maximum subarray
✅ Stock profit optimization
✅ Double slice with two DP arrays
✅ DP fundamentals (memoization, state transitions)
✅ NumberSolitaire game DP

### Critical Patterns

**1. Kadane's Algorithm**
- Maximum subarray: O(n) time, O(1) space
- maxEnding vs maxSoFar
- Essential for slice problems

**2. Multiple DP Arrays**
- Build from different directions
- Combine results
- MaxDoubleSliceSum pattern

**3. State Transitions**
- dp[i] depends on previous states
- Try all valid transitions
- Maximize/minimize result

### Why This Week Was Important

DP appears in:
- 20%+ of Codility tests
- Optimization problems
- Many interview questions

**Must master**:
- Kadane's algorithm
- MaxDoubleSliceSum
- NumberSolitaire

### Prepare for Week 6

Next week: Binary Search, Peaks, Flags, Sieve
- Advanced algorithmic techniques
- Prime number problems
- Optimization with binary search

Great progress! Week 5 complete! 🚀
