import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Debounce from './helper/Debounce';
import SavingService from './services/SavingService';

ReactDOM.render(
    <React.StrictMode>
        <App
            debounce={new Debounce(300)}
            savingService={new SavingService()}
        />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
