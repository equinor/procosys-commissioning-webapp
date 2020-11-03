import * as Msal from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: 'fb57fb35-f927-4271-9976-342070cb9f54',
        authority:
            'https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/',
        redirectURI: 'http://localhost:3000',
    },
};

export const MSAL = new Msal.PublicClientApplication(msalConfig);

const scopes = [
    'api://47641c40-0135-459b-8ab4-459e68dc8d08/web_api',
    'User.Read',
];

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
        console.log('Token acquisition failed: ', error);
        return Promise.reject(error as Msal.AuthError);
    }
};

export const handleLogin = async () => {
    try {
        const redirectFromSigninResponse = await MSAL.handleRedirectPromise();
        if (redirectFromSigninResponse !== null)
            return alert('Login was succesful');
        login();
    } catch {
        alert('Login failed');
    }
};
