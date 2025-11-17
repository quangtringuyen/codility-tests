# Week 8: Final Codility Simulation Week

Focus: simulate real exam conditions

🎯 **This is it!** Your final week of preparation. Time to put everything together.

---

## Day 51: Full Mock Test A (90 minutes)

### Test Setup

**Environment**:
- Find a quiet place
- Set 90-minute timer
- Have water ready
- Close all distractions
- Use IDE you're comfortable with

**Rules**:
- No looking at solutions
- No external resources
- Simulate real test pressure

### Mock Test A - Problems

**Problem 1: StoneWall** (30 min)
- Stack simulation
- Target: 100% correctness

**Problem 2: MaxDoubleSliceSum** (35 min)
- DP with two arrays
- Target: 100% correctness

**Problem 3: TapeEquilibrium** (25 min)
- Prefix sum application
- Target: 100% correctness

### During Test - Strategy

**Time Allocation**:
```
0-5 min:   Read all problems
5-35 min:  Problem 1 (StoneWall)
35-70 min: Problem 2 (MaxDoubleSliceSum)
70-90 min: Problem 3 (TapeEquilibrium)
```

**For Each Problem**:
1. Read carefully (2-3 min)
2. Identify pattern (2 min)
3. Plan solution (3 min)
4. Write code (10-15 min)
5. Test with examples (3 min)
6. Check edge cases (2 min)
7. Submit

**If Stuck**:
- Don't panic!
- Move to next problem
- Come back with fresh eyes

---

## Day 52: Review Results - Mock Test A

### Detailed Analysis

**For Each Problem**:

**1. Correctness**
- Did you get 100%?
- Which test cases failed?
- What was the error?

**2. Performance**
- Was your solution optimal?
- Did you exceed time limit?
- Could it be improved?

**3. Time Management**
- How long did each problem take?
- Did you finish in 90 minutes?
- Where did you get stuck?

**4. Pattern Recognition**
- Did you identify pattern quickly?
- Could you have been faster?

### Example Analysis Template

```
Problem: StoneWall
Score: 87% (correctness)
Time Taken: 35 minutes

What went wrong:
- Missed edge case: single element array
- Had off-by-one error in loop

What went right:
- Identified stack pattern immediately
- Core algorithm was correct

Improvements:
- Practice edge case checklist
- Slow down when writing loops

Action Items:
- Redo StoneWall 3 more times
- Create edge case checklist
```

### Common Failure Modes

**If you scored < 70%**:
- Pattern recognition issue
- Need more practice on that topic
- Redo related problems

**If you ran out of time**:
- Practice with timer more
- Skip hard problem, do easy ones first
- Improve typing speed

**If you had bugs**:
- Test more thoroughly before submit
- Use print statements to debug
- Check edge cases manually

---

## Day 53: Full Mock Test B (90 minutes)

### Mock Test B - Problems

**Problem 1: Fish** (25 min)
- Stack with conditions
- Target: 100% correctness

**Problem 2: Flags** (40 min)
- Greedy + optimization
- Target: 90%+ correctness

**Problem 3: PermMissingElem** (25 min)
- Simple math trick
- Target: 100% correctness

### Strategic Approach

**Order of Attack**:
1. Read all three problems (5 min)
2. Identify easiest → do it first
3. Identify hardest → save for last if needed
4. Budget time wisely

**Pro Tips**:
- Start with confidence booster (easiest problem)
- Build momentum
- Save buffer time for debugging

---

## Day 54: Review Results - Mock Test B

### Score Comparison

**Track Progress**:
```
Mock Test A: ___% average
Mock Test B: ___% average

Improvement: ___% 

Time Management:
Test A: Finished? Yes / No
Test B: Finished? Yes / No
```

### Pattern Analysis

**Strong Areas** (consistently 90%+):
- [ ] Arrays & Loops
- [ ] Stacks
- [ ] Prefix Sums
- [ ] DP
- [ ] Binary Search
- [ ] Sorting

**Weak Areas** (below 80%):
- [ ] _______________
- [ ] _______________

**Action Plan**:
- Focus remaining days on weak areas
- Do 5-10 more problems in weak topics
- Review solutions from lessons

---

## Day 55: Full Mock Test C (90 minutes)

### Mock Test C - Problems

**Problem 1: MaxProfit** (20 min)
- Kadane's variant
- Target: 100% correctness

**Problem 2: GenomicRangeQuery** (35 min)
- Multiple prefix sums
- Target: 100% correctness

**Problem 3: Dominator** (35 min)
- Boyer-Moore algorithm
- Target: 100% correctness

### Mindset

**This is your last practice test!**

**Focus on**:
- Perfect execution
- No silly mistakes
- Time management
- Edge case handling
- Clean code

**Remember**:
- You've trained for 8 weeks
- You know the patterns
- You can do this!
- Stay calm and focused

---

## Day 56: Final Self-Assessment

### Overall Performance Review

**Mock Test Scores**:
```
Test A: ___%
Test B: ___%
Test C: ___%

Average: ___%
Goal: 85-90%
```

**Time Management**:
```
Test A: ___/90 minutes used
Test B: ___/90 minutes used
Test C: ___/90 minutes used

Finished all tests on time? ___
```

### Strengths & Weaknesses

**My Strongest Patterns**:
1. _______________
2. _______________
3. _______________

**Areas to Review Last Minute**:
1. _______________
2. _______________

### Final Preparation Checklist

**Technical Readiness**:
- [ ] Can solve easy problems in < 5 min
- [ ] Can solve medium problems in < 15 min
- [ ] Know all major patterns
- [ ] Can handle edge cases
- [ ] Code is clean and bug-free

**Pattern Mastery**:
- [ ] Arrays (prefix sum, two pointers)
- [ ] Stacks (matching, simulation)
- [ ] DP (Kadane's, state transitions)
- [ ] Binary Search (on array, on answer)
- [ ] Sorting (when to use, what it enables)
- [ ] Greedy (local → global optimum)
- [ ] Math (GCD, primes, divisors)

**Mental Readiness**:
- [ ] Confident in abilities
- [ ] Know how to manage time
- [ ] Can stay calm under pressure
- [ ] Have debugging strategies
- [ ] Can move on if stuck

### The Night Before

**DO**:
- ✅ Review pattern cheat sheet
- ✅ Do 1-2 easy warm-up problems
- ✅ Get good sleep (8 hours!)
- ✅ Prepare your workspace
- ✅ Relax and stay confident

**DON'T**:
- ❌ Cram new topics
- ❌ Stay up late practicing
- ❌ Stress about what you don't know
- ❌ Try new strategies
- ❌ Doubt your preparation

---

## Pattern Quick Reference

### Must-Know Patterns

**1. Prefix Sum**
```typescript
const prefix = [0];
for (const num of arr) {
    prefix.push(prefix[prefix.length - 1] + num);
}
// Range sum [i, j] = prefix[j+1] - prefix[i]
```

**2. Stack Simulation**
```typescript
const stack = [];
for (const item of items) {
    while (stack.length > 0 && shouldPop(stack.top, item)) {
        stack.pop();
    }
    stack.push(item);
}
```

**3. Boyer-Moore Voting**
```typescript
let candidate, count = 0;
for (const num of arr) {
    if (count === 0) candidate = num;
    count += (num === candidate ? 1 : -1);
}
// Verify: count occurrences of candidate
```

**4. Kadane's Algorithm**
```typescript
let maxEnding = arr[0], maxSoFar = arr[0];
for (let i = 1; i < arr.length; i++) {
    maxEnding = Math.max(arr[i], maxEnding + arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEnding);
}
```

**5. Binary Search**
```typescript
let left = 0, right = arr.length - 1;
while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
}
```

**6. Two Pointers**
```typescript
let left = 0, right = arr.length - 1;
while (left < right) {
    if (condition) {
        // process
        left++;
    } else {
        right--;
    }
}
```

---

## Edge Cases Checklist

**Always Test**:
- [ ] Empty array: `[]`
- [ ] Single element: `[5]`
- [ ] Two elements: `[1, 2]`
- [ ] All same: `[3, 3, 3, 3]`
- [ ] All increasing: `[1, 2, 3, 4, 5]`
- [ ] All decreasing: `[5, 4, 3, 2, 1]`
- [ ] Negative numbers: `[-5, -3, -1]`
- [ ] Mix of positive/negative: `[-2, 3, -1, 4]`
- [ ] Contains zero: `[0, 1, 2]`
- [ ] Large numbers: `[1000000000]`
- [ ] Minimum/maximum constraints

---

## Test Day Strategy

### Before Test

**Setup** (10 minutes before):
- Close all distractions
- Have water ready
- IDE/editor ready
- Comfortable temperature
- Good lighting

**Warm Up** (5 minutes):
- Do one very easy problem
- Get into coding mindset
- Build confidence

### During Test

**Time Management**:
```
0-5 min:    Read all problems, identify difficulty
5-30 min:   Easiest problem
30-65 min:  Medium problem  
65-90 min:  Hardest problem (or revisit if stuck)
```

**Problem-Solving Process**:
1. **Read** (2 min): Understand requirements
2. **Identify** (1 min): What pattern?
3. **Plan** (2 min): High-level algorithm
4. **Code** (10-15 min): Implement solution
5. **Test** (3 min): Run examples
6. **Edge Cases** (2 min): Check edge cases
7. **Submit**: Go!

**If Stuck**:
- Take 30-second break
- Re-read problem
- Try simpler version
- If still stuck after 10 min → move on!

### After Each Problem

**Quick Check**:
- ✅ Handles empty array?
- ✅ Handles single element?
- ✅ Handles negative numbers?
- ✅ Correct time complexity?
- ✅ No off-by-one errors?

---

## Final Words

### You Are Ready!

**You've completed**:
- 8 weeks of structured learning
- 50+ coding challenges
- 6 mock tests
- Countless hours of practice

**You've mastered**:
- All major algorithmic patterns
- Time and space complexity analysis
- Edge case handling
- Problem-solving strategies

### Success Mindset

**Remember**:
1. **Stay calm** - Panic helps no one
2. **Read carefully** - Most bugs come from misreading
3. **Start simple** - Get something working first
4. **Test thoroughly** - Catch bugs before submit
5. **Manage time** - Don't get stuck on one problem

**The goal**: 85-90% correctness + optimized performance

### You've Got This!

**Trust your preparation**:
- You know the patterns
- You've practiced enough
- You can handle the pressure
- You will succeed!

**Final checklist**:
- ✅ 8 weeks of lessons completed
- ✅ Pattern mastery achieved
- ✅ Mock tests passed
- ✅ Confidence built
- ✅ Ready to excel!

---

## Congratulations! 🎉

You've completed the entire 8-week Codility training program!

**Your journey**:
- Week 1: Foundations ✅
- Week 2: Counting & Prefix Sums ✅
- Week 3: Sorting & Greedy ✅
- Week 4: Stacks & Leaders ✅
- Week 5: DP & Max Slices ✅
- Week 6: Binary Search & Advanced ✅
- Week 7: Review & Practice ✅
- Week 8: Final Preparation ✅

**You're now equipped with**:
- Deep understanding of algorithms
- Pattern recognition skills
- Time management strategies
- Confidence to succeed

**Go ace that test!** 🚀

Remember: You didn't come this far to only come this far.

Good luck! You've earned this success! 💪✨
