# Week 4: Stacks, Queues, Leaders (MAJOR WEEK!)

Focus: stack patterns, dominance, StoneWall

⚠️ **This is one of the most important weeks!** Stack problems appear frequently in Codility tests.

---

## Day 22: Stacks Fundamentals

### Learning Objectives
- Understand stack data structure (LIFO)
- Master when to use stacks
- Solve bracket matching problems

### Stack Basics

**Stack = Last In, First Out (LIFO)**

```typescript
// TypeScript stack using array
const stack: number[] = [];

// Push (add to top)
stack.push(5);
stack.push(3);
stack.push(7);
// Stack: [5, 3, 7]
//              ↑ top

// Peek (look at top without removing)
const top = stack[stack.length - 1];  // 7

// Pop (remove from top)
const popped = stack.pop();  // 7
// Stack: [5, 3]

// Check if empty
const isEmpty = stack.length === 0;

// Get size
const size = stack.length;
```

### When to Use Stacks

**Use stacks for:**
1. **Matching pairs** - Brackets, parentheses
2. **Nesting problems** - HTML tags, function calls
3. **Next greater/smaller element**
4. **Simulation problems** - Fish moving, stones stacking
5. **Depth-first search**
6. **Undo/redo functionality**

### Codility Challenge: Brackets

**Problem**: Check if bracket sequence is properly nested.

**Valid sequences**:
- `"()"`
- `"([]){}"`
- `"{[()()]}"`

**Invalid sequences**:
- `"([)]"` - wrong order
- `"((("` - not closed
- `")"` - not opened

**Solution**:
```typescript
function solution(S: string): number {
    const stack: string[] = [];
    
    // Map of closing to opening brackets
    const pairs: { [key: string]: string } = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (const char of S) {
        if (char === '(' || char === '{' || char === '[') {
            // Opening bracket - push to stack
            stack.push(char);
        } else {
            // Closing bracket
            if (stack.length === 0) {
                return 0;  // No matching opening bracket
            }
            
            const top = stack.pop()!;
            if (top !== pairs[char]) {
                return 0;  // Wrong type of bracket
            }
        }
    }
    
    // Check if all brackets were closed
    return stack.length === 0 ? 1 : 0;
}

// Test cases
console.log(solution("{[()()]}"));  // 1 (valid)
console.log(solution("([)()]"));    // 0 (invalid - wrong order)
console.log(solution("((("));       // 0 (invalid - not closed)
console.log(solution(""));          // 1 (valid - empty string)
```

**Time**: O(n), **Space**: O(n)

### LeetCode: Valid Parentheses

Same problem, slightly different format:

```typescript
function isValid(s: string): boolean {
    const stack: string[] = [];
    const pairs: { [key: string]: string } = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (const char of s) {
        if (pairs[char]) {
            // Closing bracket
            if (stack.length === 0 || stack.pop() !== pairs[char]) {
                return false;
            }
        } else {
            // Opening bracket
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}
```

### Pattern: Matching Pairs

**Template for matching problems**:
```typescript
function matchingTemplate(input: string): boolean {
    const stack: string[] = [];
    
    for (const char of input) {
        if (isOpening(char)) {
            stack.push(char);
        } else {
            if (stack.length === 0) return false;
            const top = stack.pop();
            if (!matches(top, char)) return false;
        }
    }
    
    return stack.length === 0;
}
```

---

## Day 23: Stack Simulation

### Codility Challenge 1: Fish

**Problem**: Fish are moving in a river. Downstream fish eat smaller upstream fish.

**Rules**:
- Fish at position i has size A[i]
- If B[i] = 1, fish moves downstream (→)
- If B[i] = 0, fish moves upstream (←)
- When they meet: bigger fish eats smaller fish

**Example**:
```
A = [4, 3, 2, 1, 5]  (sizes)
B = [0, 1, 0, 0, 0]  (directions)

Fish 0 (size 4, ←): swims freely
Fish 1 (size 3, →): swims downstream
Fish 2 (size 1, ←): meets fish 1, gets eaten!
Fish 3 (size 1, ←): meets fish 1, gets eaten!
Fish 4 (size 5, ←): meets fish 1, EATS fish 1, then swims upstream

Survivors: fish 0, fish 4
Output: 2
```

**Solution**:
```typescript
function solution(A: number[], B: number[]): number {
    const downstream: number[] = [];  // Stack of fish going downstream
    let survivors = 0;
    
    for (let i = 0; i < A.length; i++) {
        if (B[i] === 1) {
            // Fish going downstream - just add to stack
            downstream.push(A[i]);
        } else {
            // Fish going upstream - might fight with downstream fish
            let alive = true;
            
            while (downstream.length > 0 && alive) {
                const downstreamFish = downstream[downstream.length - 1];
                
                if (A[i] > downstreamFish) {
                    // Upstream fish wins - eats downstream fish
                    downstream.pop();
                } else {
                    // Downstream fish wins
                    alive = false;
                }
            }
            
            if (alive) {
                // Fish survived all fights
                survivors++;
            }
        }
    }
    
    // Add all downstream fish (they never met upstream fish)
    return survivors + downstream.length;
}

// Test cases
console.log(solution([4, 3, 2, 1, 5], [0, 1, 0, 0, 0]));  // 2
console.log(solution([4, 3, 2, 1, 5], [1, 1, 1, 1, 1]));  // 5 (all downstream)
console.log(solution([4, 3, 2, 1, 5], [0, 0, 0, 0, 0]));  // 5 (all upstream)
```

**Time**: O(n), **Space**: O(n)

### Codility Challenge 2: StoneWall ⭐ VERY COMMON!

**Problem**: Build a stone wall where each section can reuse existing stones.

**Visual**:
```
Heights: [8, 8, 5, 7, 9, 8, 7, 4, 8]

 9                   ▓
 8  ▓  ▓           ▓ ▓ ▓
 7  ▓  ▓     ▓     ▓ ▓ ▓
 6  ▓  ▓     ▓     ▓ ▓ ▓
 5  ▓  ▓  ▓  ▓     ▓ ▓ ▓
 4  ▓  ▓  ▓  ▓     ▓ ▓ ▓
 3  ▓  ▓  ▓  ▓     ▓ ▓ ▓
 2  ▓  ▓  ▓  ▓     ▓ ▓ ▓
 1  ▓  ▓  ▓  ▓     ▓ ▓ ▓
    0  1  2  3  4  5 6 7  8

We can reuse blocks at same height!
Total blocks needed: 7
```

**Key Insight**: Use stack to track current heights. When height decreases, we need to end some blocks.

**Solution**:
```typescript
function solution(H: number[]): number {
    const stack: number[] = [];
    let blocks = 0;
    
    for (const height of H) {
        // Remove all blocks higher than current height
        while (stack.length > 0 && stack[stack.length - 1] > height) {
            stack.pop();
        }
        
        // Check if we need a new block at this height
        if (stack.length === 0 || stack[stack.length - 1] < height) {
            stack.push(height);
            blocks++;
        }
        // If stack.top === height, we can reuse existing block!
    }
    
    return blocks;
}

// Test cases
console.log(solution([8, 8, 5, 7, 9, 8, 7, 4, 8]));  // 7
console.log(solution([1, 2, 3, 4, 5]));               // 5 (ascending)
console.log(solution([5, 4, 3, 2, 1]));               // 5 (descending)
console.log(solution([3, 3, 3, 3]));                  // 1 (all same)
```

**Time**: O(n), **Space**: O(n)

**Why This Works**:
1. Stack represents currently "active" heights
2. When we see lower height, previous blocks must end
3. When we see same height, reuse existing block
4. When we see higher height, need new block

---

## Day 24: Leaders & Dominator

### What is a Leader?

**Leader** = Element that appears more than N/2 times

**Examples**:
```
[3, 4, 3, 2, 3, -1, 3, 3]
→ 3 appears 5 times out of 8 (5 > 4)
→ Leader: 3

[1, 2, 1, 2, 1]
→ 1 appears 3 times out of 5 (3 > 2.5)
→ Leader: 1

[1, 2, 3, 4, 5]
→ No element appears > 2.5 times
→ No leader
```

### Boyer-Moore Voting Algorithm

**Key Insight**: If we cancel out different elements pairwise, leader will remain!

```
[3, 4, 3, 2, 3, -1, 3, 3]

Step by step:
3: candidate=3, count=1
4: different! count=0
3: candidate=3, count=1
2: different! count=0
3: candidate=3, count=1
-1: different! count=0
3: candidate=3, count=1
3: same! count=2

Final candidate: 3
Verify: count = 5 > 4 ✓
```

### Codility Challenge: Dominator

**Problem**: Find index of dominator (leader).

**Solution**:
```typescript
function solution(A: number[]): number {
    const n = A.length;
    if (n === 0) return -1;
    
    // Phase 1: Find candidate using Boyer-Moore
    let candidate = A[0];
    let count = 1;
    
    for (let i = 1; i < n; i++) {
        if (count === 0) {
            candidate = A[i];
            count = 1;
        } else if (A[i] === candidate) {
            count++;
        } else {
            count--;
        }
    }
    
    // Phase 2: Verify candidate is actually dominator
    count = 0;
    let index = -1;
    
    for (let i = 0; i < n; i++) {
        if (A[i] === candidate) {
            count++;
            index = i;  // Store any index
        }
    }
    
    // Check if it appears > n/2 times
    if (count > n / 2) {
        return index;
    }
    
    return -1;
}

// Test cases
console.log(solution([3, 4, 3, 2, 3, -1, 3, 3]));  // Any index with value 3
console.log(solution([1, 2, 3, 4]));                // -1 (no dominator)
console.log(solution([5]));                         // 0
```

**Time**: O(n), **Space**: O(1)

### Codility Challenge: EquiLeader

**Problem**: Count positions where both left and right parts have the same leader.

**Example**:
```
A = [4, 3, 4, 4, 4, 2]

Overall leader: 4 (appears 4 times out of 6)

Position 2: [4, 3, 4] vs [4, 4, 2]
  Left: 4 appears 2/3 times ✓ leader
  Right: 4 appears 2/3 times ✓ leader
  → Equi-leader!

Position 3: [4, 3, 4, 4] vs [4, 2]
  Left: 4 appears 3/4 times ✓ leader
  Right: 4 appears 1/2 times ✗ not leader

Output: Count positions where both sides have same leader
```

**Solution**:
```typescript
function solution(A: number[]): number {
    const n = A.length;
    if (n === 0) return 0;
    
    // Find the overall leader
    let candidate = A[0];
    let count = 1;
    
    for (let i = 1; i < n; i++) {
        if (count === 0) {
            candidate = A[i];
            count = 1;
        } else if (A[i] === candidate) {
            count++;
        } else {
            count--;
        }
    }
    
    // Count occurrences of candidate
    let totalLeader = 0;
    for (const num of A) {
        if (num === candidate) totalLeader++;
    }
    
    // Check if candidate is actually a leader
    if (totalLeader <= n / 2) {
        return 0;  // No leader, so no equi-leaders
    }
    
    // Count equi-leaders
    let equiLeaders = 0;
    let leftLeader = 0;
    
    for (let i = 0; i < n - 1; i++) {
        if (A[i] === candidate) leftLeader++;
        
        const leftSize = i + 1;
        const rightSize = n - leftSize;
        const rightLeader = totalLeader - leftLeader;
        
        // Check if both sides have the leader
        if (leftLeader > leftSize / 2 && rightLeader > rightSize / 2) {
            equiLeaders++;
        }
    }
    
    return equiLeaders;
}

// Test cases
console.log(solution([4, 3, 4, 4, 4, 2]));  // 2
console.log(solution([1, 2, 3]));           // 0
console.log(solution([1, 1, 1, 1]));        // 3
```

**Time**: O(n), **Space**: O(1)

---

## Day 25: Stacks & Queues Review

### Stack vs Queue Comparison

```typescript
// STACK (LIFO - Last In First Out)
const stack: number[] = [];
stack.push(1);    // Add to end
stack.push(2);
stack.pop();      // Remove from end → 2

// QUEUE (FIFO - First In First Out)
const queue: number[] = [];
queue.push(1);    // Add to end
queue.push(2);
queue.shift();    // Remove from front → 1
```

### When to Use Each

**Use Stack when:**
- Need to reverse something
- Match pairs/nesting
- Depth-first processing
- Undo operations

**Use Queue when:**
- First-come-first-served
- Breadth-first search
- Level-order traversal
- Buffering

### Practice: Redo Problems for Speed

**Target Times**:
1. **Fish** - < 10 minutes
2. **StoneWall** - < 12 minutes

**Focus Areas**:
- Can you visualize the stack operations?
- Do you understand when to push vs pop?
- Can you trace through examples quickly?

---

## Day 26: Hard Stack Practice

### LeetCode: Daily Temperatures

**Problem**: For each day, find how many days until warmer temperature.

**Example**:
```
Input:  [73, 74, 75, 71, 69, 72, 76, 73]
Output: [1, 1, 4, 2, 1, 1, 0, 0]

Day 0 (73°): Next warmer is day 1 (74°) → 1 day
Day 1 (74°): Next warmer is day 2 (75°) → 1 day
Day 2 (75°): Next warmer is day 6 (76°) → 4 days
...
```

**Solution** (Monotonic Stack):
```typescript
function dailyTemperatures(temperatures: number[]): number[] {
    const n = temperatures.length;
    const result = new Array(n).fill(0);
    const stack: number[] = [];  // Store indices
    
    for (let i = 0; i < n; i++) {
        // Pop all indices with lower temperature
        while (stack.length > 0 && 
               temperatures[stack[stack.length - 1]] < temperatures[i]) {
            const prevIndex = stack.pop()!;
            result[prevIndex] = i - prevIndex;
        }
        
        stack.push(i);
    }
    
    return result;
}

// Test
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));
// [1, 1, 4, 2, 1, 1, 0, 0]
```

**Time**: O(n), **Space**: O(n)

**Pattern**: Monotonic Stack
- Maintain stack in decreasing order
- When we find larger element, it's the "next greater" for previous elements

### Review: Brackets

Redo the Brackets problem from Day 22, but this time in under 5 minutes!

**Quick Solution**:
```typescript
function solution(S: string): number {
    const stack: string[] = [];
    const map: { [key: string]: string } = { ')': '(', '}': '{', ']': '[' };
    
    for (const c of S) {
        if (map[c]) {
            if (stack.pop() !== map[c]) return 0;
        } else {
            stack.push(c);
        }
    }
    
    return stack.length === 0 ? 1 : 0;
}
```

---

## Day 27: Review

### Key Patterns Summary

**Pattern 1: Matching Pairs**
```typescript
// Stack for brackets, tags, etc.
const stack = [];
for (char of input) {
    if (isOpening(char)) stack.push(char);
    else if (!matches(stack.pop(), char)) return false;
}
return stack.length === 0;
```

**Pattern 2: Simulation with Stack**
```typescript
// Fish, StoneWall pattern
const stack = [];
for (item of items) {
    while (stack.length > 0 && shouldRemove(stack.top, item)) {
        stack.pop();
    }
    if (shouldAdd(item)) {
        stack.push(item);
    }
}
```

**Pattern 3: Boyer-Moore Voting**
```typescript
// Find majority element (> n/2)
let candidate, count = 0;
for (num of array) {
    if (count === 0) candidate = num;
    count += (num === candidate ? 1 : -1);
}
// Verify candidate actually appears > n/2 times
```

### Critical Problems to Master

🔥 **Must Know**:
1. **StoneWall** - Stack simulation
2. **Fish** - Stack with conditions
3. **Dominator** - Boyer-Moore
4. **EquiLeader** - Leader in subarrays

### Common Mistakes

❌ **Forgetting to verify Boyer-Moore candidate**
```typescript
// WRONG - candidate might not be leader!
return candidate;

// RIGHT - verify count > n/2
if (count > n/2) return candidate;
```

❌ **Not checking empty stack before pop**
```typescript
// WRONG
const top = stack.pop();

// RIGHT
if (stack.length === 0) return error;
const top = stack.pop();
```

---

## Day 28: MOCK TEST (70 minutes)

### Test Conditions
- **Time Limit**: 70 minutes total
- **Target Score**: 80%+
- **Simulate real test conditions**

### Problems

**Problem 1: Brackets** (20 min)
**Problem 2: StoneWall** (25 min)
**Problem 3: Dominator** (25 min)

### Post-Test Analysis

After completing:

1. **Score yourself honestly**
2. **Identify weak areas**
3. **Note patterns you struggled with**
4. **Plan extra practice if needed**

---

## Week 4 Summary

### What You Learned
✅ Stack data structure (LIFO)
✅ When and why to use stacks
✅ Bracket matching pattern
✅ Stack simulation (Fish, StoneWall)
✅ Boyer-Moore voting algorithm
✅ Leader and equi-leader concepts

### Critical Patterns

**1. Stack for Matching**
- Brackets, parentheses, HTML tags
- O(n) time, O(n) space

**2. Stack for Simulation**
- StoneWall: tracking heights
- Fish: fighting with direction
- Keep removing until condition met

**3. Boyer-Moore for Leaders**
- Find majority element in O(n) time, O(1) space
- Must verify candidate!

### Why This Week Was Important

Stack problems appear in:
- 40%+ of Codility tests
- Many coding interviews
- Real-world applications

**Master these problems**:
- StoneWall (most common!)
- Fish
- EquiLeader

### Prepare for Week 5

Next week focuses on:
- Maximum slice problems
- Kadane's algorithm
- Dynamic programming basics
- MaxDoubleSliceSum (tricky!)

Week 4 complete! You've mastered one of the hardest topics! 🎉
