import { configureStore } from "@reduxjs/toolkit";

import userReducer from './features/user/userSlice';
import notesReducer from './features/notes/noteSlice';

export const store = configureStore({
    reducer: {
        userState: userReducer,
        noteState: notesReducer
    },
});