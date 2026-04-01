// ============================================
// Movie Guess - Game Engine
// ============================================

class MovieAkinator {
  constructor(movies, questions) {
    this.movies = movies;
    this.questions = questions;
    this.candidates = [];
    this.askedQuestions = [];
    this.answers = new Map();
    this.maxQuestions = 10;
    this.currentQuestion = null;
    this.gameActive = false;
  }

  // ============================================
  // Game Control
  // ============================================

  startGame() {
    this.candidates = [...this.movies];
    this.askedQuestions = [];
    this.answers = new Map();
    this.gameActive = true;
    this.selectNextQuestion();
    return this.getGameState();
  }

  answerQuestion(questionId, answer) {
    if (!this.gameActive) return null;

    const question = this.questions.find(q => q.id === questionId);
    if (!question) return null;

    this.answers.set(questionId, answer);
    this.askedQuestions.push(questionId);

    // Filter candidates based on answer
    this.filterCandidates(question, answer);

    // Check if we should end the game
    if (this.askedQuestions.length >= this.maxQuestions || this.candidates.length <= 1) {
      this.gameActive = false;
      return this.getGameState();
    }

    // Select next question
    this.selectNextQuestion();
    return this.getGameState();
  }

  guessNow() {
    this.gameActive = false;
    return this.getGameState();
  }

  restart() {
    return this.startGame();
  }

  // ============================================
  // Question Selection (Variance-Based)
  // ============================================

  selectNextQuestion() {
    // Get questions not yet asked
    const availableQuestions = this.questions.filter(
      q => !this.askedQuestions.includes(q.id)
    );

    if (availableQuestions.length === 0) {
      this.currentQuestion = null;
      return;
    }

    // Find question with highest variance (most discriminative)
    let bestQuestion = null;
    let bestVariance = -1;

    for (const question of availableQuestions) {
      const variance = this.calculateVariance(this.candidates, question);
      if (variance > bestVariance) {
        bestVariance = variance;
        bestQuestion = question;
      }
    }

    this.currentQuestion = bestQuestion;
  }

  calculateVariance(candidates, question) {
    const { attribute, attributeValue } = question;
    
    let yesCount = 0;
    let noCount = 0;

    for (const movie of candidates) {
      const hasAttribute = this.movieHasAttribute(movie, attribute, attributeValue);
      if (hasAttribute) {
        yesCount++;
      } else {
        noCount++;
      }
    }

    // Variance is higher when distribution is more balanced
    const total = candidates.length;
    const yesRatio = yesCount / total;
    const noRatio = noCount / total;
    
    return yesCount > 0 && noCount > 0 
      ? Math.min(yesRatio, noRatio) * 2  // Balance factor
      : 0;
  }

  movieHasAttribute(movie, attribute, attributeValue) {
    const value = movie[attribute];
    if (!value) return false;
    
    if (Array.isArray(value)) {
      return value.some(v => 
        v.toLowerCase() === attributeValue.toLowerCase()
      );
    }
    
    return value.toLowerCase() === attributeValue.toLowerCase();
  }

  // ============================================
  // Candidate Filtering
  // ============================================

  filterCandidates(question, answer) {
    const { attribute, attributeValue } = question;
    const isPositive = answer === 'yes';
    const isNeutral = answer === 'dont_know';

    if (isNeutral) {
      // Don't filter - just continue
      return;
    }

    this.candidates = this.candidates.filter(movie => {
      const hasAttribute = this.movieHasAttribute(movie, attribute, attributeValue);
      
      if (isPositive) {
        return hasAttribute;
      } else {
        return !hasAttribute;
      }
    });
  }

  // ============================================
  // Scoring & Ranking
  // ============================================

  getResults() {
    const scored = this.rankMovies(this.candidates, this.answers);
    return scored.slice(0, 5); // Top 5
  }

  rankMovies(candidates, answers) {
    return candidates
      .map(movie => ({
        movie,
        score: this.scoreMovie(movie, answers)
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        percentage: Math.round((item.score / this.maxQuestions) * 100)
      }));
  }

  scoreMovie(movie, answers) {
    let score = 0;
    const total = this.maxQuestions;

    for (const [questionId, answer] of answers) {
      const question = this.questions.find(q => q.id === questionId);
      if (!question) continue;

      const hasAttribute = this.movieHasAttribute(
        movie,
        question.attribute,
        question.attributeValue
      );

      if (answer === 'yes') {
        score += hasAttribute ? 1 : 0;
      } else if (answer === 'no') {
        score += hasAttribute ? -0.5 : 1;
      }
      // don't_know adds 0
    }

    // Normalize to percentage
    return Math.max(0, score);
  }

  // ============================================
  // Getters
  // ============================================

  getCurrentQuestion() {
    return this.currentQuestion;
  }

  getProgress() {
    return {
      current: this.askedQuestions.length,
      total: this.maxQuestions
    };
  }

  getGameState() {
    return {
      gameActive: this.gameActive,
      currentQuestion: this.currentQuestion,
      progress: this.getProgress(),
      candidatesCount: this.candidates.length,
      results: this.gameActive ? null : this.getResults()
    };
  }
}

// ============================================
// TMDB API Service
// ============================================

class TMDBService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.themoviedb.org/3';
    this.imageUrl = 'https://image.tmdb.org/t/p/w200';
    this.cache = new Map();
  }

  async fetchPopularMovies(page = 1) {
    if (!this.apiKey) return null;
    
    const cacheKey = `popular_${page}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=es-ES&page=${page}`
      );
      
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('TMDB fetch error:', error);
      return null;
    }
  }

  async fetchMovieDetails(movieId) {
    if (!this.apiKey) return null;
    
    const cacheKey = `movie_${movieId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=es-ES`
      );
      
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('TMDB fetch error:', error);
      return null;
    }
  }

  async fetchGenres() {
    if (!this.apiKey) return [];
    
    const cacheKey = 'genres';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=es-ES`
      );
      
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      this.cache.set(cacheKey, data.genres);
      return data.genres;
    } catch (error) {
      console.error('TMDB fetch error:', error);
      return [];
    }
  }

  transformMovie(tmdbMovie, genres, details = null) {
    const movie = details || tmdbMovie;
    
    const movieGenres = genres.filter(g => 
      movie.genres?.some(mg => mg.id === g.id)
    ).map(g => g.name);

    const decade = movie.release_date 
      ? `${Math.floor(parseInt(movie.release_date.split('-')[0]) / 10) * 10}s`
      : 'Unknown';

    return {
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0,
      decade: decade,
      genres: movieGenres,
      keywords: movie.genres?.map(g => g.name.toLowerCase()) || [],
      overview: movie.overview,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      director: 'Unknown', // Requires credits endpoint
      cast: [], // Requires credits endpoint
      themes: []
    };
  }
}

// ============================================
// UI Controller
// ============================================

class UIController {
  constructor(game, tmdbService = null) {
    this.game = game;
    this.tmdbService = tmdbService;
    
    // DOM Elements
    this.views = {
      start: document.getElementById('start-view'),
      game: document.getElementById('game-view'),
      results: document.getElementById('results-view')
    };
    
    this.elements = {
      startBtn: document.getElementById('start-btn'),
      questionText: document.getElementById('question-text'),
      questionCounter: document.getElementById('question-counter'),
      progressFill: document.getElementById('progress-fill'),
      resultsList: document.getElementById('results-list'),
      guessNowBtn: document.getElementById('guess-now-btn'),
      playAgainBtn: document.getElementById('play-again-btn'),
      btnYes: document.getElementById('btn-yes'),
      btnNo: document.getElementById('btn-no'),
      btnDontKnow: document.getElementById('btn-dont-know')
    };
    
    this.bindEvents();
  }

  bindEvents() {
    this.elements.startBtn.addEventListener('click', () => this.startGame());
    this.elements.guessNowBtn.addEventListener('click', () => this.guessNow());
    this.elements.playAgainBtn.addEventListener('click', () => this.restartGame());
    
    this.elements.btnYes.addEventListener('click', () => this.answer('yes'));
    this.elements.btnNo.addEventListener('click', () => this.answer('no'));
    this.elements.btnDontKnow.addEventListener('click', () => this.answer('dont_know'));
  }

  startGame() {
    const state = this.game.startGame();
    this.showView('game');
    this.renderQuestion(state);
  }

  answer(answer) {
    const question = this.game.getCurrentQuestion();
    if (!question) return;

    const state = this.game.answerQuestion(question.id, answer);
    this.renderQuestion(state);
  }

  guessNow() {
    const state = this.game.guessNow();
    this.showView('results');
    this.renderResults(state);
  }

  restartGame() {
    const state = this.game.restart();
    this.showView('game');
    this.renderQuestion(state);
  }

  renderQuestion(state) {
    const { currentQuestion, progress } = state;
    
    // Update progress
    this.elements.questionCounter.textContent = `Pregunta ${progress.current} de ${progress.total}`;
    this.elements.progressFill.style.width = `${(progress.current / progress.total) * 100}%`;

    // Update question
    if (currentQuestion) {
      this.elements.questionText.textContent = currentQuestion.text;
    } else {
      // Game over
      this.showView('results');
      this.renderResults(state);
    }
  }

  renderResults(state) {
    const { results } = state;
    this.elements.resultsList.innerHTML = '';

    if (!results || results.length === 0) {
      this.elements.resultsList.innerHTML = `
        <div class="result-card">
          <p style="text-align: center; width: 100%; color: var(--text-secondary);">
            No encontré coincidencias. ¡Intenta de nuevo!
          </p>
        </div>
      `;
      return;
    }

    results.forEach(result => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <div class="result-rank">${result.rank}</div>
        <div class="result-info">
          <div class="result-title">${result.movie.title}</div>
          <div class="result-year">${result.movie.year || 'Año desconocido'}</div>
        </div>
        <div class="result-score">
          <div class="score-bar-container">
            <div class="score-bar" style="width: ${result.percentage}%"></div>
          </div>
          <span class="score-value">${result.percentage}%</span>
        </div>
      `;
      this.elements.resultsList.appendChild(card);
    });
  }

  showView(viewName) {
    Object.keys(this.views).forEach(key => {
      this.views[key].classList.toggle('hidden', key !== viewName);
    });
  }
}

// ============================================
// App Initialization
// ============================================

async function initApp() {
  // ============================================
  // CONFIGURACIÓN - CAMBIA ESTO POR TU API KEY
  // ============================================
  const TMDB_API_KEY = ''; // Poné tu API key aquí entre las ''
  // ============================================

  let movies = [];
  let questions = [];

  if (TMDB_API_KEY) {
    // Usar TMDB API
    console.log('🎬 Usando TMDB API...');
    const tmdb = new TMDBService(TMDB_API_KEY);
    
    try {
      // Fetch popular movies (páginas 1-3 para tener variedad)
      const allMovies = [];
      for (let page = 1; page <= 3; page++) {
        const data = await tmdb.fetchPopularMovies(page);
        if (data && data.results) {
          allMovies.push(...data.results);
        }
      }
      
      // Fetch genres
      const genres = await tmdb.fetchGenres();
      
      // Transform to our format
      movies = allMovies.slice(0, 100).map(m => tmdb.transformMovie(m, genres));
      console.log(`✅ Cargadas ${movies.length} películas de TMDB`);
      
    } catch (error) {
      console.error('Error con TMDB:', error);
    }
  }

  // Fallback to local data if no API or API failed
  if (movies.length === 0) {
    console.log('📦 Cargando datos locales...');
    
    // Load local data
    const [moviesRes, questionsRes] = await Promise.all([
      fetch('data/movies.json'),
      fetch('data/questions.json')
    ]);
    
    const moviesData = await moviesRes.json();
    const questionsData = await questionsRes.json();
    
    movies = moviesData.movies;
    questions = questionsData.questions;
    
    console.log(`✅ Cargadas ${movies.length} películas locales`);
  }

  // Load questions
  try {
    const questionsRes = await fetch('data/questions.json');
    const questionsData = await questionsRes.json();
    questions = questionsData.questions;
  } catch (e) {
    console.error('Error loading questions:', e);
  }

  // Initialize game
  const game = new MovieAkinator(movies, questions);
  const ui = new UIController(game);
  
  console.log('🎬 Movie Guess listo!');
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
