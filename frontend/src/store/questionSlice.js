import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { questionAPI } from '../services/api';

export const fetchQuestions = createAsyncThunk('questions/fetch', async (filters, { rejectWithValue }) => {
  try {
    const response = await questionAPI.getAll(filters);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch questions');
  }
});

export const toggleBookmark = createAsyncThunk('questions/bookmark', async ({ questionId, isBookmarked }, { rejectWithValue }) => {
  try {
    if (isBookmarked) {
      await questionAPI.removeBookmark(questionId);
    } else {
      await questionAPI.addBookmark(questionId);
    }
    return { questionId, isBookmarked: !isBookmarked };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to toggle bookmark');
  }
});

const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    items: [],
    totalPages: 0,
    currentPage: 0,
    filters: { category: '', difficulty: '', role: '', company: '', search: '' },
    isLoading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 0;
    },
    clearFilters: (state) => {
      state.filters = { category: '', difficulty: '', role: '', company: '', search: '' };
      state.currentPage = 0;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => { state.isLoading = true; })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.content || action.payload;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        const { questionId, isBookmarked } = action.payload;
        const question = state.items.find(q => q.id === questionId);
        if (question) question.bookmarked = isBookmarked;
      });
  },
});

export const { setFilters, clearFilters, setPage } = questionSlice.actions;
export default questionSlice.reducer;
