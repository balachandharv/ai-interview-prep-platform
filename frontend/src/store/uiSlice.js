import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    mobileSidebarOpen: false,
    activeModal: null,
    modalData: null,
    notifications: [],
    unreadCount: 0,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload.name;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markNotificationsRead: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const {
  toggleSidebar, toggleMobileSidebar, openModal, closeModal,
  addNotification, markNotificationsRead,
} = uiSlice.actions;
export default uiSlice.reducer;
