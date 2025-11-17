# Week 7: Reinforcement + Mid/Hard LeetCode

Focus: fill gaps + strengthen thinking

---

## Day 43-44: Array Medium Review

### Learning Objectives
- Solidify array manipulation skills
- Practice medium-difficulty problems
- Improve problem-solving speed

### LeetCode Medium: Product of Array Except Self

**Problem**: Return array where output[i] = product of all elements except arr[i].
**Constraint**: No division allowed!

**Example**:
```
Input:  [1, 2, 3, 4]
Output: [24, 12, 8, 6]

Explanation:
24 = 2 × 3 × 4
12 = 1 × 3 × 4
8 = 1 × 2 × 4
6 = 1 × 2 × 3
```

**Solution** (Using prefix and suffix products):
```typescript
function productExceptSelf(nums: number[]): number[] {
    const n = nums.length;
    const result = new Array(n);
    
    // Build prefix products from left
    result[0] = 1;
    for (let i = 1; i < n; i++) {
        result[i] = result[i - 1] * nums[i - 1];
    }
    
    // Multiply with suffix products from right
    let suffixProduct = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= suffixProduct;
        suffixProduct *= nums[i];
    }
    
    return result;
}

console.log(productExceptSelf([1, 2, 3, 4]));  // [24, 12, 8, 6]
```

**Time**: O(n), **Space**: O(1) (output array doesn't count)

### LeetCode Medium: Container With Most Water

**Problem**: Find two lines that together with x-axis form container with most water.

**Example**:
```
Height: [1, 8, 6, 2, 5, 4, 8, 3, 7]

Best container: indices 1 and 8
Height: min(8, 7) = 7
Width: 8 - 1 = 7
Area: 7 × 7 = 49
```

**Solution** (Two pointers):
```typescript
function maxArea(height: number[]): number {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        const width = right - left;
        const h = Math.min(height[left], height[right]);
        const area = width * h;
        
        maxWater = Math.max(maxWater, area);
        
        // Move pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}
```

**Time**: O(n), **Space**: O(1)

### LeetCode Medium: 3Sum

**Problem**: Find all unique triplets that sum to zero.

**Solution**:
```typescript
function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);
    const result: number[][] = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicates for first number
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        // Two pointer for remaining two numbers
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                
                // Skip duplicates
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}
```

**Time**: O(n²), **Space**: O(1)

---

## Day 45: Stack & Leader Review

### Critical Problems Revisited

**Focus Areas**:
1. StoneWall - Can you solve in < 10 minutes?
2. Fish - Can you visualize stack operations?
3. EquiLeader - Can you optimize with prefix sums?

### StoneWall - Speed Practice

**Target**: Complete in under 10 minutes

**Quick Solution Template**:
```typescript
function solution(H: number[]): number {
    const stack: number[] = [];
    let blocks = 0;
    
    for (const height of H) {
        // Remove blocks higher than current
        while (stack.length > 0 && stack[stack.length - 1] > height) {
            stack.pop();
        }
        
        // Add new block if needed
        if (stack.length === 0 || stack[stack.length - 1] < height) {
            stack.push(height);
            blocks++;
        }
    }
    
    return blocks;
}
```

### Fish - Pattern Recognition

**Key Points**:
- Downstream fish = stack
- Upstream fish = fight with stack
- Count survivors

### EquiLeader - Optimization

**Remember**:
- Find overall leader first (Boyer-Moore)
- Track left count while iterating
- Check both sides have majority

---

## Day 46: Binary Search Review

### Critical Patterns

**Pattern 1: Find in Sorted Array**
```typescript
function binarySearch(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;
}
```

**Pattern 2: Binary Search on Answer**
```typescript
function binarySearchOnAnswer(min: number, max: number): number {
    let left = min, right = max;
    let result = max;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (isValid(mid)) {
            result = mid;
            right = mid - 1;  // Try smaller
        } else {
            left = mid + 1;
        }
    }
    
    return result;
}
```

### Flags - Deep Dive

**Why it's hard**:
1. Understanding the constraint (distance ≥ K where K = flags)
2. Optimizing the search range
3. Greedy placement

**Mental Model**:
```
If I want to place K flags:
- I need K peaks
- Distance between consecutive flags ≥ K
- Greedily place flags at earliest possible peaks
```

### Peaks - Pattern Recognition

**Steps**:
1. Find all peak positions
2. Try each valid number of blocks (must divide N)
3. Check if each block has ≥ 1 peak
4. Return maximum valid blocks

---

## Day 47: Prefix Sum Review

### Why Prefix Sums Are Critical

**Appears in**:
- GenomicRangeQuery
- PassingCars  
- CountDiv (indirectly)
- Many custom problems

### GenomicRangeQuery - Master Solution

**Pattern**: Multiple prefix sum arrays

```typescript
function solution(S: string, P: number[], Q: number[]): number[] {
    const n = S.length;
    
    // Prefix sum for each nucleotide
    const prefixA = new Array(n + 1).fill(0);
    const prefixC = new Array(n + 1).fill(0);
    const prefixG = new Array(n + 1).fill(0);
    const prefixT = new Array(n + 1).fill(0);
    
    for (let i = 0; i < n; i++) {
        prefixA[i + 1] = prefixA[i] + (S[i] === 'A' ? 1 : 0);
        prefixC[i + 1] = prefixC[i] + (S[i] === 'C' ? 1 : 0);
        prefixG[i + 1] = prefixG[i] + (S[i] === 'G' ? 1 : 0);
        prefixT[i + 1] = prefixT[i] + (S[i] === 'T' ? 1 : 0);
    }
    
    const result: number[] = [];
    
    for (let k = 0; k < P.length; k++) {
        const start = P[k];
        const end = Q[k] + 1;
        
        if (prefixA[end] - prefixA[start] > 0) result.push(1);
        else if (prefixC[end] - prefixC[start] > 0) result.push(2);
        else if (prefixG[end] - prefixG[start] > 0) result.push(3);
        else result.push(4);
    }
    
    return result;
}
```

**Key Insight**: Check impact factors in order (1, 2, 3, 4)

---

## Day 48: Mini Mock Test

### Test Conditions
- **Time**: 60 minutes
- **Target**: 90% on easier ones, 75% on hard ones
- **Mixed Difficulty**

### Problems (Choose 3)

**Medium Difficulty** (20 min each):
1. FrogRiverOne
2. PermCheck
3. MaxProfit

**Hard Difficulty** (30 min each):
1. StoneWall
2. Flags
3. MaxDoubleSliceSum

### Self-Evaluation

After test:

✅ **Speed**: Did you finish in time?
✅ **Accuracy**: Were edge cases handled?
✅ **Pattern Recognition**: Did you identify pattern quickly?
✅ **Implementation**: Clean, bug-free code?

---

## Day 49: Free Review Day

### Customize Your Practice

**If you're weak on**:
- **Arrays**: Do 5 more array manipulation problems
- **Stacks**: Redo Fish, StoneWall, Brackets
- **DP**: Redo MaxDoubleSliceSum, NumberSolitaire
- **Math**: Redo CountDiv, GCD problems

### Speed Targets by Category

**Easy** (should complete in 5 min):
- PermCheck
- FrogJmp
- TapeEquilibrium

**Medium** (should complete in 10 min):
- FrogRiverOne
- MissingInteger
- MaxProfit

**Hard** (should complete in 15-20 min):
- StoneWall
- GenomicRangeQuery
- MaxDoubleSliceSum

**Very Hard** (20-25 min):
- Flags
- EquiLeader
- NumberSolitaire

---

## Week 7 Summary

### What You Accomplished
✅ Reviewed all major patterns
✅ Practiced medium difficulty problems
✅ Improved problem-solving speed
✅ Filled knowledge gaps
✅ Built confidence

### Pattern Mastery Checklist

**Arrays**:
- ✅ Two pointers
- ✅ Prefix sums
- ✅ Sorting strategies

**Stacks**:
- ✅ Matching pairs
- ✅ Simulation problems
- ✅ Next greater/smaller element

**DP**:
- ✅ Kadane's algorithm
- ✅ State transitions
- ✅ Multiple DP arrays

**Math/Optimization**:
- ✅ Binary search
- ✅ Sieve of Eratosthenes
- ✅ GCD/LCM

### Final Week Preparation

**Week 8 is about**:
- Full-length mock tests
- Time management
- Staying calm under pressure
- Final refinements

**Your preparation checklist**:
- [ ] Can solve easy problems in < 5 min
- [ ] Can solve medium problems in < 15 min
- [ ] Know all major patterns by heart
- [ ] Can identify pattern from problem description
- [ ] Handle edge cases automatically

### Mental Preparation

**Remember**:
1. You've practiced 7 weeks - you're ready!
2. Pattern recognition > memorization
3. Read problem carefully (2-3 times)
4. Test with edge cases
5. Stay calm if stuck - move on and come back

You're in the home stretch! One more week! 💪
