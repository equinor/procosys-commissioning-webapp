import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyle from './GlobalStyle';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container as HTMLElement);
const GlobalStylesProxy: any = GlobalStyle; // TODO: remove once @types/styled-components is updated to work with react 18

root.render(
    <React.StrictMode>
        <GlobalStylesProxy />
        <App />
    </React.StrictMode>
);
