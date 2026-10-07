import { createAsyncThunk } from '@reduxjs/toolkit';

// Wraps an API call so failures become a readable string payload.
export const thunk = (name, fn) =>
  createAsyncThunk(name, async (arg, { rejectWithValue }) => {
    try { return await fn(arg); }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Something went wrong'); }
  });
