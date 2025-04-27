import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 🧹 Clear user session on first load
localStorage.removeItem('userId'); 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);