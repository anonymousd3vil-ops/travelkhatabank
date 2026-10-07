import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import store from './store/index.js';
import { Toaster } from 'react-hot-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster position="top-center" toastOptions={{ style: { fontSize: '14px' } }} />
    </BrowserRouter>
  </Provider>
);
