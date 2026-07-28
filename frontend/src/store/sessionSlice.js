import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sessionAPI } from '../services/api';

export const startSession = createAsyncThunk('session/start', async (config, { rejectWithValue }) => {
  try {
    const response = await sessionAPI.start(config);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to start session');
  }
});

export const submitAnswer = createAsyncThunk('session/submitAnswer', async ({ sessionId, data }, { rejectWithValue }) => {
  try {
    const response = await sessionAPI.submitAnswer(sessionId, data);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to submit answer');
  }
});

export const completeSession = createAsyncThunk('session/complete', async (sessionId, { rejectWithValue }) => {
  try {
    const response = await sessionAPI.complete(sessionId);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to complete session');
  }
});

export const fetchSessionResults = createAsyncThunk('session/results', async (sessionId, { rejectWithValue }) => {
  try {
    const response = await sessionAPI.getResults(sessionId);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch results');
  }
});

export const fetchSessionHistory = createAsyncThunk('session/history', async (_, { rejectWithValue }) => {
  try {
    const response = await sessionAPI.getHistory();
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
  }
});

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    currentSession: null,
    currentQuestion: null,
    currentQuestionIndex: 0,
    questions: [],
    answers: [],
    feedback: null,
    results: null,
    history: [],
    difficulty: 'Medium',
    consecutiveHighScores: 0,
    consecutiveLowScores: 0,
    isLoading: false,
    isSubmitting: false,
    error: null,
    timerSeconds: 0,
    timerActive: false,
  },
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
      state.feedback = null;
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
      if (state.currentQuestionIndex < state.questions.length) {
        state.currentQuestion = state.questions[state.currentQuestionIndex];
      }
      state.feedback = null;
      state.timerSeconds = 0;
    },
    setFeedback: (state, action) => {
      state.feedback = action.payload;
    },
    adjustDifficulty: (state, action) => {
      const score = action.payload;
      if (score >= 8) {
        state.consecutiveHighScores += 1;
        state.consecutiveLowScores = 0;
        if (state.consecutiveHighScores >= 3) {
          if (state.difficulty === 'Easy') state.difficulty = 'Medium';
          else if (state.difficulty === 'Medium') state.difficulty = 'Hard';
          state.consecutiveHighScores = 0;
        }
      } else if (score <= 5) {
        state.consecutiveLowScores += 1;
        state.consecutiveHighScores = 0;
        if (state.consecutiveLowScores >= 3) {
          if (state.difficulty === 'Hard') state.difficulty = 'Medium';
          else if (state.difficulty === 'Medium') state.difficulty = 'Easy';
          state.consecutiveLowScores = 0;
        }
      } else {
        state.consecutiveHighScores = 0;
        state.consecutiveLowScores = 0;
      }
    },
    setTimer: (state, action) => {
      state.timerSeconds = action.payload;
    },
    toggleTimer: (state, action) => {
      state.timerActive = action.payload;
    },
    resetSession: (state) => {
      state.currentSession = null;
      state.currentQuestion = null;
      state.currentQuestionIndex = 0;
      state.questions = [];
      state.answers = [];
      state.feedback = null;
      state.results = null;
      state.timerSeconds = 0;
      state.timerActive = false;
      state.consecutiveHighScores = 0;
      state.consecutiveLowScores = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSession.pending, (state) => { state.isLoading = true; })
      .addCase(startSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload.session;
        state.questions = action.payload.questions;
        state.currentQuestion = action.payload.questions[0];
        state.currentQuestionIndex = 0;
        state.answers = [];
        state.timerActive = true;
      })
      .addCase(startSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(submitAnswer.pending, (state) => { state.isSubmitting = true; })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.feedback = action.payload.feedback;
        state.answers.push(action.payload);
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })
      .addCase(completeSession.fulfilled, (state, action) => {
        state.results = action.payload;
        state.timerActive = false;
      })
      .addCase(fetchSessionResults.fulfilled, (state, action) => {
        state.results = action.payload;
      })
      .addCase(fetchSessionHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      });
  },
});

export const {
  setCurrentQuestion, nextQuestion, setFeedback, adjustDifficulty,
  setTimer, toggleTimer, resetSession,
} = sessionSlice.actions;
export default sessionSlice.reducer;
