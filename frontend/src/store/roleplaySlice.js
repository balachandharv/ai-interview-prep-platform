import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roleplayAPI } from '../services/api';

export const startRoleplay = createAsyncThunk('roleplay/start', async (config, { rejectWithValue }) => {
  try {
    const response = await roleplayAPI.start(config);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to start roleplay');
  }
});

export const sendRoleplayMessage = createAsyncThunk('roleplay/message', async ({ sessionId, message }, { rejectWithValue }) => {
  try {
    const response = await roleplayAPI.sendMessage(sessionId, message);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send message');
  }
});

export const completeRoleplay = createAsyncThunk('roleplay/complete', async (sessionId, { rejectWithValue }) => {
  try {
    const response = await roleplayAPI.complete(sessionId);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to complete roleplay');
  }
});

export const fetchRoleplayResults = createAsyncThunk('roleplay/results', async (sessionId, { rejectWithValue }) => {
  try {
    const response = await roleplayAPI.getResults(sessionId);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch results');
  }
});

const roleplaySlice = createSlice({
  name: 'roleplay',
  initialState: {
    currentSession: null,
    persona: null,
    messages: [],
    questionCount: 0,
    maxQuestions: 8,
    isAIThinking: false,
    isComplete: false,
    results: null,
    history: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setPersona: (state, action) => {
      state.persona = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setAIThinking: (state, action) => {
      state.isAIThinking = action.payload;
    },
    setComplete: (state, action) => {
      state.isComplete = action.payload;
    },
    incrementQuestion: (state) => {
      state.questionCount += 1;
    },
    resetRoleplay: (state) => {
      state.currentSession = null;
      state.persona = null;
      state.messages = [];
      state.questionCount = 0;
      state.isAIThinking = false;
      state.isComplete = false;
      state.results = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startRoleplay.pending, (state) => { state.isLoading = true; })
      .addCase(startRoleplay.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload.session;
        state.messages = action.payload.messages || [];
        state.maxQuestions = action.payload.maxQuestions || 8;
      })
      .addCase(startRoleplay.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(sendRoleplayMessage.pending, (state) => { state.isAIThinking = true; })
      .addCase(sendRoleplayMessage.fulfilled, (state, action) => {
        state.isAIThinking = false;
        if (action.payload.aiMessage) {
          state.messages.push(action.payload.aiMessage);
        }
        state.questionCount = action.payload.questionCount || state.questionCount;
        state.isComplete = action.payload.isComplete || false;
      })
      .addCase(sendRoleplayMessage.rejected, (state, action) => {
        state.isAIThinking = false;
        state.error = action.payload;
      })
      .addCase(completeRoleplay.fulfilled, (state, action) => {
        state.results = action.payload;
        state.isComplete = true;
      })
      .addCase(fetchRoleplayResults.fulfilled, (state, action) => {
        state.results = action.payload;
      });
  },
});

export const {
  setPersona, addMessage, setAIThinking, setComplete,
  incrementQuestion, resetRoleplay,
} = roleplaySlice.actions;
export default roleplaySlice.reducer;
