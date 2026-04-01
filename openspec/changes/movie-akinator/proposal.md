# Proposal: movie-akinator

## Intent

Build a web-based movie identification game that guides users through interactive questions to identify movies they can't remember. The application asks a series of yes/no/maybe questions to narrow down from a movie database to the correct film — similar to the popular Akinator game mechanics.

## Scope

### In Scope
- Question engine with decision tree/filtering logic
- Sample movie database (50-100 movies with attributes: genre, decade, actors, keywords, themes)
- Single-page web UI with question display and answer buttons (Yes/No/Don't Know)
- Results page showing ranked movie matches based on user answers
- Clean, engaging UI with simple animations

### Out of Scope
- User accounts or persistent history
- External API integration (IMDb, TMDB)
- Advanced ML/AI recommendation engine
- Mobile app or PWA
- Real-time multiplayer or leaderboards

## Approach

**Stack**: Vanilla HTML/CSS/JS with Node.js static file server (keep it simple for greenfield).

**Architecture**:
- Client-side question engine (no backend needed for MVP)
- JSON-based movie database with structured attributes
- Simple decision tree algorithm that scores movies based on answer matching

**Database Schema**:
```json
{
  "id": "string",
  "title": "string",
  "year": "number",
  "genres": ["string"],
  "decade": "string",
  "keywords": ["string"],
  "cast": ["string"],
  "director": "string",
  "themes": ["string"]
}
```

**Question Logic**: Pre-defined questions linked to movie attributes. Each answer filters or weights movies, narrowing results progressively.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/data/movies.json` | New | Sample movie database with 50-100 entries |
| `src/data/questions.json` | New | Question database with attribute mappings |
| `src/index.html` | New | Main game UI with question flow |
| `src/js/game.js` | New | Question engine and filtering logic |
| `src/css/styles.css` | New | Game styling and animations |
| `server.js` | New | Simple Node.js static server |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|-------------|
| Movie dataset too small for engaging gameplay | Medium | Start with 50 curated popular movies, expand over time |
| Question logic too linear (boring) | Medium | Add branching questions based on previous answers |
| Single-page may become complex | Low | Keep components small, use clear separation |

## Rollback Plan

Delete the `src/` directory and `server.js` — project returns to empty state. No database migrations or complex deployments to reverse.

## Dependencies

- Node.js v20 (available in environment)
- No external npm packages required for MVP

## Success Criteria

- [ ] User can start a new game and answer 5-15 questions
- [ ] At least 50 sample movies with complete attributes
- [ ] Results page displays top 5 matching movies after questions end
- [ ] UI is responsive and works in modern browsers
- [ ] Game is playable end-to-end without errors