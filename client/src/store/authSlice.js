import { createSlice } from '@reduxjs/toolkit';
import api from '../api/axios.js';
import { thunk } from './thunk.js';

export const login = thunk('auth/login', async (b) => (await api.post('/auth/login', b)).data);
export const register = thunk('auth/register', async (b) => (await api.post('/auth/register', b)).data);

const saved = JSON.parse(localStorage.getItem('tkb') || 'null');

const slice = createSlice({
  name: 'auth',
  initialState: { user: saved?.user || null, token: saved?.token || null, loading: false, error: null },
  reducers: {
    logout(s) { s.user = null; s.token = null; localStorage.removeItem('tkb'); },
    clearError(s) { s.error = null; },
  },
  extraReducers: (b) => {
    [login, register].forEach((t) => {
      b.addCase(t.pending, (s) => { s.loading = true; s.error = null; });
      b.addCase(t.fulfilled, (s, a) => {
        s.loading = false; s.user = a.payload.user; s.token = a.payload.token;
        localStorage.setItem('tkb', JSON.stringify(a.payload));
      });
      b.addCase(t.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    });
  },
});

export const { logout, clearError } = slice.actions;
export default slice.reducer;
