import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as authService from './services/authService';
import './style/edsIcons';

(async () => {
    try {
        await authService.handleLogin();
        ReactDOM.render(
            <React.StrictMode>
                <>
                    <App />
                </>
            </React.StrictMode>,
            document.getElementById('root')
        );
    } catch (error) {
        console.log(error);
    }
})();
