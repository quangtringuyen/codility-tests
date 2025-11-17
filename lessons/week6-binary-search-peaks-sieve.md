# Week 6: Binary Search, Peaks, Flags, Sieve

Focus: harder Codility topics

---

## Day 36: Binary Search

### Learning Objectives
- Master binary search algorithm
- Apply binary search to optimization problems
- Recognize when binary search helps

### Binary Search Basics

**Binary Search**: Find element in sorted array in O(log n) time.

**How it works**: Repeatedly divide search space in half.

```typescript
function binarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;  // Found!
        }
        
        if (arr[mid] < target) {
            left = mid + 1;  // Search right half
        } else {
            right = mid - 1;  // Search left half
        }
    }
    
    return -1;  // Not found
}

// Test
const sorted = [1, 3, 5, 7, 9, 11, 13];
console.log(binarySearch(sorted, 7));   // 3
console.log(binarySearch(sorted, 10));  // -1
```

**Time**: O(log n), **Space**: O(1)

### Binary Search Variants

**Find First Occurrence**:
```typescript
function findFirst(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            result = mid;
            right = mid - 1;  // Continue searching left
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}
```

**Find Last Occurrence**:
```typescript
function findLast(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            result = mid;
            left = mid + 1;  // Continue searching right
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}
```

### Binary Search on Answer

**Pattern**: When answer is in range [min, max], binary search on possible answers.

**Example**: Minimum Maximum Problem

```typescript
// Can we divide array into K parts where max sum ≤ mid?
function canDivide(arr: number[], K: number, maxSum: number): boolean {
    let parts = 1;
    let currentSum = 0;
    
    for (const num of arr) {
        if (num > maxSum) return false;
        
        if (currentSum + num > maxSum) {
            parts++;
            currentSum = num;
            
            if (parts > K) return false;
        } else {
            currentSum += num;
        }
    }
    
    return true;
}

function minMaxSum(arr: number[], K: number): number {
    let left = Math.max(...arr);  // Minimum possible max
    let right = arr.reduce((a, b) => a + b);  // Maximum possible max
    let result = right;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (canDivide(arr, K, mid)) {
            result = mid;
            right = mid - 1;  // Try smaller max
        } else {
            left = mid + 1;
        }
    }
    
    return result;
}
```

### Codility: MinMaxDivision (Optional)

**Problem**: Divide array into K blocks minimizing largest sum.

**Solution**: Binary search on the answer!

```typescript
function solution(K: number, M: number, A: number[]): number {
    // Binary search on minimum possible largest sum
    let left = Math.max(...A);  // At least max element
    let right = A.reduce((a, b) => a + b);  // At most total sum
    let result = right;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (canDivide(A, K, mid)) {
            result = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    
    return result;
}

function canDivide(A: number[], K: number, maxSum: number): boolean {
    let blocks = 1;
    let currentSum = 0;
    
    for (const num of A) {
        if (currentSum + num > maxSum) {
            blocks++;
            currentSum = num;
            
            if (blocks > K) return false;
        } else {
            currentSum += num;
        }
    }
    
    return true;
}
```

---

## Day 37: Sieve of Eratosthenes

### Prime Numbers

**Prime**: Number > 1 divisible only by 1 and itself.

**Examples**:
- Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23...
- Not primes: 4, 6, 8, 9, 10, 12, 14, 15, 16...

### Naive Prime Check

```typescript
function isPrime(n: number): boolean {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    // Check odd divisors up to √n
    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) return false;
    }
    
    return true;
}

// Time: O(√n)
```

### Sieve of Eratosthenes

**Find all primes up to N efficiently**:

```typescript
function sieve(n: number): boolean[] {
    // isPrime[i] = true if i is prime
    const isPrime = new Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;
    
    for (let i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            // Mark all multiples of i as not prime
            for (let j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    return isPrime;
}

// Get list of prime numbers
function getPrimes(n: number): number[] {
    const isPrime = sieve(n);
    const primes: number[] = [];
    
    for (let i = 2; i <= n; i++) {
        if (isPrime[i]) {
            primes.push(i);
        }
    }
    
    return primes;
}

console.log(getPrimes(30));
// [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

**Time**: O(n log log n), **Space**: O(n)

### Codility Challenge: CountFactors

**Problem**: Count divisors of N.

**Example**:
```
N = 24
Divisors: 1, 2, 3, 4, 6, 8, 12, 24
Count: 8
```

**Solution**:
```typescript
function solution(N: number): number {
    let count = 0;
    let i = 1;
    
    // Check divisors up to √N
    while (i * i < N) {
        if (N % i === 0) {
            count += 2;  // Both i and N/i are divisors
        }
        i++;
    }
    
    // Check if N is perfect square
    if (i * i === N) {
        count++;  // √N is a divisor
    }
    
    return count;
}

// Test cases
console.log(solution(24));  // 8
console.log(solution(1));   // 1
console.log(solution(16));  // 5 (1, 2, 4, 8, 16)
```

**Time**: O(√N), **Space**: O(1)

### Codility Challenge: CountSemiprimes

**Problem**: Count semiprimes in ranges.

**Semiprime**: Product of exactly two primes (not necessarily distinct).
- Examples: 4 (2×2), 6 (2×3), 9 (3×3), 10 (2×5), 15 (3×5)

**Solution**:
```typescript
function solution(N: number, P: number[], Q: number[]): number[] {
    // Find all primes up to N
    const isPrime = sieve(N);
    
    // Mark semiprimes
    const isSemiprime = new Array(N + 1).fill(false);
    
    for (let i = 2; i * i <= N; i++) {
        if (isPrime[i]) {
            for (let j = i; i * j <= N; j++) {
                if (isPrime[j]) {
                    isSemiprime[i * j] = true;
                }
            }
        }
    }
    
    // Build prefix sum for counting
    const prefix = new Array(N + 1).fill(0);
    for (let i = 1; i <= N; i++) {
        prefix[i] = prefix[i - 1] + (isSemiprime[i] ? 1 : 0);
    }
    
    // Answer queries
    const result: number[] = [];
    for (let i = 0; i < P.length; i++) {
        result.push(prefix[Q[i]] - prefix[P[i] - 1]);
    }
    
    return result;
}

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

## Day 38: Peaks

### Codility Challenge: Peaks

**Problem**: Divide array into equal blocks where each block contains a peak.

**Peak**: Element larger than neighbors
- `A[i]` is peak if `A[i-1] < A[i] > A[i+1]`

**Example**:
```
A = [1, 2, 3, 4, 3, 4, 1, 2, 3, 4, 6, 2]

Peaks at indices: 3, 5, 10
                  ↑  ↑   ↑
              
Can we divide into 3 blocks of size 4?
Block 1 [0..3]: has peak at 3 ✓
Block 2 [4..7]: has peak at 5 ✓
Block 3 [8..11]: has peak at 10 ✓

Answer: 3 (maximum blocks)
```

**Solution**:
```typescript
function solution(A: number[]): number {
    const n = A.length;
    if (n < 3) return 0;
    
    // Find all peaks
    const peaks: number[] = [];
    for (let i = 1; i < n - 1; i++) {
        if (A[i] > A[i - 1] && A[i] > A[i + 1]) {
            peaks.push(i);
        }
    }
    
    if (peaks.length === 0) return 0;
    
    // Try each possible number of blocks
    // Number of blocks must divide n evenly
    for (let numBlocks = peaks.length; numBlocks >= 1; numBlocks--) {
        if (n % numBlocks !== 0) continue;
        
        const blockSize = n / numBlocks;
        let validBlocks = 0;
        let nextPeak = 0;
        
        // Check if each block has at least one peak
        for (let block = 0; block < numBlocks; block++) {
            const blockStart = block * blockSize;
            const blockEnd = blockStart + blockSize;
            
            // Skip peaks before this block
            while (nextPeak < peaks.length && peaks[nextPeak] < blockStart) {
                nextPeak++;
            }
            
            // Check if there's a peak in this block
            if (nextPeak < peaks.length && peaks[nextPeak] < blockEnd) {
                validBlocks++;
            }
        }
        
        // If all blocks have peaks, we found answer
        if (validBlocks === numBlocks) {
            return numBlocks;
        }
    }
    
    return 0;
}

// Test cases
console.log(solution([1, 2, 3, 4, 3, 4, 1, 2, 3, 4, 6, 2]));  // 3
console.log(solution([1, 2, 1, 2, 1]));  // 3
console.log(solution([1, 2, 3]));        // 0
```

**Time**: O(n log n), **Space**: O(n)

---

## Day 39: Flags ⭐ VERY COMMON!

### Codility Challenge: Flags

**Problem**: Place maximum flags on peaks with distance ≥ K between flags, where K = number of flags.

**Constraint**: Distance between any two flags ≥ K (where K is the number of flags you're placing)

**Example**:
```
A = [1, 5, 3, 4, 3, 4, 1, 2, 3, 4, 6, 2]
Peaks at: 1, 3, 5, 10

Try K=3 flags:
- Place flag at peak 1
- Next flag must be ≥ 3 positions away → peak 5 (distance = 4) ✓
- Next flag must be ≥ 3 positions away → peak 10 (distance = 5) ✓
- Placed 3 flags! ✓

Try K=4 flags:
- Place flag at peak 1
- Next must be ≥ 4 away → peak 5 (distance = 4) ✓
- Next must be ≥ 4 away → peak 10 (distance = 5) ✓
- Only placed 3 flags, but need 4 ✗

Maximum: 3 flags
```

**Solution**:
```typescript
function solution(A: number[]): number {
    const n = A.length;
    if (n < 3) return 0;
    
    // Find all peaks
    const peaks: number[] = [];
    for (let i = 1; i < n - 1; i++) {
        if (A[i] > A[i - 1] && A[i] > A[i + 1]) {
            peaks.push(i);
        }
    }
    
    if (peaks.length <= 1) return peaks.length;
    
    // Maximum possible flags: √distance between first and last peak
    const maxFlags = Math.floor(Math.sqrt(peaks[peaks.length - 1] - peaks[0])) + 1;
    
    // Try each possible number of flags (starting from max)
    for (let K = Math.min(maxFlags, peaks.length); K >= 1; K--) {
        let flagsPlaced = 0;
        let lastFlag = -Infinity;
        
        for (const peak of peaks) {
            if (peak >= lastFlag + K) {
                flagsPlaced++;
                lastFlag = peak;
                
                if (flagsPlaced === K) {
                    return K;  // Found it!
                }
            }
        }
    }
    
    return 0;
}

// Test cases
console.log(solution([1, 5, 3, 4, 3, 4, 1, 2, 3, 4, 6, 2]));  // 3
console.log(solution([1, 2, 1, 2, 1, 2, 1]));  // 3
console.log(solution([1, 2, 3, 4, 5]));        // 0 (no peaks)
```

**Time**: O(n), **Space**: O(n)

**Why √distance**: If we have flags at distance K apart, we can place ~distance/K flags. When distance/K = K, then K = √distance.

---

## Day 40: Rectangle / Geometry

### Codility: MinPerimeterRectangle

**Problem**: Find minimal perimeter of rectangle with area N.

**Example**:
```
N = 30
Rectangles:
1 × 30: perimeter = 62
2 × 15: perimeter = 34
3 × 10: perimeter = 26
5 × 6:  perimeter = 22 ← minimum!
```

**Solution**:
```typescript
function solution(N: number): number {
    let minPerimeter = Infinity;
    let i = 1;
    
    while (i * i <= N) {
        if (N % i === 0) {
            const width = i;
            const height = N / i;
            const perimeter = 2 * (width + height);
            
            minPerimeter = Math.min(minPerimeter, perimeter);
        }
        i++;
    }
    
    return minPerimeter;
}

// Test cases
console.log(solution(30));  // 22
console.log(solution(36));  // 24 (6×6)
console.log(solution(1));   // 4
```

**Time**: O(√N), **Space**: O(1)

### Codility: ChocolatesByNumbers

**Problem**: X chocolates in circle. Eat every Mth. How many until you eat one you've eaten?

**Example**:
```
N = 10, M = 4

Chocolates: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9

Eat: 0 → 4 → 8 → 2 → 6 → 0 (stop!)
Count: 5
```

**Key Insight**: Answer = N / GCD(N, M)

**Solution**:
```typescript
function solution(N: number, M: number): number {
    return N / gcd(N, M);
}

function gcd(a: number, b: number): number {
    if (b === 0) return a;
    return gcd(b, a % b);
}

// Test cases
console.log(solution(10, 4));  // 5
console.log(solution(10, 3));  // 10
console.log(solution(947, 4228));  // 947
```

**Time**: O(log(min(N, M))), **Space**: O(1)

---

## Day 41-42: Review and Mock Test

### Key Patterns Review

**Binary Search**:
- Sorted array: O(log n) search
- Binary search on answer: try values in range [min, max]

**Sieve of Eratosthenes**:
- Find all primes up to N
- O(n log log n) time

**Peaks and Flags**:
- Find peaks first
- Try different block sizes/flag counts
- Greedy placement

### Mock Test (75-90 min)

**Problem 1: Flags** (30 min)
**Problem 2: CountFactors** (20 min)
**Problem 3: MaxSliceSum** (25 min - review from Week 5)

---

## Week 6 Summary

### What You Learned
✅ Binary search algorithm and variants
✅ Binary search on answer space
✅ Sieve of Eratosthenes for primes
✅ Peak finding and block division
✅ Flags problem (greedy + optimization)
✅ GCD and number theory basics

### Critical Patterns

**1. Binary Search**
- On sorted data: O(log n)
- On answer space: try values efficiently

**2. Sieve for Primes**
- Preprocess once, answer many queries
- Combine with prefix sums

**3. Greedy with Constraints**
- Flags: place greedily with distance check
- Peaks: check each possible division

### Why This Week Was Important

These topics appear in:
- 25%+ of medium/hard Codility tests
- Optimization problems
- Number theory questions

**Must master**:
- Flags (very common!)
- Binary search template
- Sieve of Eratosthenes

### Prepare for Week 7

Next week: Review and reinforcement
- Revisit difficult problems
- Increase speed
- Fill knowledge gaps

Almost there! Week 6 complete! 🎯
