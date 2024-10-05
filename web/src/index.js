import React from 'react';
import ReactDOM from 'react-dom/client'; // 変更点: createRootを使用するためにReactDOMからimport
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // createRootを使う
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);