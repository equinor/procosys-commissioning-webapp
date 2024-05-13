import ErrorPage from './components/error/ErrorPage';
import LoadingPage from './components/loading/LoadingPage';
import GlobalStyles from './style/GlobalStyles';
import React from 'react';
import App from './App';
import authService from './services/authService';
import * as MSAL from '@azure/msal-browser';
import baseApiService from './services/baseApi';
import procosysApiService from './services/procosysApi';
import { getAppConfig, getAuthConfig } from './services/appConfiguration';
import initializeAppInsights from './services/appInsights';
import ReactDOM from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

const render = (content: JSX.Element): void => {
    const root = ReactDOM.createRoot(document.getElementById('root')!);
    root.render(
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            <GlobalStyles />
            {content}
            {/* document.getElementById('root') */}
        </StyleSheetManager>
    );
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const initialize = async () => {
    // Get auth config, setup auth client and handle login
    const {
        clientSettings,
        scopes,
        configurationScope,
        configurationEndpoint,
    } = await getAuthConfig();

    const authClient = new MSAL.PublicClientApplication(clientSettings);
    await authClient.initialize();
    const authInstance = authService({
        MSAL: authClient,
        scopes: scopes,
    });
    const isRedirecting = await authInstance.handleLogin();
    if (isRedirecting) return Promise.reject('redirecting');

    // Get config from App Configuration
    const configurationAccessToken = await authInstance.getAccessToken(
        configurationScope
    );

    const { appConfig, featureFlags } = await getAppConfig(
        configurationEndpoint,
        configurationAccessToken
    );
    const baseApiInstance = baseApiService({
        authInstance,
        baseURL: appConfig.procosysWebApi.baseUrl,
        scope: appConfig.procosysWebApi.scope,
    });

    const procosysApiInstance = procosysApiService({
        axios: baseApiInstance,
        apiVersion: appConfig.procosysWebApi.apiVersion,
    });
    const { appInsightsInstance, appInsightsReactPlugin } =
        initializeAppInsights(appConfig.appInsights.instrumentationKey);
    return {
        authInstance,
        procosysApiInstance,
        appInsightsInstance,
        appInsightsReactPlugin,
        appConfig,
        featureFlags,
    };
};

(async (): Promise<void> => {
    render(<LoadingPage loadingText={'Initializing...'} />);
    try {
        const {
            authInstance,
            procosysApiInstance,
            appInsightsInstance,
            appInsightsReactPlugin,
            appConfig,
            featureFlags,
        } = await initialize();
        render(
            <App
                authInstance={authInstance}
                procosysApiInstance={procosysApiInstance}
                appInsightsInstance={appInsightsInstance}
                appInsightsReactPlugin={appInsightsReactPlugin}
                appConfig={appConfig}
                featureFlags={featureFlags}
            />
        );
    } catch (error) {
        console.log(error);
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

// This implements the default behavior from styled-components v5
export function shouldForwardProp(propName: string, target: any) {
    if (typeof target === 'string') {
        // For HTML elements, forward the prop if it is a valid HTML attribute
        return isPropValid(propName);
    }
    // For other elements, forward all props
    return true;
}
