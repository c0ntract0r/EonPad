import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';

const themes = {
    autumn: 'autumn',
    business: 'business'
};

const getThemeFromLocalStorage = () => {
    // By default, take theme setting from local storage. If not exist, default to light
    const theme = localStorage.getItem('theme') || themes.autumn;
    document.documentElement.setAttribute('data-theme', theme);

    return theme;
}

const getUserFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('user')) || null;
}

const initialState = {
    user: getUserFromLocalStorage(),
    theme: getThemeFromLocalStorage()
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            const user = { user: action.payload.username, token: action.payload.user_token.accessToken };
            state.user = user;

            localStorage.setItem('user', JSON.stringify(user));
        },
        logoutUser: (state) => {
            state.user = null;
            // token to remove as well
            localStorage.removeItem('user');
            toast.success('Logged out successfully');
        },
        toggleTheme: (state) => {
            const { autumn, business } = themes;
            state.theme = state.theme === business ? autumn : business;
            document.documentElement.setAttribute('data-theme', state.theme);
            localStorage.setItem('theme', state.theme);
        }
    }
});

export const { loginUser, logoutUser, toggleTheme } = userSlice.actions;

export default userSlice.reducer;