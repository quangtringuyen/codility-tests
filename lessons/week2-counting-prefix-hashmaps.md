# Week 2: Counting, Prefix Sum & Hash Maps

Focus: Codility Lesson 3-5, hash maps in TypeScript

---

## Day 8: Counting Elements

### Learning Objectives
- Master boolean array technique
- Understand when to use hash maps vs arrays
- Solve counting problems efficiently

### Boolean Arrays vs Hash Maps

**Use Boolean Array when:**
- Values are in a small, known range (e.g., 1 to N)
- Need O(1) lookup with minimal space

**Use Hash Map when:**
- Values can be any integer
- Range is unknown or very large

### Codility Challenge 1: PermCheck

**Problem**: Check if array contains permutation of 1..N.

**Example**:
```
Input:  [4, 1, 3, 2]
Output: 1 (it's a permutation of 1..4)

Input:  [4, 1, 3]
Output: 0 (missing 2)
```

**Solution**:
```typescript
function solution(A: number[]): number {
    const n = A.length;
    const seen = new Array(n + 1).fill(false);
    
    for (const num of A) {
        // Check if number is out of valid range
        if (num < 1 || num > n) {
            return 0;
        }
        
        // Check if we've seen this number before
        if (seen[num]) {
            return 0;  // Duplicate found
        }
        
        seen[num] = true;
    }
    
    // Check if all numbers from 1 to n are present
    for (let i = 1; i <= n; i++) {
        if (!seen[i]) {
            return 0;
        }
    }
    
    return 1;
}
```

**Time Complexity**: O(n)
**Space Complexity**: O(n)

### Codility Challenge 2: FrogJmp

**Problem**: Count minimum jumps needed for frog to reach target.

**Example**:
```
X = 10 (start position)
Y = 85 (target position)
D = 30 (jump distance)

Jumps needed: 3
10 + 30 = 40
40 + 30 = 70
70 + 30 = 100 (reached or passed 85)
```

**Solution**:
```typescript
function solution(X: number, Y: number, D: number): number {
    const distance = Y - X;
    
    // Use Math.ceil to round up
    return Math.ceil(distance / D);
}

// Test cases
console.log(solution(10, 85, 30));  // 3
console.log(solution(1, 5, 2));     // 2
console.log(solution(3, 999111321, 7)); // 142730189
```

**Time Complexity**: O(1)
**Space Complexity**: O(1)

---

## Day 9: Counting Practice

### Codility Challenge 1: MissingInteger

**Problem**: Find the smallest positive integer that doesn't occur in array.

**Example**:
```
Input:  [1, 3, 6, 4, 1, 2]
Output: 5

Input:  [1, 2, 3]
Output: 4

Input:  [-1, -3]
Output: 1
```

**Solution**:
```typescript
function solution(A: number[]): number {
    // Use hash set for O(1) lookup
    const seen = new Set(A);
    
    // Start checking from 1
    let missing = 1;
    
    while (seen.has(missing)) {
        missing++;
    }
    
    return missing;
}

// Optimized version with boolean array (if we know max value)
function solutionOptimized(A: number[]): number {
    const n = A.length;
    const seen = new Array(n + 2).fill(false);
    
    for (const num of A) {
        if (num > 0 && num <= n + 1) {
            seen[num] = true;
        }
    }
    
    for (let i = 1; i <= n + 1; i++) {
        if (!seen[i]) {
            return i;
        }
    }
    
    return 1;
}
```

### Codility Challenge 2: FrogRiverOne

**Problem**: Find earliest time when frog can jump to other side.

**Example**:
```
X = 5 (river width, need positions 1,2,3,4,5)
A = [1, 3, 1, 4, 2, 3, 5, 4]

Time 0: position 1 appears
Time 1: position 3 appears
Time 2: position 1 appears (already have)
Time 3: position 4 appears
Time 4: position 2 appears (now have all 1,2,3,4!)
Time 5: position 3 appears (already have)
Time 6: position 5 appears (NOW can cross!)

Output: 6
```

**Solution**:
```typescript
function solution(X: number, A: number[]): number {
    const covered = new Set<number>();
    
    for (let time = 0; time < A.length; time++) {
        covered.add(A[time]);
        
        // Check if we have all positions from 1 to X
        if (covered.size === X) {
            return time;
        }
    }
    
    return -1;  // Cannot cross
}
```

**Time Complexity**: O(n)
**Space Complexity**: O(X)

---

## Day 10: Prefix Sums (VERY IMPORTANT!)

### What is Prefix Sum?

Prefix sum allows us to calculate sum of any subarray in O(1) time.

**Example**:
```
Array:      [3, 2, 4, 1, 5]
Prefix sum: [3, 5, 9, 10, 15]
             ↑  ↑  ↑   ↑   ↑
            [0][1][2] [3] [4]
```

**To get sum from index i to j:**
```
sum(i, j) = prefix[j] - prefix[i-1]
```

### Basic Implementation

```typescript
function computePrefixSum(A: number[]): number[] {
    const prefix: number[] = new Array(A.length);
    prefix[0] = A[0];
    
    for (let i = 1; i < A.length; i++) {
        prefix[i] = prefix[i - 1] + A[i];
    }
    
    return prefix;
}

function rangeSum(prefix: number[], i: number, j: number): number {
    if (i === 0) {
        return prefix[j];
    }
    return prefix[j] - prefix[i - 1];
}

// Example
const arr = [3, 2, 4, 1, 5];
const prefix = computePrefixSum(arr);

console.log(rangeSum(prefix, 1, 3));  // Sum of [2,4,1] = 7
console.log(rangeSum(prefix, 0, 4));  // Sum of [3,2,4,1,5] = 15
```

### Codility Challenge: GenomicRangeQuery

**Problem**: Find minimal nucleotide from range in DNA sequence.

**Example**:
```
S = "CAGCCTA"
P = [2, 5, 0]  (query start positions)
Q = [4, 5, 6]  (query end positions)

Query 0: S[2..4] = "GCC" → min is C (impact factor 2)
Query 1: S[5..5] = "T" → min is T (impact factor 4)
Query 2: S[0..6] = "CAGCCTA" → min is A (impact factor 1)

Output: [2, 4, 1]
```

**Solution - Prefix Sum for Each Nucleotide**:
```typescript
function solution(S: string, P: number[], Q: number[]): number[] {
    const n = S.length;
    const m = P.length;
    
    // Impact factors
    const impact = { 'A': 1, 'C': 2, 'G': 3, 'T': 4 };
    
    // Create prefix sum arrays for each nucleotide
    const prefixA = new Array(n + 1).fill(0);
    const prefixC = new Array(n + 1).fill(0);
    const prefixG = new Array(n + 1).fill(0);
    const prefixT = new Array(n + 1).fill(0);
    
    // Build prefix sums
    for (let i = 0; i < n; i++) {
        prefixA[i + 1] = prefixA[i] + (S[i] === 'A' ? 1 : 0);
        prefixC[i + 1] = prefixC[i] + (S[i] === 'C' ? 1 : 0);
        prefixG[i + 1] = prefixG[i] + (S[i] === 'G' ? 1 : 0);
        prefixT[i + 1] = prefixT[i] + (S[i] === 'T' ? 1 : 0);
    }
    
    const result: number[] = [];
    
    // Process each query
    for (let k = 0; k < m; k++) {
        const start = P[k];
        const end = Q[k] + 1;  // +1 because our prefix is 1-indexed
        
        // Check each nucleotide in order of impact factor
        if (prefixA[end] - prefixA[start] > 0) {
            result.push(1);
        } else if (prefixC[end] - prefixC[start] > 0) {
            result.push(2);
        } else if (prefixG[end] - prefixG[start] > 0) {
            result.push(3);
        } else {
            result.push(4);
        }
    }
    
    return result;
}
```

**Time Complexity**: O(N + M) where N = string length, M = number of queries
**Space Complexity**: O(N)

---

## Day 11: Prefix Sums II

### Understanding Subarray Sums

**Pattern**: Finding subarrays with specific sum properties

**Example Problem**: Count subarrays with sum = K

```typescript
function countSubarraysWithSum(arr: number[], K: number): number {
    const prefixSumCount = new Map<number, number>();
    prefixSumCount.set(0, 1);  // Empty prefix
    
    let prefixSum = 0;
    let count = 0;
    
    for (const num of arr) {
        prefixSum += num;
        
        // If (prefixSum - K) exists, we found subarrays ending here
        const target = prefixSum - K;
        if (prefixSumCount.has(target)) {
            count += prefixSumCount.get(target)!;
        }
        
        // Update prefix sum count
        prefixSumCount.set(prefixSum, (prefixSumCount.get(prefixSum) || 0) + 1);
    }
    
    return count;
}

// Test
console.log(countSubarraysWithSum([1, 2, 3, 4], 5));  // 2 ([2,3] and [5])
```

### LeetCode: Range Sum Query - Immutable

**Problem**: Implement class to calculate sum of range [i, j] quickly.

```typescript
class NumArray {
    private prefix: number[];
    
    constructor(nums: number[]) {
        this.prefix = new Array(nums.length + 1).fill(0);
        
        for (let i = 0; i < nums.length; i++) {
            this.prefix[i + 1] = this.prefix[i] + nums[i];
        }
    }
    
    sumRange(left: number, right: number): number {
        return this.prefix[right + 1] - this.prefix[left];
    }
}

// Usage
const numArray = new NumArray([1, 2, 3, 4, 5]);
console.log(numArray.sumRange(0, 2));  // 6 (1+2+3)
console.log(numArray.sumRange(2, 4));  // 12 (3+4+5)
```

### Advanced: 2D Prefix Sum

**Use case**: Calculate sum of any rectangle in 2D array

```typescript
function compute2DPrefixSum(matrix: number[][]): number[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const prefix: number[][] = Array(rows + 1).fill(0)
        .map(() => Array(cols + 1).fill(0));
    
    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            prefix[i][j] = matrix[i-1][j-1]
                         + prefix[i-1][j]
                         + prefix[i][j-1]
                         - prefix[i-1][j-1];
        }
    }
    
    return prefix;
}

function rectangleSum(prefix: number[][], 
                      row1: number, col1: number,
                      row2: number, col2: number): number {
    return prefix[row2+1][col2+1]
         - prefix[row1][col2+1]
         - prefix[row2+1][col1]
         + prefix[row1][col1];
}
```

---

## Day 12: Hash Map Practice

### TypeScript Map vs Object

```typescript
// Object - keys are strings only
const obj: { [key: string]: number } = {};
obj["apple"] = 5;

// Map - keys can be any type
const map = new Map<number, string>();
map.set(1, "one");
map.set(2, "two");

// Map methods
map.has(1);        // true
map.get(1);        // "one"
map.delete(1);     // removes key 1
map.size;          // 1
map.clear();       // removes all

// Iteration
for (const [key, value] of map) {
    console.log(key, value);
}
```

### LeetCode: Contains Duplicate

**Problem**: Check if array has duplicates.

```typescript
function containsDuplicate(nums: number[]): boolean {
    const seen = new Set<number>();
    
    for (const num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    
    return false;
}

// Alternative with Map to track indices
function containsNearbyDuplicate(nums: number[], k: number): boolean {
    const indexMap = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        if (indexMap.has(nums[i])) {
            const prevIndex = indexMap.get(nums[i])!;
            if (i - prevIndex <= k) {
                return true;
            }
        }
        indexMap.set(nums[i], i);
    }
    
    return false;
}
```

### LeetCode: First Unique Character

**Problem**: Find first non-repeating character.

```typescript
function firstUniqChar(s: string): number {
    // Count frequency of each character
    const count = new Map<string, number>();
    
    for (const char of s) {
        count.set(char, (count.get(char) || 0) + 1);
    }
    
    // Find first character with count 1
    for (let i = 0; i < s.length; i++) {
        if (count.get(s[i]) === 1) {
            return i;
        }
    }
    
    return -1;
}

// Test
console.log(firstUniqChar("leetcode"));     // 0 (l)
console.log(firstUniqChar("loveleetcode")); // 2 (v)
console.log(firstUniqChar("aabb"));         // -1
```

---

## Day 13: Mini Review

### Key Patterns Review

**Pattern 1: Counting with Boolean Array**
```typescript
// When values are 1 to N
const seen = new Array(N + 1).fill(false);
```

**Pattern 2: Prefix Sum for Range Queries**
```typescript
// Build: O(N), Query: O(1)
const prefix = [0];
for (const num of arr) {
    prefix.push(prefix[prefix.length - 1] + num);
}
```

**Pattern 3: Hash Map for Frequency**
```typescript
const freq = new Map<number, number>();
for (const num of arr) {
    freq.set(num, (freq.get(num) || 0) + 1);
}
```

### Speed Practice Tasks

Redo these problems faster:

1. **MissingInteger** - Target: < 7 minutes
2. **FrogRiverOne** - Target: < 5 minutes
3. **GenomicRangeQuery** - Target: < 12 minutes

---

## Day 14: MOCK TEST (45 minutes)

### Test Conditions
- **Time Limit**: 45 minutes total
- **Target Score**: 70%+
- **No looking at solutions!**

### Problems

**Problem 1: OddOccurrencesInArray** (15 min)
**Problem 2: FrogRiverOne** (15 min)
**Problem 3: TapeEquilibrium** (15 min)

### After Test Checklist

✅ Did you handle edge cases?
✅ Did you test with sample inputs?
✅ Is your time complexity optimal?
✅ Did you check for off-by-one errors?
✅ Did you manage your time well?

---

## Week 2 Summary

### What You Learned
✅ Counting techniques (boolean arrays, hash maps)
✅ Prefix sums for range queries
✅ Hash map patterns and use cases
✅ Time management in tests

### Key Patterns Mastered

**1. Boolean Array Counting**
- Use for small, known ranges
- O(1) lookup, O(N) space

**2. Prefix Sum**
- Build once: O(N)
- Query any range: O(1)
- Essential for range sum problems

**3. Hash Map**
- Track frequencies: O(1) per operation
- Find complements: O(N) total
- Check existence: O(1)

### Most Important Takeaway

**Prefix sums are CRITICAL for Codility tests!**
- Appear in 30%+ of medium/hard problems
- GenomicRangeQuery pattern appears often
- Master this concept thoroughly

### Prepare for Week 3

Next week focuses on:
- Sorting algorithms and applications
- Greedy algorithms
- Basic math in DSA
- Second mock test!

Keep the momentum going! 🔥
