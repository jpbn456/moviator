# movie-akinator Specification

## Purpose

Build a web-based movie identification game where users answer Yes/No/Don't Know questions to identify a movie they can't remember, similar to Akinator mechanics.

## Requirements

### Requirement: Movie Database Structure

The system SHALL store movies with structured attributes for filtering: id (string), title (string), year (number), genres (array), decade (string), keywords (array), cast (array), director (string), themes (array).

#### Scenario: Movie has all attributes

- GIVEN a movie entry with all required attributes
- WHEN the game loads the movie database
- THEN the movie is eligible for matching

#### Scenario: Movie missing required attributes

- GIVEN a movie entry missing any required attribute
- WHEN the game loads the movie database
- THEN that movie SHALL NOT be used for matching

### Requirement: Question Engine

The system SHALL select questions that maximize information gain, prioritizing attributes with high variance across remaining candidates.

#### Scenario: First question selection

- GIVEN a game starts with all movies as candidates
- WHEN the engine selects the first question
- THEN the question SHALL relate to the most discriminative attribute (e.g., genre)

#### Scenario: Question branching

- GIVEN user answers a question with "Yes" or "No"
- WHEN the engine selects the next question
- THEN the next question SHALL be different from previously asked questions on the same attribute

#### Scenario: Answer options

- GIVEN a question is presented to the user
- WHEN the user responds
- THEN the response MUST be one of: "Yes", "No", "Don't Know"

### Requirement: Scoring Algorithm

The system SHALL calculate a match score for each movie based on user answers, where "Yes" adds positive weight, "No" adds negative weight, and "Don't Know" adds zero weight.

#### Scenario: High match score

- GIVEN a movie matches all answered attributes positively
- WHEN scoring is calculated
- THEN that movie SHALL have the highest score among remaining candidates

#### Scenario: Low match score

- GIVEN a movie contradicts user answers on multiple attributes
- WHEN scoring is calculated
- THEN that movie SHALL be ranked lower in results

#### Scenario: Score threshold

- GIVEN scoring is complete
- WHEN displaying results
- THEN movies with zero score SHALL be excluded from results

### Requirement: User Interface

The system SHALL display a single-page UI with a question area, answer buttons, and progress indicator.

#### Scenario: Question display

- GIVEN a question is selected
- WHEN the UI renders
- THEN the question text SHALL be visible with three answer buttons below it

#### Scenario: Progress indicator

- GIVEN the user answers a question
- WHEN the next question loads
- THEN the UI SHALL show current question number and total questions answered

#### Scenario: Results display

- GIVEN the user answers 10 questions or clicks "Guess Now"
- WHEN results are generated
- THEN the top 5 matching movies SHALL be displayed with title, year, and match percentage

### Requirement: User Flow

The system SHALL guide users through: Start → Questions → Results → Restart.

#### Scenario: Game start

- GIVEN the user visits the game page
- WHEN the page loads
- THEN a "Start Game" button SHALL be displayed

#### Scenario: Answering questions

- GIVEN the game is in progress
- WHEN the user clicks an answer button
- THEN the next question SHALL appear after a brief transition

#### Scenario: Game end

- GIVEN the user has answered 10 questions
- WHEN the last answer is processed
- THEN results SHALL be automatically displayed

#### Scenario: Restart

- GIVEN results are displayed
- WHEN the user clicks "Play Again"
- THEN the game SHALL reset to start state

## Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC1 | 50+ movies in database | Count entries in movies.json |
| AC2 | Questions relate to movie attributes | Manual review of questions.json |
| AC3 | Results show top 5 matches | Complete game flow |
| AC4 | UI works in modern browsers | Test in Chrome, Firefox, Safari |
| AC5 | End-to-end game without errors | Manual test full flow |
