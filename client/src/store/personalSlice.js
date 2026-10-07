import { createSlice } from '@reduxjs/toolkit';
import api from '../api/axios.js';
import { thunk } from './thunk.js';
import { logout } from './authSlice.js';

export const fetchPersonal = thunk('personal/fetch', async () => (await api.get('/personal')).data);
export const addPersonal = thunk('personal/add', async (b) => (await api.post('/personal', b)).data);
export const removePersonal = thunk('personal/remove', async (id) => (await api.delete(`/personal/${id}`)).data);

const slice = createSlice({
  name: 'personal',
  initialState: { items: [] },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPersonal.fulfilled, (s, a) => { s.items = a.payload; });
    b.addCase(addPersonal.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(removePersonal.fulfilled, (s, a) => { s.items = s.items.filter((i) => i._id !== a.payload.id); });
    b.addCase(logout, () => ({ items: [] }));
  },
});

export default slice.reducer;
