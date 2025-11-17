# Week 3: Sorting, Greedy & Basic Math

Focus: sort, compare, greedy patterns

---

## Day 15: Sorting Fundamentals

### Learning Objectives
- Master TypeScript sorting
- Understand when sorting helps
- Recognize sorting-based patterns

### TypeScript Sort

```typescript
// Numbers - ALWAYS provide comparator!
const numbers = [3, 1, 4, 1, 5, 9];

// WRONG - treats numbers as strings!
numbers.sort();  // [1, 1, 3, 4, 5, 9] - works by luck!
[10, 2, 8].sort();  // [10, 2, 8] - WRONG! Treats as strings

// RIGHT - ascending
numbers.sort((a, b) => a - b);  // [1, 1, 3, 4, 5, 9]

// RIGHT - descending
numbers.sort((a, b) => b - a);  // [9, 5, 4, 3, 1, 1]

// Strings - default sort works
const words = ["banana", "apple", "cherry"];
words.sort();  // ["apple", "banana", "cherry"]

// Objects - custom comparator
interface Person {
    name: string;
    age: number;
}

const people: Person[] = [
    { name: "John", age: 30 },
    { name: "Alice", age: 25 },
    { name: "Bob", age: 35 }
];

// Sort by age
people.sort((a, b) => a.age - b.age);

// Sort by name
people.sort((a, b) => a.name.localeCompare(b.name));

// Multi-level sort (by age, then by name)
people.sort((a, b) => {
    if (a.age !== b.age) {
        return a.age - b.age;
    }
    return a.name.localeCompare(b.name);
});
```

### When to Use Sorting

**Sorting helps when you need to:**
1. Find duplicates or unique elements
2. Find min/max k elements
3. Check for patterns (triangle inequality, etc.)
4. Pair elements optimally

### Codility Challenge 1: Distinct

**Problem**: Count unique elements in array.

**Example**:
```
Input:  [2, 1, 1, 2, 3, 1]
Output: 3 (unique values: 1, 2, 3)
```

**Solution 1 - Using Set** (Better):
```typescript
function solution(A: number[]): number {
    return new Set(A).size;
}
```
**Time**: O(n), **Space**: O(n)

**Solution 2 - Using Sorting**:
```typescript
function solution(A: number[]): number {
    if (A.length === 0) return 0;
    
    A.sort((a, b) => a - b);
    let count = 1;
    
    for (let i = 1; i < A.length; i++) {
        if (A[i] !== A[i - 1]) {
            count++;
        }
    }
    
    return count;
}
```
**Time**: O(n log n), **Space**: O(1)

### Codility Challenge 2: MaxProductOfThree

**Problem**: Find maximum product of any three elements.

**Example**:
```
Input:  [-3, 1, 2, -2, 5, 6]
Output: 60 ([-3, -2, 6] or [1, 5, 6]? Actually: 5 * 6 * 2 = 60)

Wait, let's recalculate:
[-3, -2, 6] = -3 * -2 * 6 = 36
[2, 5, 6] = 2 * 5 * 6 = 60 ✓
```

**Key Insight**: Maximum product can come from:
1. Three largest positive numbers
2. Two smallest negative numbers (their product is positive) × largest positive

**Solution**:
```typescript
function solution(A: number[]): number {
    A.sort((a, b) => a - b);
    const n = A.length;
    
    // Either:
    // 1. Three largest numbers
    // 2. Two smallest (most negative) × largest
    return Math.max(
        A[n-1] * A[n-2] * A[n-3],
        A[0] * A[1] * A[n-1]
    );
}

// Test cases
console.log(solution([-3, 1, 2, -2, 5, 6]));  // 60
console.log(solution([-5, -4, -3, -2, -1]));  // -6 (all negative)
console.log(solution([1, 2, 3]));              // 6
console.log(solution([-10, -10, 1, 3, 2]));   // 300 (two negatives!)
```

**Time**: O(n log n), **Space**: O(1)

---

## Day 16: Sorting II

### Codility Challenge: Triangle

**Problem**: Check if any three elements can form a triangle.

**Triangle Inequality**: For sides P, Q, R to form triangle:
- P + Q > R
- P + R > Q  
- Q + R > P

**Key Insight**: After sorting, if we have A[i] ≤ A[i+1] ≤ A[i+2], we only need to check:
- A[i] + A[i+1] > A[i+2]

(The other two inequalities are automatically satisfied!)

**Example**:
```
Input:  [10, 2, 5, 1, 8, 20]
After sort: [1, 2, 5, 8, 10, 20]

Check [1, 2, 5]: 1 + 2 = 3 > 5? No
Check [2, 5, 8]: 2 + 5 = 7 > 8? No
Check [5, 8, 10]: 5 + 8 = 13 > 10? Yes! ✓

Output: 1 (can form triangle)
```

**Solution**:
```typescript
function solution(A: number[]): number {
    if (A.length < 3) return 0;
    
    A.sort((a, b) => a - b);
    
    for (let i = 0; i < A.length - 2; i++) {
        // Check triangle inequality
        // Use BigInt for very large numbers to avoid overflow
        if (A[i] + A[i + 1] > A[i + 2]) {
            return 1;
        }
    }
    
    return 0;
}

// Test cases
console.log(solution([10, 2, 5, 1, 8, 20]));  // 1
console.log(solution([10, 50, 5, 1]));        // 0
console.log(solution([5, 3, 3]));             // 1
```

**Time**: O(n log n), **Space**: O(1)

**Edge Case - Integer Overflow**:
```typescript
// For very large numbers, use careful comparison
function solution(A: number[]): number {
    if (A.length < 3) return 0;
    
    A.sort((a, b) => a - b);
    
    for (let i = 0; i < A.length - 2; i++) {
        // Rearrange to avoid overflow: A[i] > A[i+2] - A[i+1]
        if (A[i] > A[i + 2] - A[i + 1]) {
            return 1;
        }
    }
    
    return 0;
}
```

### Advanced Challenge: NumberOfDiscIntersections (Optional)

**Problem**: Count intersections of discs on a plane.

**Example**:
```
Disc centers at: 0, 1, 2, 3, 4, 5
Radii:           1, 5, 2, 1, 4, 0

Disc 0: covers [-1, 1]
Disc 1: covers [-4, 6]
Disc 2: covers [0, 4]
...
```

**Solution** (Using sorting + two pointers):
```typescript
function solution(A: number[]): number {
    const n = A.length;
    const starts: number[] = [];
    const ends: number[] = [];
    
    // Calculate start and end points of each disc
    for (let i = 0; i < n; i++) {
        starts.push(i - A[i]);
        ends.push(i + A[i]);
    }
    
    starts.sort((a, b) => a - b);
    ends.sort((a, b) => a - b);
    
    let intersections = 0;
    let openDiscs = 0;
    let endIndex = 0;
    
    for (let i = 0; i < n; i++) {
        // Count how many discs were already open when this one starts
        while (endIndex < n && ends[endIndex] < starts[i]) {
            openDiscs--;
            endIndex++;
        }
        
        intersections += openDiscs;
        openDiscs++;
        
        if (intersections > 10000000) return -1;
    }
    
    return intersections;
}
```

---

## Day 17: Greedy Algorithms

### What is Greedy?

**Greedy Algorithm**: Make the locally optimal choice at each step, hoping to find global optimum.

**When does greedy work?**
- Problem has optimal substructure
- Greedy choice property (local optimum → global optimum)

### Classic Greedy Problems

**Example 1: Coin Change (Greedy works for specific coin systems)**
```typescript
// Works for standard coins: [1, 5, 10, 25]
function minCoins(amount: number, coins: number[]): number {
    coins.sort((a, b) => b - a);  // Sort descending
    let count = 0;
    
    for (const coin of coins) {
        count += Math.floor(amount / coin);
        amount %= coin;
    }
    
    return count;
}

console.log(minCoins(41, [1, 5, 10, 25]));  // 4 (25 + 10 + 5 + 1)
```

**Example 2: Activity Selection**
```typescript
interface Activity {
    start: number;
    end: number;
}

function maxActivities(activities: Activity[]): number {
    // Sort by end time (greedy choice!)
    activities.sort((a, b) => a.end - b.end);
    
    let count = 1;
    let lastEnd = activities[0].end;
    
    for (let i = 1; i < activities.length; i++) {
        if (activities[i].start >= lastEnd) {
            count++;
            lastEnd = activities[i].end;
        }
    }
    
    return count;
}
```

### Codility Challenge: TieRopes

**Problem**: Tie adjacent ropes to get maximum number of ropes with length ≥ K.

**Example**:
```
K = 4
A = [1, 2, 3, 4, 1, 1, 3]

Tie ropes:
[1, 2, 3] → length 6 ≥ 4 ✓ (rope 1)
[4] → length 4 ≥ 4 ✓ (rope 2)
[1, 1, 3] → length 5 ≥ 4 ✓ (rope 3)

Output: 3
```

**Greedy Strategy**: Tie ropes as soon as total length ≥ K.

**Solution**:
```typescript
function solution(K: number, A: number[]): number {
    let count = 0;
    let currentLength = 0;
    
    for (const rope of A) {
        currentLength += rope;
        
        if (currentLength >= K) {
            count++;
            currentLength = 0;  // Start new rope
        }
    }
    
    return count;
}

// Test cases
console.log(solution(4, [1, 2, 3, 4, 1, 1, 3]));  // 3
console.log(solution(5, [1, 2, 3, 4, 5]));        // 2
console.log(solution(10, [1, 1, 1]));             // 0
```

**Time**: O(n), **Space**: O(1)

**Why Greedy Works Here?**
- We want maximum count
- Tying early doesn't prevent us from tying later
- No benefit to waiting if we already have ≥ K

---

## Day 18: Simple Math in DSA

### Division with Edge Cases

**Codility Challenge: CountDiv**

**Problem**: Count integers divisible by K in range [A, B].

**Example**:
```
A = 6, B = 11, K = 2
Divisible by 2: 6, 8, 10
Output: 3
```

**Naive Solution** (Too slow for large ranges):
```typescript
function solution(A: number, B: number, K: number): number {
    let count = 0;
    for (let i = A; i <= B; i++) {
        if (i % K === 0) count++;
    }
    return count;
}
// Time: O(B - A) - can be 2 billion operations!
```

**Optimal Solution** (Math formula):
```typescript
function solution(A: number, B: number, K: number): number {
    // Count of multiples from 0 to B minus count from 0 to A-1
    const countUpToB = Math.floor(B / K);
    const countUpToA = Math.floor((A - 1) / K);
    
    return countUpToB - countUpToA;
}

// Alternative cleaner version
function solution(A: number, B: number, K: number): number {
    // Find first multiple >= A
    const firstMultiple = Math.ceil(A / K) * K;
    
    // If first multiple > B, no multiples in range
    if (firstMultiple > B) return 0;
    
    // Count from first multiple to B
    return Math.floor((B - firstMultiple) / K) + 1;
}

// Test cases
console.log(solution(6, 11, 2));   // 3
console.log(solution(11, 345, 17)); // 20
console.log(solution(0, 1, 11));    // 1 (0 is divisible by any number)
console.log(solution(10, 10, 5));   // 1
console.log(solution(10, 10, 7));   // 0
```

**Time**: O(1), **Space**: O(1)

### Codility Challenge: PassingCars

**Problem**: Count pairs of cars passing each other.

**Example**:
```
A = [0, 1, 0, 1, 1]
     E  W  E  W  W

Eastbound car 0 passes westbound cars 1, 3, 4 → 3 pairs
Eastbound car 2 passes westbound cars 3, 4 → 2 pairs

Total: 5 pairs
```

**Solution**:
```typescript
function solution(A: number[]): number {
    let eastbound = 0;  // Count of cars going east so far
    let pairs = 0;
    
    for (const car of A) {
        if (car === 0) {
            // Car going east
            eastbound++;
        } else {
            // Car going west - pairs with all eastbound cars
            pairs += eastbound;
            
            // Check for overflow
            if (pairs > 1000000000) {
                return -1;
            }
        }
    }
    
    return pairs;
}

// Test cases
console.log(solution([0, 1, 0, 1, 1]));  // 5
console.log(solution([0, 0, 1, 1]));     // 4
console.log(solution([1, 1, 0, 0]));     // 0
```

**Time**: O(n), **Space**: O(1)

---

## Day 19: Extra Sorting Practice

### LeetCode: Merge Sorted Array

**Problem**: Merge two sorted arrays in-place.

**Example**:
```
nums1 = [1, 2, 3, 0, 0, 0], m = 3
nums2 = [2, 5, 6], n = 3

Output: nums1 = [1, 2, 2, 3, 5, 6]
```

**Solution** (Fill from back to avoid overwriting):
```typescript
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
    let i = m - 1;      // Last element of nums1
    let j = n - 1;      // Last element of nums2
    let k = m + n - 1;  // Last position in merged array
    
    // Fill from back to front
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) {
            nums1[k] = nums1[i];
            i--;
        } else {
            nums1[k] = nums2[j];
            j--;
        }
        k--;
    }
}

// Test
const nums1 = [1, 2, 3, 0, 0, 0];
merge(nums1, 3, [2, 5, 6], 3);
console.log(nums1);  // [1, 2, 2, 3, 5, 6]
```

**Time**: O(m + n), **Space**: O(1)

### LeetCode: Sort Colors (Dutch National Flag)

**Problem**: Sort array with only 0s, 1s, and 2s.

**Example**:
```
Input:  [2, 0, 2, 1, 1, 0]
Output: [0, 0, 1, 1, 2, 2]
```

**Solution** (One-pass with three pointers):
```typescript
function sortColors(nums: number[]): void {
    let low = 0;           // Boundary for 0s
    let mid = 0;           // Current element
    let high = nums.length - 1;  // Boundary for 2s
    
    while (mid <= high) {
        if (nums[mid] === 0) {
            // Swap with low boundary
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            // Already in correct region
            mid++;
        } else {
            // nums[mid] === 2
            // Swap with high boundary
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
            // Don't increment mid - need to check swapped element
        }
    }
}

// Test
const colors = [2, 0, 2, 1, 1, 0];
sortColors(colors);
console.log(colors);  // [0, 0, 1, 1, 2, 2]
```

**Time**: O(n), **Space**: O(1)

---

## Day 20: Review

### Key Sorting Patterns

**Pattern 1: Count Unique Elements**
```typescript
// Use Set
new Set(array).size

// OR sort and count changes
array.sort((a, b) => a - b);
let count = 1;
for (let i = 1; i < array.length; i++) {
    if (array[i] !== array[i-1]) count++;
}
```

**Pattern 2: Find K Largest/Smallest**
```typescript
// Sort and take first/last k
array.sort((a, b) => a - b);
const smallest = array.slice(0, k);
const largest = array.slice(-k);
```

**Pattern 3: Pair/Triple Products**
```typescript
// Sort and check extremes
array.sort((a, b) => a - b);
// Check: largest × largest × largest
// vs: smallest × smallest × largest
```

**Pattern 4: Greedy Selection**
```typescript
// Sort by the metric you care about
items.sort((a, b) => a.value - b.value);
// Then greedily select
```

### Speed Practice

Redo these problems for speed:

1. **Distinct** - Target: < 3 minutes
2. **MaxProductOfThree** - Target: < 5 minutes
3. **Triangle** - Target: < 5 minutes

---

## Day 21: MOCK TEST (60 minutes)

### Test Conditions
- **Time Limit**: 60 minutes total
- **Target Score**: 75%+
- **No external help!**

### Problems

**Problem 1: Distinct** (15 min)
**Problem 2: MaxProductOfThree** (20 min)
**Problem 3: FrogRiverOne** (25 min - from Week 2)

### Self-Evaluation

After completing the test, check:

✅ **Correctness**
- Did all test cases pass?
- Did you handle edge cases?

✅ **Performance**
- Is your solution optimal?
- Did you avoid unnecessary loops?

✅ **Code Quality**
- Is your code readable?
- Did you use meaningful variable names?

✅ **Time Management**
- Did you finish in time?
- Did you get stuck on any problem?

---

## Week 3 Summary

### What You Learned
✅ Sorting in TypeScript (with proper comparators!)
✅ When sorting helps solve problems
✅ Greedy algorithm patterns
✅ Mathematical optimization (CountDiv)
✅ Counting pairs efficiently (PassingCars)

### Key Patterns Mastered

**1. Sort Before Processing**
- Distinct elements
- Find extremes for products
- Triangle inequality

**2. Greedy Choices**
- Make optimal local choice
- Works when local → global optimum
- TieRopes pattern

**3. Math Over Iteration**
- CountDiv: O(1) vs O(n)
- Use formulas when possible
- Watch for integer overflow

### Common Mistakes to Avoid

❌ **Sorting numbers without comparator**
```typescript
[10, 2, 8].sort();  // WRONG! Returns [10, 2, 8]
[10, 2, 8].sort((a, b) => a - b);  // RIGHT! Returns [2, 8, 10]
```

❌ **Not considering negative numbers**
```typescript
// MaxProductOfThree: need to check both:
// - three largest
// - two smallest (negative) × largest
```

❌ **Integer overflow**
```typescript
// Triangle: A[i] + A[i+1] might overflow
// Better: A[i] > A[i+2] - A[i+1]
```

### Prepare for Week 4

Next week is **MAJOR** - Stacks, Queues, and Leaders!
- StoneWall (very common in interviews!)
- Fish (stack simulation)
- Dominator (Boyer-Moore algorithm)

This is one of the most important weeks. Get ready! 🔥
