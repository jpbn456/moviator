# Technical Design: movie-akinator

## Overview

This document provides the technical architecture for the movie-akinator project — a web-based movie identification game using Akinator-style mechanics with vanilla HTML/CSS/JS and a JSON movie database.

---

## 1. Technical Approach

### Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| Frontend | Vanilla HTML5, CSS3, ES6+ JavaScript | Greenfield simplicity; no build tools needed |
| Data | JSON files (movies.json, questions.json) | Lightweight, no external DB required |
| Server | Node.js static file server | Minimal; serves static assets only |

### Architecture Pattern

**Client-side Single Page Application (SPA)** — no backend processing:

```
┌─────────────────────────────────────────────────────┐
│                    index.html                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  Start View │  │ Game View   │  │Results View│  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
    ┌─────────────────────────────────────────────┐
    │              app.js (Game Engine)           │
    │  - Question selection                        │
    │  - Scoring algorithm                         │
    │  - State management                          │
    └─────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
  ┌─────────────┐    ┌─────────────┐
  │movies.json  │    │questions.json│
  │ (50 movies) │    │ (30+ questions)│
  └─────────────┘    └─────────────┘
```

---

## 2. Architecture Decisions

### 2.1 Question Engine

**Decision**: Weighted entropy-based question selection

**Rationale**: 
- Pre-defined questions linked to movie attributes (genre, decade, keywords, cast, themes)
- Selects next question based on information gain — maximizes discrimination among remaining candidates
- Avoids redundant questions on same attribute

**Algorithm**:
1. Calculate variance for each attribute across current candidate set
2. Select attribute with highest variance
3. Pick unasked question for that attribute
4. If all attributes exhausted, fall back to random unasked question

### 2.2 Scoring Algorithm

**Decision**: Weighted scoring with positive/negative/zero weights

**Formula**:
```
score(movie) = Σ (answer_weight × attribute_match)

where:
- answer_weight ∈ {+1, -1, 0} for Yes/No/Don't Know
- attribute_match = 1 if movie has attribute user confirmed, else 0
- For "No": inverse — subtract if movie HAS the attribute
```

**Ranking**:
1. Calculate score for all remaining candidates
2. Sort by score descending
3. Exclude movies with score ≤ 0
4. Return top 5

### 2.3 UI Pattern

**Decision**: State-driven view switching with CSS classes

**Views**:
- `#start-view`: Initial landing with "Start Game" button
- `#game-view`: Question display with Yes/No/Don't Know buttons + progress bar
- `#results-view`: Ranked movie list with match percentage + "Play Again" button

**Transitions**: CSS fade animations (300ms) between views

---

## 3. Data Flow

### User Journey

```
User Action          →  Game State Update      →  UI Render
────────────────────────────────────────────────────────────
[Start Game]         →  initCandidates(allMovies) → Show Q1
[Answer Q1]          →  updateCandidates(answer) → Show Q2 (or Results)
[Answer QN]          →  calculateScores()       → Show Results
[Play Again]         →  resetState()            → Show Start
```

### Data Structures

#### Game State (in-memory)
```javascript
{
  candidates: Movie[],        // Movies still in consideration
  askedQuestions: string[],  // IDs of answered questions
  answers: Map<string, string>, // questionId → "yes"|"no"|"don't_know"
  currentQuestion: Question,  // Active question
  questionCount: number       // Total answered
}
```

#### Question Object
```javascript
{
  id: string,
  text: string,              // Human-readable question
  attribute: string,         // "genre"|"decade"|"keyword"|"cast"|"theme"
  attributeValue: string,    // The specific value being asked about
  category: string           // Grouping for UI (optional)
}
```

#### Movie Object
```javascript
{
  id: string,
  title: string,
  year: number,
  decade: "1970s"|"1980s"|"1990s"|"2000s"|"2010s"|"2020s",
  genres: string[],
  keywords: string[],
  cast: string[],
  director: string,
  themes: string[]
}
```

---

## 4. File Structure

```
src/
├── index.html          # Single HTML entry point
├── css/
│   └── styles.css     # All styles + animations
├── js/
│   └── app.js         # Game engine + logic
├── data/
│   ├── movies.json    # 50+ movie entries
│   └── questions.json # 30+ questions
└── assets/
    └── (optional images)
server.js              # Node.js static server
```

### File Responsibilities

| File | Responsibility |
|------|----------------|
| `index.html` | View container, button elements, progress display |
| `css/styles.css` | Layout, colors, typography, transitions, responsive |
| `js/app.js` | Question engine, scoring, state, DOM manipulation |
| `data/movies.json` | Movie data with all attributes |
| `data/questions.json` | Questions mapped to attributes |
| `server.js` | HTTP server for static file serving |

---

## 5. Movie Database Structure

### Schema (movies.json)

```json
{
  "movies": [
    {
      "id": "m001",
      "title": "The Matrix",
      "year": 1999,
      "decade": "1990s",
      "genres": ["Action", "Sci-Fi"],
      "keywords": ["simulation", "martial arts", "dystopia", "bullet time"],
      "cast": ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
      "director": "Lana Wachowski",
      "themes": ["reality", "freedom", "technology"]
    }
  ]
}
```

### Attributes Summary

| Attribute | Type | Purpose |
|-----------|------|---------|
| `id` | string | Unique identifier |
| `title` | string | Display name |
| `year` | number | Release year |
| `decade` | string | Decade bucket for grouping |
| `genres` | string[] | Primary categories |
| `keywords` | string[] | Discriminating terms |
| `cast` | string[] | Notable actors |
| `director` | string | Filmmaker |
| `themes` | string[] | Thematic elements |

### Data Requirements

- Minimum 50 movies for gameplay variety
- Each movie should have 3-5 genres, 4-6 keywords, 3-5 cast members
- Diverse decade and genre distribution for question variety

---

## 6. Question Selection Algorithm

### Pseudocode

```
function selectNextQuestion(candidates, askedQuestions, questions):
  // Step 1: Group questions by attribute
  attributeGroups = groupBy(questions, 'attribute')
  
  // Step 2: Calculate variance per attribute in candidates
  attributeScores = {}
  for each attribute in attributeGroups:
    variance = calculateVariance(candidates, attribute)
    attributeScores[attribute] = variance
  
  // Step 3: Pick highest-variance attribute
  bestAttribute = max(attributeScores)
  
  // Step 4: Find unasked question for this attribute
  available = attributeGroups[bestAttribute].filter(
    q => !askedQuestions.includes(q.id)
  )
  
  if available.length > 0:
    return available[0]  // First unasked question
  
  // Step 5: Fallback — any unasked question
  fallback = questions.filter(q => !askedQuestions.includes(q.id))
  return fallback[0] || null
```

### Variance Calculation

Simple heuristic: count unique values for attribute in candidate set.
- High unique count = high variance = high information potential

### Question Categories (questions.json)

```json
{
  "questions": [
    {
      "id": "q001",
      "text": "Is it an Action movie?",
      "attribute": "genre",
      "attributeValue": "Action"
    },
    {
      "id": "q002",
      "text": "Is it from the 1990s?",
      "attribute": "decade",
      "attributeValue": "1990s"
    },
    {
      "id": "q003",
      "text": "Does it have Keanu Reeves?",
      "attribute": "cast",
      "attributeValue": "Keanu Reeves"
    }
  ]
}
```

---

## 7. Testing Strategy

### Unit Testing (manual or framework)

| Component | Test Case |
|-----------|-----------|
| `selectNextQuestion()` | Returns valid question for empty asked set |
| `selectNextQuestion()` | Avoids already-asked questions |
| `calculateScore()` | Yes answer adds +1 for matching attribute |
| `calculateScore()` | No answer subtracts for matching attribute |
| `calculateScore()` | Don't Know adds 0 |
| `rankMovies()` | Excludes zero-score movies |
| `rankMovies()` | Returns top 5 sorted descending |

### Integration Testing

| Scenario | Expected |
|----------|----------|
| Start game → 10 questions answered → Results | Top 5 movies displayed |
| Start game → Click "Guess Now" before 10 | Results displayed immediately |
| Results → Click "Play Again" | Returns to start view, state reset |
| Empty candidates (impossible) | Show "No matches" message |

### Browser Testing

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile viewport (375px width)

### Manual Test Script

```
1. Open index.html in browser
2. Click "Start Game"
3. Verify first question appears
4. Answer 5 questions with "Yes", 5 with "No"
5. Verify progress counter updates (X/10)
6. After 10th answer, verify results view
7. Verify top 5 movies have match percentages
8. Click "Play Again"
9. Verify start view reappears
```

---

## 8. API/Module Design (app.js)

### Public Interface

```javascript
// Game class
class MovieAkinator {
  constructor(movies, questions)
  startGame(): void
  answerQuestion(questionId, answer): Question | Results
  getCurrentQuestion(): Question
  getProgress(): { current: number, total: number }
  getResults(): MovieScore[]
  restart(): void
}

// Utility functions
function calculateVariance(candidates, attribute): number
function scoreMovie(movie, answers): number
function rankMovies(candidates, answers): MovieScore[]
```

---

## 9. Security Considerations

- No user input sanitization needed (pre-defined questions only)
- No sensitive data storage
- No external API calls
- Local JSON data only

---

## 10. Performance Targets

| Metric | Target |
|--------|--------|
| Initial load | < 500ms |
| Question transition | < 100ms |
| Score calculation | < 50ms for 50 movies |
| Memory footprint | < 5MB |

---

## 11. Dependencies

- Node.js v20+ (for server.js)
- No npm packages required for MVP
- Modern browsers: ES6+ support (all major browsers since 2018)

---

## 12. Future Considerations (Out of Scope)

These can be addressed in future changes:
- Add more movies to database
- Expand question set
- Add hint system
- Save game history to localStorage
- Add difficulty levels (fewer questions = harder)

---

*Design created for movie-akinator change.*
*Mode: openspec + Engram (hybrid)*