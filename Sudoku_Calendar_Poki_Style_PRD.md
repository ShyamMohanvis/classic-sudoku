# Sudoku Calendar — Poki-Style Web Game PRD

**Version:** 1.0  
**Date:** 2026-09-21  
**Reference:** [Poki — Sudoku Calendar](https://poki.com/en/g/sudoku-calendar)  
**Target:** Desktop + mobile + tablet browser

> **Important:** This PRD targets close feature, interaction, layout, and visual parity with the supplied reference screenshots. Use original code, branding, icons, sounds, artwork, and properly licensed assets; do not copy proprietary game assets or source code.

---

## 1. Product Overview

Build a polished browser Sudoku game inspired by **Sudoku Calendar** on Poki.

Core experience:

- Daily Sudoku calendar
- Random Sudoku
- Easy / Medium / Hard
- 9×9 classic Sudoku
- Hints
- Hide impossible numbers
- Pencil/notes mode
- Hearts/lives
- Star/reward counter
- Timer
- Streaks
- Persistent progress
- Responsive desktop/mobile/tablet UI
- Purple → magenta → orange visual theme
- Lightweight browser-game architecture

Poki currently describes the reference as a daily Sudoku game with calendar puzzles, random games, Easy-to-Hard difficulty, impossible-number hiding, hints, mouse/tap controls, and desktop/phone/tablet support. The listed developer is supernice.games and the page reports a January 2026 update.

---

# 2. Product Goals

### P0

1. Make the game immediately playable.
2. Reproduce the reference's overall screen hierarchy and interaction flow.
3. Implement a mathematically correct Sudoku engine.
4. Implement deterministic daily puzzles.
5. Implement random puzzle generation.
6. Implement Easy/Medium/Hard.
7. Implement calendar navigation.
8. Implement hints and notes.
9. Implement responsive mobile controls.
10. Save progress locally.

### P1

- Undo/redo
- Statistics
- Sound effects
- Better difficulty analysis
- More polished animations

### P2

- Achievements
- Cloud save
- Leaderboards
- Social sharing
- Advanced themes

---

# 3. Recommended Technology

For this 2D browser game, use:

```text
TypeScript
HTML5
CSS3
SVG
Vite
LocalStorage / IndexedDB
```

DOM/CSS/SVG is preferred over a 3D engine because the product is primarily UI + grid interaction.

Optional:

```text
Phaser 3
```

only if additional game-like effects are required.

---

# 4. Screen Architecture

```text
App
│
├── Home
│   ├── Random Sudoku
│   ├── Sudoku Calendar
│   └── How To Play
│
├── Random Sudoku
│   ├── Difficulty
│   ├── Puzzle Preview
│   ├── Randomize
│   └── Start
│
├── Calendar
│   ├── Month Navigation
│   ├── Date Grid
│   └── Daily Puzzle
│
├── Gameplay
│   ├── Header
│   ├── Sudoku Grid
│   ├── Hint
│   ├── Pencil
│   └── Number Pad
│
├── Completion
├── How To Play
└── Settings
```

---

# 5. Visual Design

## 5.1 Background

Use a full-screen vertical gradient:

```text
Top      deep purple / burgundy
          ↓
Middle   dark magenta
          ↓
Lower    magenta-red
          ↓
Bottom   warm orange-red
```

Suggested starting values:

```css
--bg-top: #40002f;
--bg-mid: #79144f;
--bg-bottom: #cf5a38;

--orange: #ff6200;
--purple: #98005d;
--white: #ffffff;
--grid: #d7a8b9;
--text: #ffffff;
```

These are starting design values and should be tuned against the supplied screenshots.

## 5.2 Background Decorations

Add faint floating numbers:

```text
1  2  3  4  5  6  7  8  9
```

Characteristics:

- Very low opacity
- Random positions
- Different scales
- Slow floating movement
- Never interfere with controls

Disable/reduce animation under `prefers-reduced-motion`.

---

# 6. Branding

Do **not** copy the reference developer logo.

Create original branding with a similar visual hierarchy:

```text
       [original Sudoku icon]

             SUDOKU
          DAILY PUZZLE
```

Logo should contain:

- Rounded/circular Sudoku icon
- 3×3 visual motif
- Main title
- Small subtitle

---

# 7. Global Header

Reference-style structure:

```text
                         [★ 1] [⚙]
```

Gameplay:

```text
[♥ 5]              [difficulty/icon]        [★ 1] [⚙]
```

### Star

Display:

```text
★ 1
```

Can represent reward currency.

### Settings

Open a modal with:

```text
Sound
Music
Animations
Hide impossible numbers
Statistics
How to Play
Reset Progress
```

---

# 8. Home Screen

Target composition:

```text
                    [LOGO]

            [DICE] [CALENDAR] [?]

             Random   Sudoku   How
             Sudoku   Calendar  to Play

                   [visual
                    Sudoku
                    decoration]
```

Requirements:

- Large vertical breathing room
- Centered navigation
- White/orange typography
- Circular icon buttons
- Background floating numbers

### Main actions

#### Random Sudoku

Icon: original dice SVG

Label:

```text
Random
Sudoku
```

#### Sudoku Calendar

Icon: original calendar SVG

Label:

```text
Sudoku
Calendar
```

#### How To Play

Icon: question mark

Label:

```text
How to
play
```

---

# 9. Random Sudoku Screen

Target layout:

```text
                    [LOGO]

              [dice] [calendar] [?]

                  Random Sudoku

------------------------------------------------

          EASY       MEDIUM       HARD

                  [9×9 preview]

                         [↻]

                    [ START ]
```

## Difficulty

Three levels:

```text
Easy
Medium
Hard
```

Selected:

- Orange rounded pill
- White text
- Small difficulty indicator

Unselected:

- Transparent/darker background
- White text

## Preview

Display a non-editable mini Sudoku board.

Randomize button:

```text
↻
```

generates another puzzle at the same difficulty.

## Start

Large white rounded button:

```text
START
```

with subtle shadow and press animation.

---

# 10. Calendar Screen

Purpose:

> One deterministic Sudoku puzzle per calendar date.

Target:

```text
             Sudoku Calendar

            September 2026

        <                 >

       Mon Tue Wed Thu Fri Sat Sun

        1   2   3   4   5   6   7
        8   9  10  11  12  13  14
       15  16  17  18  19  20  21
       22  23  24  25  26  27  28
       29  30
```

Date states:

- Today: orange highlight
- Selected: strong accent
- Completed: check/filled indicator
- Available past day: normal
- Future: disabled

Support previous/next month navigation where appropriate.

---

# 11. Daily Puzzle Determinism

The same date must always return the same daily puzzle.

Seed:

```text
YYYY-MM-DD-difficulty-version
```

Example:

```text
2026-09-21-easy-v1
```

Pseudo:

```ts
const seed = hash(
  `${year}-${month}-${day}-${difficulty}-v1`
);
```

This means a player can leave and return later without receiving a different puzzle.

---

# 12. Sudoku Rules

Standard 9×9 Sudoku:

- 9 rows
- 9 columns
- nine 3×3 boxes
- digits 1–9
- no duplicate in a row
- no duplicate in a column
- no duplicate in a 3×3 box

---

# 13. Sudoku Grid

Structure:

```text
┌───────┬───────┬───────┐
│       │       │       │
│       │       │       │
│       │       │       │
├───────┼───────┼───────┤
│       │       │       │
│       │       │       │
│       │       │       │
├───────┼───────┼───────┤
│       │       │       │
│       │       │       │
│       │       │       │
└───────┴───────┴───────┘
```

Visual:

- White/off-white board
- Rounded outer corners
- Light cell lines
- Stronger 3×3 separators
- Purple/magenta numbers
- Soft shadow

---

# 14. Cell States

Each cell supports:

```text
EMPTY
GIVEN
PLAYER_VALUE
NOTES
SELECTED
RELATED
ERROR
CORRECT
```

When selected, highlight:

1. Selected cell
2. Same row
3. Same column
4. Same 3×3 box
5. Same number

---

# 15. Number Entry

Flow:

```text
select cell
      ↓
select 1–9
      ↓
validate
      ↓
correct → place number
wrong   → error + life deduction
```

Desktop keyboard:

```text
1–9     place number
Delete  clear
Backspace clear
Arrow   move cell
N       toggle notes
H       hint
U       undo
Esc     close modal
```

---

# 16. Number Keypad

Desktop and mobile:

```text
[1] [2] [3] [4] [5]
[6] [7] [8] [9]
```

Style:

- White circular buttons
- Magenta numbers
- Large touch targets
- Selected/disabled state

Minimum target:

```text
44×44 px
```

Recommended mobile:

```text
48–56 px
```

---

# 17. Pencil / Notes Mode

Pencil button toggles notes mode.

Normal:

```text
number = final answer
```

Notes:

```text
number = candidate
```

A cell can display:

```text
1 2 3
4 5 6
7 8 9
```

as small candidate digits.

---

# 18. Hide Impossible Numbers

For the selected cell:

```ts
possible =
  [1..9]
  - rowValues
  - columnValues
  - boxValues;
```

If enabled:

```text
impossible keypad buttons
→ disabled
→ opacity ~0.25
```

Provide a settings/gameplay toggle.

---

# 19. Hint System

Hint icon:

```text
[lightbulb]
```

Behavior:

1. If a cell is selected and empty, reveal its solution.
2. If no cell is selected, select an appropriate empty cell.
3. Animate the revealed cell.
4. Increment hints used.
5. Optionally deduct reward currency.

MVP can use unlimited hints while tracking usage.

---

# 20. Hearts / Lives

Gameplay header:

```text
♥ 5
```

Default:

```text
5 lives
```

Incorrect answer:

```text
life -= 1
```

Feedback:

- Cell shake
- Error flash
- Heart count update
- Wrong value cleared

At zero:

```text
Game Over
```

Provide a relaxed/no-game-over mode later if desired.

---

# 21. Timer

Format:

```text
00:00
```

Start on puzzle start.

Pause when:

- settings opens
- how-to opens
- configured browser focus loss occurs

Persist elapsed time with saved puzzle state.

Track:

- best time
- current time
- average time

---

# 22. Gameplay Header

Target:

```text
[♥ 5]       [difficulty/icon]       [★ 1] [⚙]
```

Mobile should compress gracefully without overlap.

---

# 23. Completion Screen

When all 81 cells are correct:

```text
                 ✓

               SOLVED!

                04:38

             Mistakes: 1
              Hints: 0
             Streak: 7

              [Continue]
```

Show:

- completion animation
- time
- mistakes
- hints
- difficulty
- date
- streak

---

# 24. Completion Animation

Sequence:

```text
last correct entry
       ↓
grid pulse
       ↓
small particles/confetti
       ↓
completion modal
```

Target duration:

```text
0.5–1.5 seconds
```

Keep it lightweight.

---

# 25. Streak System

Persist:

```ts
currentStreak
longestStreak
lastCompletedDate
```

Rules:

```text
completed today
→ no duplicate increment

completed yesterday + today
→ streak + 1

missed one or more dates
→ streak resets
```

---

# 26. Statistics

Track:

```text
Games played
Games completed
Current streak
Longest streak
Best time
Average time
Mistakes
Hints used
```

---

# 27. Save System

MVP:

```text
LocalStorage
```

Key:

```text
sudoku_calendar_save_v1
```

Example:

```ts
{
  settings: {},
  currency: {},
  statistics: {},
  streak: {},
  dailyProgress: {},
  randomProgress: {}
}
```

Daily progress:

```ts
{
  date: "2026-09-21",
  difficulty: "easy",
  values: [...],
  notes: [...],
  elapsedSeconds: 184,
  mistakes: 1,
  hintsUsed: 0,
  completed: false
}
```

Use IndexedDB if save data becomes larger.

---

# 28. Sudoku Generator

Pipeline:

```text
seed
 ↓
generate solved board
 ↓
shuffle rows/columns/bands/stacks
 ↓
remove values
 ↓
check unique solution
 ↓
evaluate difficulty
 ↓
accept
```

Every production puzzle must have exactly one solution.

Uniqueness test:

```text
countSolutions(board) === 1
```

---

# 29. Difficulty Targets

Initial targets:

### Easy

```text
~38–45 givens
```

Expected:

- direct singles
- simple deductions
- short solve time

### Medium

```text
~32–37 givens
```

Expected:

- hidden singles
- intersections
- candidate reasoning

### Hard

```text
~25–31 givens
```

Expected:

- stronger candidate interactions
- longer deduction chains

Do not rely only on clue count. Later add a logical difficulty evaluator.

---

# 30. Solver

Implement:

- Validity checking
- Solution generation
- Uniqueness checking
- Completion verification
- Hint generation

Basic backtracking:

```ts
function solve(board): boolean {
  const cell = findEmptyCell(board);

  if (!cell) return true;

  for (let n = 1; n <= 9; n++) {
    if (isValid(board, cell, n)) {
      board[cell.row][cell.col] = n;

      if (solve(board)) return true;

      board[cell.row][cell.col] = 0;
    }
  }

  return false;
}
```

Use MRV/constraint ordering for performance if needed.

---

# 31. Random Mode

Flow:

```text
Home
 ↓
Random Sudoku
 ↓
Easy / Medium / Hard
 ↓
Preview
 ↓
Randomize
 ↓
Start
 ↓
Gameplay
```

Random puzzles are independent of calendar dates.

---

# 32. Daily Mode

Flow:

```text
Home
 ↓
Sudoku Calendar
 ↓
Select date
 ↓
Preview / Continue
 ↓
Gameplay
 ↓
Complete
 ↓
Streak update
```

---

# 33. How To Play

Explain visually:

```text
1. Select an empty square.
2. Choose a number.
3. Each row contains 1–9 once.
4. Each column contains 1–9 once.
5. Each 3×3 box contains 1–9 once.
6. Pencil mode stores candidates.
7. Use hints when stuck.
```

Use a mini interactive/static example board.

---

# 34. Settings

```text
SETTINGS

Sound                [ON]
Music                [OFF]
Animations           [ON]
Hide impossible      [ON]

---------------------------

Statistics
How To Play
Reset Progress

             [Close]
```

Reset requires confirmation:

```text
This will delete all local progress.

[Cancel] [Reset]
```

---

# 35. Responsive Design

## Desktop

Game content centered.

Recommended board:

```text
400–520 px
```

Avoid excessive full-screen scaling.

## Mobile

Board:

```text
min(92vw, 430px)
```

Gameplay order:

```text
Header
↓
Board
↓
Hint / Pencil
↓
Number Pad
```

Prevent horizontal overflow.

Use safe-area padding on iOS.

---

# 36. Accessibility

Required:

- Semantic buttons
- Keyboard navigation
- Visible focus
- ARIA labels
- Adequate contrast
- Reduced-motion support
- Do not communicate errors only through color

Examples:

```html
<button aria-label="Use hint"></button>
<button aria-label="Toggle pencil mode"></button>
```

---

# 37. Sound

Optional P1.

Effects:

```text
button
cell select
number placed
wrong answer
hint
completion
```

Do not copy reference-game audio.

Default volume should be conservative.

---

# 38. Animation

Recommended:

```text
Button press: scale 1 → .96 → 1
Selection: 100–150ms fade
Wrong answer: ±4–6px shake
Hint: 2–3 pulse cycles
Completion: fade + scale + particles
```

Avoid excessive animation.

---

# 39. Component Architecture

```text
App
├── Background
├── Header
│   ├── Hearts
│   ├── Currency
│   └── Settings
├── HomeScreen
│   ├── Logo
│   ├── RandomButton
│   ├── CalendarButton
│   └── HowToButton
├── RandomScreen
│   ├── ModeNavigation
│   ├── DifficultySelector
│   ├── PuzzlePreview
│   ├── RandomizeButton
│   └── StartButton
├── CalendarScreen
│   ├── MonthHeader
│   ├── CalendarGrid
│   └── DayDetails
├── GameScreen
│   ├── GameHeader
│   ├── SudokuBoard
│   ├── HintButton
│   ├── NumberPad
│   └── NotesToggle
├── CompletionModal
├── HowToModal
└── SettingsModal
```

---

# 40. Core Game State

```ts
type GameState = {
  mode: "daily" | "random";
  difficulty: "easy" | "medium" | "hard";

  puzzle: number[][];
  solution: number[][];
  values: number[][];
  notes: Set<number>[][];

  selectedCell: {
    row: number;
    col: number;
  } | null;

  lives: number;
  hintsUsed: number;
  mistakes: number;
  elapsedSeconds: number;

  isNotesMode: boolean;
  completed: boolean;
};
```

---

# 41. Services

```text
PuzzleGenerator
SudokuSolver
PuzzleValidator
DailyPuzzleService
GameStateManager
SaveManager
StatisticsManager
StreakManager
SettingsManager
AudioManager
AnimationManager
```

---

# 42. Folder Structure

```text
src/
├── app/
├── game/
│   ├── SudokuBoard.ts
│   ├── SudokuCell.ts
│   ├── NumberPad.ts
│   └── GameController.ts
├── sudoku/
│   ├── generator.ts
│   ├── solver.ts
│   ├── validator.ts
│   ├── difficulty.ts
│   └── seed.ts
├── screens/
│   ├── HomeScreen.ts
│   ├── RandomScreen.ts
│   ├── CalendarScreen.ts
│   └── GameScreen.ts
├── services/
│   ├── SaveManager.ts
│   ├── StatisticsManager.ts
│   └── StreakManager.ts
├── ui/
├── styles/
└── assets/
```

---

# 43. Performance

Targets:

```text
Initial load: < 2 seconds on normal broadband
Input response: < 100ms perceived
Puzzle generation: target < 200ms
```

Keep assets small.

Prefer:

```text
SVG
CSS gradients
CSS shapes
WebP/AVIF
```

Avoid unnecessary large raster images.

---

# 44. Offline Capability

After first load, core gameplay should work without network.

Use:

```text
Service Worker
Cache Storage
LocalStorage / IndexedDB
```

No server is required for daily puzzle generation if deterministic seeds are used.

---

# 45. Analytics

Optional events:

```text
game_started
game_completed
game_abandoned
hint_used
mistake
difficulty_selected
calendar_day_selected
random_game_started
```

Do not collect unnecessary personal information.

---

# 46. QA Checklist

## Engine

- [ ] Generated board is valid.
- [ ] Generated board has one solution.
- [ ] Easy/Medium/Hard are valid.
- [ ] Daily seed is deterministic.
- [ ] Random mode produces new puzzles.

## Gameplay

- [ ] Cell selection works.
- [ ] Number placement works.
- [ ] Number removal works.
- [ ] Notes work.
- [ ] Hint works.
- [ ] Impossible-number filter works.
- [ ] Mistakes are detected.
- [ ] Lives decrement.
- [ ] Timer works.
- [ ] Completion works.
- [ ] Resume works.

## Calendar

- [ ] Current date highlighted.
- [ ] Previous dates work.
- [ ] Future dates handled.
- [ ] Completed dates marked.
- [ ] Month navigation works.
- [ ] Streak works.

## Responsive

- [ ] Desktop
- [ ] Mobile portrait
- [ ] Mobile landscape
- [ ] Tablet
- [ ] No horizontal overflow
- [ ] Touch targets ≥44px
- [ ] Keyboard controls work

---

# 47. Visual QA Against Supplied Screenshots

Compare:

### Home

- [ ] Gradient colors
- [ ] Logo position
- [ ] Header position
- [ ] Icon sizes
- [ ] Icon spacing
- [ ] Typography
- [ ] Floating number decorations
- [ ] Vertical composition

### Random

- [ ] Mode icons
- [ ] Difficulty selector
- [ ] Preview size
- [ ] Refresh position
- [ ] Start button
- [ ] Spacing

### Gameplay

- [ ] Grid dimensions
- [ ] Grid position
- [ ] Number size
- [ ] 3×3 separators
- [ ] Header
- [ ] Hearts
- [ ] Star
- [ ] Hint
- [ ] Pencil
- [ ] Keypad
- [ ] Bottom spacing

---

# 48. Development Plan

## Phase 1 — Engine

Build:

```text
solver
generator
validator
uniqueness checker
seeded RNG
```

Acceptance:

```text
1,000 generated puzzles
→ all valid
→ all solvable
→ all unique
```

## Phase 2 — Gameplay

Build:

```text
board
selection
number input
notes
validation
hints
timer
completion
```

## Phase 3 — Visual System

Build:

```text
gradient
logo
header
icons
buttons
background numbers
animations
```

## Phase 4 — Random Mode

Build:

```text
difficulty
preview
randomize
start
```

## Phase 5 — Calendar

Build:

```text
calendar
daily seed
historical dates
completed markers
streak
```

## Phase 6 — Persistence

Build:

```text
save
resume
settings
statistics
```

## Phase 7 — Mobile

Build:

```text
touch controls
safe areas
responsive board
iOS testing
Android testing
```

## Phase 8 — Polish

Build:

```text
sound
particles
micro animations
difficulty evaluator
performance optimization
```

---

# 49. MVP Definition

MVP requires:

```text
✓ Home
✓ Random Sudoku
✓ Easy
✓ Medium
✓ Hard
✓ Preview
✓ Start
✓ 9×9 gameplay
✓ Number keypad
✓ Notes
✓ Hint
✓ Mistake handling
✓ Hearts
✓ Timer
✓ Completion
✓ Calendar
✓ Deterministic daily puzzles
✓ Local save
✓ Settings
✓ Desktop
✓ Mobile
```

---

# 50. Feature Parity Matrix

| Feature | Priority |
|---|---:|
| 9×9 Sudoku | P0 |
| Daily puzzle | P0 |
| Calendar | P0 |
| Random Sudoku | P0 |
| Easy | P0 |
| Medium | P0 |
| Hard | P0 |
| Preview | P0 |
| Hints | P0 |
| Hide impossible numbers | P0 |
| Number keypad | P0 |
| Pencil/notes | P0 |
| Hearts/lives | P0 |
| Timer | P0 |
| Streak | P0 |
| Local persistence | P0 |
| Settings | P0 |
| How to Play | P0 |
| Desktop | P0 |
| Mobile | P0 |
| Tablet | P1 |
| Undo/redo | P1 |
| Statistics | P1 |
| Sound | P1 |
| Achievements | P2 |
| Leaderboard | P2 |
| Cloud save | P2 |

---

# 51. Recommended Build Order

Do not start with decorative screens first.

```text
1. Sudoku solver
       ↓
2. Sudoku generator
       ↓
3. Validator
       ↓
4. Sudoku board
       ↓
5. Cell interaction
       ↓
6. Number keypad
       ↓
7. Notes
       ↓
8. Mistake system
       ↓
9. Hint
       ↓
10. Timer
       ↓
11. Completion
       ↓
12. Random mode
       ↓
13. Calendar
       ↓
14. Persistence
       ↓
15. Visual polish
       ↓
16. Mobile optimization
       ↓
17. QA
       ↓
18. Production build
```

---

# 52. IP / Asset Boundary

The implementation should match the **experience** closely while remaining an original product.

Do not copy:

- Poki branding
- supernice.games branding
- original logo
- original artwork
- original source code
- proprietary sounds
- proprietary puzzle data
- screenshots as production assets

Use:

- Original TypeScript/CSS/HTML
- Original logo
- Original SVG icons
- Original animations
- Properly licensed/open assets

The classic Sudoku rules and general game mechanics can be implemented independently.

---

# 53. Definition of Done

Release when:

```text
[✓] Sudoku engine mathematically correct
[✓] Every generated puzzle has one solution
[✓] Daily puzzle deterministic
[✓] Random puzzles work
[✓] Easy/Medium/Hard work
[✓] Calendar works
[✓] Gameplay polished
[✓] Notes work
[✓] Hints work
[✓] Hearts work
[✓] Timer works
[✓] Completion works
[✓] Progress survives refresh
[✓] Desktop works
[✓] Mobile works
[✓] Tablet works
[✓] Accessibility basics implemented
[✓] Performance acceptable
[✓] Original/licensed assets only
```

---

# 54. Reference

Primary reference:

**Poki — Sudoku Calendar by supernice.games**  
https://poki.com/en/g/sudoku-calendar

The supplied screenshots are the visual reference for the Home, Random Sudoku, and Gameplay screens.
