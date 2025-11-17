# Week 1: Foundations (TypeScript + Basic DSA)

Focus: loops, arrays, functions, time complexity

---

## Day 1: TypeScript Language Basics

### Learning Objectives
- Master TypeScript functions, arrays, and objects
- Understand for/while loops
- Practice array manipulations

### Core Concepts

#### 1. Functions in TypeScript
```typescript
// Basic function
function add(a: number, b: number): number {
    return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Function with array parameter
function sumArray(arr: number[]): number {
    let sum = 0;
    for (let num of arr) {
        sum += num;
    }
    return sum;
}
```

#### 2. Arrays & Objects
```typescript
// Array declaration
const numbers: number[] = [1, 2, 3, 4, 5];

// Array methods
numbers.push(6);           // Add to end
numbers.pop();             // Remove from end
numbers.shift();           // Remove from start
numbers.unshift(0);        // Add to start

// Object
interface Person {
    name: string;
    age: number;
}

const user: Person = {
    name: "John",
    age: 25
};
```

#### 3. Loops
```typescript
// For loop
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

// For...of loop (recommended for arrays)
for (const item of arr) {
    console.log(item);
}

// While loop
let i = 0;
while (i < arr.length) {
    console.log(arr[i]);
    i++;
}
```

### Practice Tasks (10 Array Manipulations)

#### Task 1: Reverse Array
```typescript
function reverseArray(arr: number[]): number[] {
    const result: number[] = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        result.push(arr[i]);
    }
    return result;
}

// Test
console.log(reverseArray([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]
```

#### Task 2: Find Maximum
```typescript
function findMax(arr: number[]): number {
    if (arr.length === 0) throw new Error("Empty array");
    
    let max = arr[0];
    for (const num of arr) {
        if (num > max) {
            max = num;
        }
    }
    return max;
}

// Test
console.log(findMax([3, 7, 2, 9, 1])); // 9
```

#### Task 3: Count Even Numbers
```typescript
function countEven(arr: number[]): number {
    let count = 0;
    for (const num of arr) {
        if (num % 2 === 0) {
            count++;
        }
    }
    return count;
}

// Test
console.log(countEven([1, 2, 3, 4, 5, 6])); // 3
```

#### Task 4: Sum of Elements
```typescript
function sumArray(arr: number[]): number {
    let sum = 0;
    for (const num of arr) {
        sum += num;
    }
    return sum;
}

// Test
console.log(sumArray([1, 2, 3, 4, 5])); // 15
```

#### Task 5: Filter Positive Numbers
```typescript
function filterPositive(arr: number[]): number[] {
    const result: number[] = [];
    for (const num of arr) {
        if (num > 0) {
            result.push(num);
        }
    }
    return result;
}

// Test
console.log(filterPositive([-1, 2, -3, 4, 5])); // [2, 4, 5]
```

#### Task 6: Double Each Element
```typescript
function doubleElements(arr: number[]): number[] {
    const result: number[] = [];
    for (const num of arr) {
        result.push(num * 2);
    }
    return result;
}

// Test
console.log(doubleElements([1, 2, 3, 4])); // [2, 4, 6, 8]
```

#### Task 7: Find Index of Element
```typescript
function findIndex(arr: number[], target: number): number {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}

// Test
console.log(findIndex([10, 20, 30, 40], 30)); // 2
console.log(findIndex([10, 20, 30, 40], 50)); // -1
```

#### Task 8: Check if Array Contains Element
```typescript
function contains(arr: number[], target: number): boolean {
    for (const num of arr) {
        if (num === target) {
            return true;
        }
    }
    return false;
}

// Test
console.log(contains([1, 2, 3, 4, 5], 3)); // true
console.log(contains([1, 2, 3, 4, 5], 6)); // false
```

#### Task 9: Get First N Elements
```typescript
function firstN(arr: number[], n: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < Math.min(n, arr.length); i++) {
        result.push(arr[i]);
    }
    return result;
}

// Test
console.log(firstN([1, 2, 3, 4, 5], 3)); // [1, 2, 3]
```

#### Task 10: Remove Duplicates (Simple)
```typescript
function removeDuplicates(arr: number[]): number[] {
    const result: number[] = [];
    for (const num of arr) {
        if (!contains(result, num)) {
            result.push(num);
        }
    }
    return result;
}

// Test
console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]
```

---

## Day 2: Big-O (Beginner Level)

### Learning Objectives
- Understand time complexity notation
- Recognize O(n), O(n²), O(log n)
- Identify slow vs fast solutions

### Core Concepts

#### What is Big-O?
Big-O describes how running time grows as input size increases.

#### Common Complexities

**O(1) - Constant Time**
```typescript
function getFirst(arr: number[]): number {
    return arr[0];  // Always 1 operation, regardless of array size
}
```

**O(n) - Linear Time**
```typescript
function findSum(arr: number[]): number {
    let sum = 0;
    for (const num of arr) {  // n operations
        sum += num;
    }
    return sum;
}
```

**O(n²) - Quadratic Time**
```typescript
function printPairs(arr: number[]): void {
    for (let i = 0; i < arr.length; i++) {      // n times
        for (let j = 0; j < arr.length; j++) {  // n times each
            console.log(arr[i], arr[j]);
        }
    }
    // Total: n * n = n² operations
}
```

**O(log n) - Logarithmic Time**
```typescript
function binarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;
}
// Each iteration cuts search space in half
```

#### Comparison Chart
```
n = 100 elements

O(1):       1 operation
O(log n):   ~7 operations
O(n):       100 operations
O(n log n): ~664 operations
O(n²):      10,000 operations
O(2^n):     1,267,650,600,228,229,401,496,703,205,376 operations 😱
```

### Codility Challenge: BinaryGap

**Problem**: Find the longest sequence of consecutive zeros in binary representation of an integer.

**Example**:
- Input: 9 (binary: 1001)
- Output: 2 (gap between the two 1's)

**Solution**:
```typescript
function solution(N: number): number {
    // Convert to binary string
    const binary = N.toString(2);
    
    let maxGap = 0;
    let currentGap = 0;
    let foundOne = false;
    
    for (const char of binary) {
        if (char === '1') {
            // If we found a 1, update max gap
            if (foundOne) {
                maxGap = Math.max(maxGap, currentGap);
            }
            foundOne = true;
            currentGap = 0;
        } else if (foundOne) {
            // Count zeros only after finding first 1
            currentGap++;
        }
    }
    
    return maxGap;
}

// Test cases
console.log(solution(9));      // 2 (1001)
console.log(solution(529));    // 4 (1000010001)
console.log(solution(20));     // 1 (10100)
console.log(solution(15));     // 0 (1111)
console.log(solution(1041));   // 5 (10000010001)
```

**Time Complexity**: O(log N) - we process each bit once
**Space Complexity**: O(log N) - binary string storage

---

## Day 3: Arrays I

### Codility Challenge 1: OddOccurrencesInArray

**Problem**: Find the value that occurs an odd number of times in an array where every other value occurs an even number of times.

**Example**:
```
Input:  [9, 3, 9, 3, 9, 7, 9]
Output: 7
```

**Solution Approach 1 - Using Hash Map** (O(n) time, O(n) space):
```typescript
function solution(A: number[]): number {
    const counts = new Map<number, number>();
    
    // Count occurrences
    for (const num of A) {
        counts.set(num, (counts.get(num) || 0) + 1);
    }
    
    // Find the one with odd count
    for (const [num, count] of counts.entries()) {
        if (count % 2 === 1) {
            return num;
        }
    }
    
    return 0;  // Should never reach here based on problem constraints
}
```

**Solution Approach 2 - XOR Trick** (O(n) time, O(1) space):
```typescript
function solution(A: number[]): number {
    let result = 0;
    
    // XOR all elements
    // Same numbers cancel out (a XOR a = 0)
    // Only the odd occurrence remains
    for (const num of A) {
        result ^= num;
    }
    
    return result;
}

// How XOR works:
// 9 ^ 3 ^ 9 ^ 3 ^ 9 ^ 7 ^ 9
// = (9 ^ 9) ^ (3 ^ 3) ^ (9 ^ 9) ^ 7
// = 0 ^ 0 ^ 0 ^ 7
// = 7
```

### Codility Challenge 2: CyclicRotation

**Problem**: Rotate array to the right by K steps.

**Example**:
```
Input:  A = [3, 8, 9, 7, 6], K = 3
Output: [9, 7, 6, 3, 8]
```

**Solution**:
```typescript
function solution(A: number[], K: number): number[] {
    if (A.length === 0) return A;
    
    // Optimize K (rotating by length brings back to original)
    K = K % A.length;
    
    if (K === 0) return A;
    
    // Take last K elements and put them at the front
    return [...A.slice(-K), ...A.slice(0, -K)];
}

// Test cases
console.log(solution([3, 8, 9, 7, 6], 3));  // [9, 7, 6, 3, 8]
console.log(solution([1, 2, 3, 4], 4));     // [1, 2, 3, 4] (full rotation)
console.log(solution([], 1));                // []
```

**Alternative Solution (In-place)**:
```typescript
function solution(A: number[], K: number): number[] {
    if (A.length === 0) return A;
    K = K % A.length;
    
    // Reverse entire array
    reverse(A, 0, A.length - 1);
    // Reverse first K elements
    reverse(A, 0, K - 1);
    // Reverse remaining elements
    reverse(A, K, A.length - 1);
    
    return A;
}

function reverse(A: number[], start: number, end: number): void {
    while (start < end) {
        [A[start], A[end]] = [A[end], A[start]];
        start++;
        end--;
    }
}
```

---

## Day 4: Arrays II (LeetCode Practice)

### Challenge 1: Two Sum

**Problem**: Find two numbers that add up to a target.

**Example**:
```
Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]  (nums[0] + nums[1] = 2 + 7 = 9)
```

**Solution**:
```typescript
function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (seen.has(complement)) {
            return [seen.get(complement)!, i];
        }
        
        seen.set(nums[i], i);
    }
    
    return [];
}
```

**Time Complexity**: O(n)
**Space Complexity**: O(n)

### Challenge 2: Remove Duplicates from Sorted Array

**Problem**: Remove duplicates in-place, return new length.

**Example**:
```
Input:  [1, 1, 2, 2, 3]
Output: 3 (array becomes [1, 2, 3, _, _])
```

**Solution**:
```typescript
function removeDuplicates(nums: number[]): number {
    if (nums.length === 0) return 0;
    
    let writeIndex = 1;  // Position to write next unique element
    
    for (let readIndex = 1; readIndex < nums.length; readIndex++) {
        if (nums[readIndex] !== nums[readIndex - 1]) {
            nums[writeIndex] = nums[readIndex];
            writeIndex++;
        }
    }
    
    return writeIndex;
}
```

**Time Complexity**: O(n)
**Space Complexity**: O(1)

---

## Day 5: Edge Cases

### Codility Challenge 1: TapeEquilibrium

**Problem**: Minimize the difference between two parts when splitting an array.

**Example**:
```
Input:  [3, 1, 2, 4, 3]
Output: 1

Explanation:
Split at position 1: |3 - 1| - (2 + 4 + 3)| = |3 - 9| = 6
Split at position 2: |3 + 1 - (2 + 4 + 3)| = |4 - 9| = 5
Split at position 3: |3 + 1 + 2 - (4 + 3)| = |6 - 7| = 1  ← minimum
Split at position 4: |3 + 1 + 2 + 4 - 3| = |10 - 3| = 7
```

**Solution**:
```typescript
function solution(A: number[]): number {
    // Calculate total sum
    let totalSum = 0;
    for (const num of A) {
        totalSum += num;
    }
    
    let leftSum = 0;
    let minDiff = Infinity;
    
    // Try each split point (can't split at the end)
    for (let i = 0; i < A.length - 1; i++) {
        leftSum += A[i];
        const rightSum = totalSum - leftSum;
        const diff = Math.abs(leftSum - rightSum);
        
        minDiff = Math.min(minDiff, diff);
    }
    
    return minDiff;
}
```

### Codility Challenge 2: PermMissingElem

**Problem**: Find the missing element in a permutation.

**Example**:
```
Input:  [2, 3, 1, 5]
Output: 4
```

**Solution 1 - Sum Formula**:
```typescript
function solution(A: number[]): number {
    const n = A.length + 1;
    
    // Sum of 1 to n = n * (n + 1) / 2
    const expectedSum = n * (n + 1) / 2;
    
    let actualSum = 0;
    for (const num of A) {
        actualSum += num;
    }
    
    return expectedSum - actualSum;
}
```

**Solution 2 - XOR**:
```typescript
function solution(A: number[]): number {
    let xor = 0;
    
    // XOR all array elements
    for (const num of A) {
        xor ^= num;
    }
    
    // XOR with all numbers from 1 to n+1
    for (let i = 1; i <= A.length + 1; i++) {
        xor ^= i;
    }
    
    return xor;
}
```

### Edge Cases to Always Consider

1. **Empty array**: `[]`
2. **Single element**: `[5]`
3. **All same elements**: `[1, 1, 1, 1]`
4. **Negative numbers**: `[-5, -3, -1]`
5. **Zero**: `[0, 1, 2]`
6. **Very large/small values**: `[1000000, -1000000]`
7. **Maximum constraints**: Array of size 100,000

---

## Day 6: Review + Fix Weakness

### Review Checklist

✅ **TypeScript Fundamentals**
- Can you write functions with proper types?
- Do you understand array methods?
- Are you comfortable with loops?

✅ **Big-O Understanding**
- Can you identify O(1), O(n), O(n²) code?
- Do you know when code is too slow?

✅ **Array Skills**
- Can you iterate arrays efficiently?
- Do you handle edge cases?
- Can you manipulate arrays without errors?

### Practice Tasks (Redo for Speed)

1. **BinaryGap** - Target: < 5 minutes
2. **OddOccurrencesInArray** - Target: < 3 minutes
3. **CyclicRotation** - Target: < 5 minutes
4. **TapeEquilibrium** - Target: < 7 minutes

### Common Mistakes to Fix

❌ **Off-by-one errors**
```typescript
// WRONG
for (let i = 0; i <= arr.length; i++)  // Will go out of bounds!

// RIGHT
for (let i = 0; i < arr.length; i++)
```

❌ **Not handling empty arrays**
```typescript
// WRONG
function getMax(arr: number[]): number {
    let max = arr[0];  // Error if arr is empty!
    ...
}

// RIGHT
function getMax(arr: number[]): number {
    if (arr.length === 0) return -1;  // or throw error
    let max = arr[0];
    ...
}
```

❌ **Inefficient nested loops when not needed**
```typescript
// WRONG - O(n²)
function hasDuplicate(arr: number[]): boolean {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) return true;
        }
    }
    return false;
}

// RIGHT - O(n)
function hasDuplicate(arr: number[]): boolean {
    const seen = new Set<number>();
    for (const num of arr) {
        if (seen.has(num)) return true;
        seen.add(num);
    }
    return false;
}
```

---

## Day 7: REST

Take a break! You've earned it.

**Recommended activities:**
- Review your notes
- Watch coding interview videos
- Read about algorithms (no heavy coding)
- Plan for Week 2

---

## Week 1 Summary

### What You Learned
✅ TypeScript basics (functions, arrays, loops)
✅ Time complexity (Big-O notation)
✅ Array manipulation techniques
✅ Edge case handling
✅ Problem-solving patterns

### Key Takeaways
1. **Always consider edge cases** (empty, single element, duplicates)
2. **Think about time complexity** before coding
3. **Use hash maps** for O(1) lookups
4. **XOR trick** for finding odd occurrences
5. **Sum formula** for finding missing elements

### Prepare for Week 2
Next week focuses on:
- Counting elements
- Prefix sums (very important!)
- Hash maps in depth
- Your first mock test!

Keep practicing and stay consistent! 🚀
