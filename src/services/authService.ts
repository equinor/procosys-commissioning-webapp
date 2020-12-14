import * as Msal from '@azure/msal-browser';
import { AsyncStatus } from '../contexts/UserContext';

const msalConfig = {
    auth: {
        clientId: 'fb57fb35-f927-4271-9976-342070cb9f54',
        authority:
            'https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/',
    },
};

const MSAL = new Msal.PublicClientApplication(msalConfig);

const scopes = [
    'api://47641c40-0135-459b-8ab4-459e68dc8d08/web_api',
    'User.Read',
];

export const logout = async () => {
    return await MSAL.logout();
};

export const login = async () => {
    if (!getCurrentUser()) MSAL.loginRedirect({ scopes: scopes });
};

export const getCurrentUser = (): Msal.AccountInfo | null => {
    const account = MSAL.getAllAccounts()[0];
    if (!account) return null;
    return account;
};

export const getUserName = (): string | undefined => {
    return getCurrentUser()?.username;
};

export const getAccessToken = async () => {
    try {
        const account = MSAL.getAllAccounts()[0];
        const silentTokenResponse = await MSAL.acquireTokenSilent({
            account,
            scopes,
        });
        return Promise.resolve(silentTokenResponse.accessToken);
    } catch (error) {
        console.log('Token acquisition failed, redirecting');
        MSAL.loginRedirect({ scopes: scopes });
        return Promise.reject(error as Msal.AuthError);
    }
};

const isLoggedIn = async () => {
    const cachedAccount = MSAL.getAllAccounts()[0];
    if (cachedAccount == null) return Promise.reject();
    try {
        // User is able to get accessToken, no login required
        await getAccessToken();
        return Promise.resolve();
    } catch {
        return Promise.reject();
    }
};

export const handleLogin = async () => {
    const redirectFromSigninResponse = await MSAL.handleRedirectPromise();
    if (redirectFromSigninResponse !== null) {
        return Promise.resolve(AsyncStatus.SUCCESS);
    }
    try {
        await isLoggedIn();
        return Promise.resolve(AsyncStatus.SUCCESS);
    } catch {
        login();
        return Promise.reject(AsyncStatus.ERROR);
    }
};
