# movie-akinator Tasks

## Phase 1: Foundation (Setup & Data)

### 1.1 Create Project Directory Structure
- [ ] Create `src/` directory
- [ ] Create `src/css/` subdirectory
- [ ] Create `src/js/` subdirectory
- [ ] Create `src/data/` subdirectory
- [ ] Create `src/assets/` subdirectory (optional, for future use)
- [ ] Verify all directories created correctly

### 1.2 Create Movie Database JSON
- [ ] Create `src/data/movies.json` with root "movies" array
- [ ] Add 20-30 movies with complete attributes (id, title, year, decade, genres, keywords, cast, director, themes)
- [ ] Ensure diverse decade distribution (1970s-2020s)
- [ ] Ensure diverse genre distribution (Action, Comedy, Drama, Sci-Fi, Horror, etc.)
- [ ] Each movie should have 3-5 genres, 4-6 keywords, 3-5 cast members
- [ ] Validate JSON syntax (no trailing commas, proper quotes)
- [ ] Verify at least 20 movies in database

### 1.3 Create Questions JSON
- [ ] Create `src/data/questions.json` with root "questions" array
- [ ] Add 15-20 questions with complete attributes (id, text, attribute, attributeValue)
- [ ] Map questions to movie attributes: genre, decade, keyword, cast, theme
- [ ] Ensure at least 3 questions per attribute category
- [ ] Write questions in natural, game-friendly language
- [ ] Validate JSON syntax
- [ ] Verify question count (minimum 15)

---

## Phase 2: Core Implementation (HTML/CSS/JS)

### 2.1 Create index.html
- [ ] Create `src/index.html` with HTML5 boilerplate
- [ ] Add viewport meta tag for responsive design
- [ ] Add links to css/styles.css and js/app.js
- [ ] Create `#start-view` container with "Start Game" button
- [ ] Create `#game-view` container with:
  - Question text display area
  - Progress indicator (current/total)
  - Progress bar element
  - Three answer buttons (Yes, No, Don't Know)
  - "Guess Now" button to skip remaining questions
- [ ] Create `#results-view` container with:
  - Results list container
  - "Play Again" button
- [ ] Add hidden class utility for view switching
- [ ] Verify all required elements present

### 2.2 Create styles.css
- [ ] Create `src/css/styles.css`
- [ ] Add CSS reset/normalize styles
- [ ] Set up CSS custom properties (colors, fonts, spacing)
- [ ] Style body with centered content, dark theme
- [ ] Style `#start-view`:
  - Centered title and subtitle
  - Prominent "Start Game" button with hover effect
- [ ] Style `#game-view`:
  - Question text with large readable font
  - Progress bar with fill animation
  - Three answer buttons in a row (flexbox)
  - "Guess Now" secondary button
- [ ] Style `#results-view`:
  - Results list with movie cards
  - Each card: title, year, match percentage bar
  - "Play Again" button
- [ ] Add `.hidden` class for view display toggle
- [ ] Add fade transition animations (300ms)
- [ ] Add responsive styles for mobile (max-width: 480px)
- [ ] Verify CSS loads without errors

### 2.3 Create app.js (Game Engine)
- [ ] Create `src/js/app.js`
- [ ] Create `MovieAkinator` class with constructor(movies, questions)
- [ ] Implement `startGame()` method:
  - Reset game state (candidates, askedQuestions, answers)
  - Load all movies as candidates
  - Select first question
  - Switch to game view
- [ ] Implement `answerQuestion(questionId, answer)` method:
  - Store answer in answers map
  - Add questionId to askedQuestions
  - Update candidates based on answer
  - Check if max questions reached
  - Select next question or end game
- [ ] Implement `getCurrentQuestion()` method
- [ ] Implement `getProgress()` method returning { current, total }
- [ ] Implement `getResults()` method returning ranked MovieScore[]
- [ ] Implement `restart()` method
- [ ] Implement helper function `calculateVariance(candidates, attribute)`
- [ ] Implement helper function `scoreMovie(movie, answers)`
- [ ] Implement helper function `rankMovies(candidates, answers)`
- [ ] Implement `selectNextQuestion()` using variance-based selection
- [ ] Add DOM manipulation functions:
  - Render question in game view
  - Update progress indicator
  - Render results list
  - Switch views with transitions
- [ ] Add event listeners for all buttons
- [ ] Initialize game on DOMContentLoaded
- [ ] Verify all methods work correctly

---

## Phase 3: Integration & Polish

### 3.1 Connect All Components
- [ ] Verify index.html links to correct CSS and JS files
- [ ] Verify movies.json loads correctly in app.js
- [ ] Verify questions.json loads correctly in app.js
- [ ] Test game initialization (click Start Game)
- [ ] Test question rendering and answer flow
- [ ] Test view transitions (start → game → results → start)
- [ ] Test "Guess Now" button skips to results
- [ ] Test "Play Again" resets game completely
- [ ] Verify no console errors

### 3.2 Add Transitions and Animations
- [ ] Add CSS fade-in animation for question text
- [ ] Add button press/active states
- [ ] Add progress bar smooth fill animation
- [ ] Add results cards staggered entrance animation
- [ ] Add subtle hover effects on all interactive elements
- [ ] Ensure animations are smooth (60fps target)
- [ ] Test prefers-reduced-motion (accessibility)

### 3.3 Test Full Flow
- [ ] Complete full game from start to results (5 times)
- [ ] Test edge cases:
  - Answer all "Yes" → verify results
  - Answer all "No" → verify results
  - Answer all "Don't Know" → verify results
  - Click "Guess Now" immediately → verify results
  - Click "Guess Now" after 1 question → verify results
- [ ] Verify top 5 results display correctly
- [ ] Verify match percentages calculate correctly
- [ ] Verify progress counter updates correctly (1/10, 2/10, etc.)
- [ ] Test responsiveness on mobile viewport (375px)
- [ ] Test in Chrome, Firefox, Safari
- [ ] Verify no JavaScript errors in console

---

## Task Dependencies

```
Phase 1:
├─ 1.1 (prerequisite for all)
├─ 1.2 (requires 1.1)
└─ 1.3 (requires 1.1)

Phase 2:
├─ 2.1 (requires 1.1)
├─ 2.2 (independent)
└─ 2.3 (requires 1.2, 1.3, 2.1)

Phase 3:
├─ 3.1 (requires 2.1, 2.2, 2.3)
├─ 3.2 (requires 3.1)
└─ 3.3 (requires 3.2)
```

---

## Notes

- Maximum questions per game: 10 (configurable)
- Results displayed: Top 5 movies
- Scoring weights: Yes = +1, No = -1, Don't Know = 0
- Question selection: Variance-based (highest information gain)
