import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App'; // Подключаем корневой компонент
import './index.css'; // Подключаем стили

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
