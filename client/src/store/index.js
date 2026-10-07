import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice.js';
import trip from './tripSlice.js';
import personal from './personalSlice.js';

export default configureStore({ reducer: { auth, trip, personal } });
