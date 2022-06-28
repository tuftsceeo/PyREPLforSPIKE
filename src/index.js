/*
 * index.js
 * By: Gabriel Sessions
 * Last Edit: 6/24/2022
 * 
 * Renders all of the react app content in the DOM 
 * 
 */ 

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

