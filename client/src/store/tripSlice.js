import { createSlice } from '@reduxjs/toolkit';
import api from '../api/axios.js';
import { thunk } from './thunk.js';
import { logout } from './authSlice.js';

export const fetchTrips = thunk('trip/list', async () => (await api.get('/trips')).data);
export const fetchTrip = thunk('trip/fetch', async (id) => (await api.get(`/trips/${id}`)).data);
export const fetchEntries = thunk('trip/entries', async (id) => (await api.get(`/trips/${id}/entries`)).data);
export const createTrip = thunk('trip/create', async (b) => (await api.post('/trips', b)).data);
export const addEntry = thunk('trip/addEntry', async ({ id, ...b }) => (await api.post(`/trips/${id}/entries`, b)).data);
export const voidEntry = thunk('trip/voidEntry', async ({ id, eid }) => (await api.patch(`/trips/${id}/entries/${eid}/void`)).data);

const initial = { trips: [], tripsLoaded: false, trip: null, summary: null, entries: [], loaded: false };

const slice = createSlice({
  name: 'trip',
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTrips.fulfilled, (s, a) => { s.trips = a.payload; s.tripsLoaded = true; });
    b.addCase(fetchTrip.pending, (s, a) => { if (s.trip?.id !== a.meta.arg) Object.assign(s, { loaded: false, trip: null, summary: null, entries: [] }); });
    b.addCase(fetchTrip.fulfilled, (s, a) => { s.trip = a.payload.trip; s.summary = a.payload.summary; s.loaded = true; });
    b.addCase(fetchTrip.rejected, (s) => { s.loaded = true; });
    b.addCase(fetchEntries.fulfilled, (s, a) => { s.entries = a.payload; });
    b.addCase(addEntry.fulfilled, (s, a) => { s.entries.unshift(a.payload); });
    b.addCase(voidEntry.fulfilled, (s, a) => { s.entries = s.entries.map((e) => (e._id === a.payload._id ? a.payload : e)); });
    b.addCase(logout, () => initial);
  },
});

export default slice.reducer;
