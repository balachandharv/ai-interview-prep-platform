import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import sessionReducer from './sessionSlice';
import questionReducer from './questionSlice';
import roleplayReducer from './roleplaySlice';
import uiReducer from './uiSlice';
import { injectStore } from '../services/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    session: sessionReducer,
    questions: questionReducer,
    roleplay: roleplayReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['session/setTimer'],
      },
    }),
});

injectStore(store);

export default store;
