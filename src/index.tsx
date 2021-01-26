import ErrorPage from './components/error/ErrorPage';
import LoadingPage from './components/loading/LoadingPage';
import GlobalStyles from './style/GlobalStyles';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import auth, { AuthSettings, getAuthSettings } from './services/authService';
import * as MSAL from '@azure/msal-browser';

const render = (content: JSX.Element) => {
    ReactDOM.render(
        <React.StrictMode>
            <>
                <GlobalStyles />
                {content}
            </>
        </React.StrictMode>,
        document.getElementById('root')
    );
};

(async () => {
    let authSettings: AuthSettings;
    let authClient: MSAL.PublicClientApplication;
    render(<LoadingPage loadingText={'Initializing...'} />);
    try {
        authSettings = await getAuthSettings();
        const clientSettings = {
            auth: {
                clientId: authSettings.clientId,
                authority: authSettings.authority,
            },
        };
        authClient = new MSAL.PublicClientApplication(clientSettings);
        const authInstance = auth(authClient, authSettings.scopes);
        authInstance.logScopes();
        await authInstance.handleLogin();
        render(<App authInstance={authInstance} />);
    } catch (error) {
        render(
            <ErrorPage
                title="Unable to initialize app"
                description="Check your connection or reload this page and try again. If problem persists, contact customer support"
            />
        );
    }
})();
