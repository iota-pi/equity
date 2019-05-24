import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import smoothscroll from 'smoothscroll-polyfill';

// Start smoothscroll polyfill
smoothscroll.polyfill();

ReactDOM.render(<App />, document.getElementById('root'));
