import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as authService from './services/authService';

if (process.env.REACT_APP_MSAL_CLIENT_ID) authService.handleLogin();

ReactDOM.render(
    <React.StrictMode>
        <>
            <App />
        </>
    </React.StrictMode>,
    document.getElementById('root')
);
