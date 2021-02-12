import ErrorPage from './components/error/ErrorPage';
import LoadingPage from './components/loading/LoadingPage';
import GlobalStyles from './style/GlobalStyles';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import authService, { getAuthSettings } from './services/authService';
import * as MSAL from '@azure/msal-browser';
import baseApiService, { getApiSettings } from './services/baseApi';
import procosysApiService from './services/procosysApi';

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

const initialize = async () => {
    const {
        clientSettings,
        scopes,
        configurationScope,
        configurationEndpoint,
    } = await getAuthSettings();
    const authClient = new MSAL.PublicClientApplication(clientSettings);
    const authInstance = authService({
        MSAL: authClient,
        scopes: scopes,
    });
    const isRedirecting = await authInstance.handleLogin();
    if (isRedirecting) return Promise.reject('redirecting');
    const configurationAccessToken = await authInstance.getAccessToken(
        configurationScope
    );
    const procosysApiSettings = await getApiSettings(
        configurationEndpoint,
        configurationAccessToken
    );
    const baseApiInstance = baseApiService({
        authInstance,
        baseURL: procosysApiSettings.baseUrl,
        scope: procosysApiSettings.scope,
    });
    const procosysApiInstance = procosysApiService({
        axios: baseApiInstance,
        apiVersion: procosysApiSettings.apiVersion,
    });
    return { authInstance, procosysApiInstance };
};

(async () => {
    render(<LoadingPage loadingText={'Initializing...'} />);
    try {
        const { authInstance, procosysApiInstance } = await initialize();
        render(
            <App
                authInstance={authInstance}
                procosysApiInstance={procosysApiInstance}
            />
        );
    } catch (error) {
        console.log('ERRORERROR', error);
        if (error === 'redirecting') {
            render(<LoadingPage loadingText={'Redirecting to login...'} />);
        } else {
            render(
                <ErrorPage
                    title="Unable to initialize app"
                    description="Check your connection or reload this page and try again. If problem persists, contact customer support"
                />
            );
        }
    }
})();
