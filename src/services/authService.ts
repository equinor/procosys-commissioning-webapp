import * as Msal from '@azure/msal-browser';
import axios from 'axios';
import { AsyncStatus } from '../contexts/UserContext';

export type AuthSettings = {
    clientId: string;
    authority: string;
    scopes: string[];
};

const settingsEndpint =
    'https://pcs-config-non-prod-func.azurewebsites.net/api/CommWebApp/Auth';

export const getAuthSettings = async () => {
    const { data } = await axios.get(settingsEndpint);
    return data as AuthSettings;
};

const auth = (MSAL: Msal.PublicClientApplication, scopes: string[]) => {
    const logout = async () => {
        return await MSAL.logout();
    };

    const login = async () => {
        console.log('HIT LOGIN');
        console.log(scopes);
        if (!getCurrentUser()) MSAL.loginRedirect({ scopes: scopes });
    };

    const getCurrentUser = (): Msal.AccountInfo | null => {
        const account = MSAL.getAllAccounts()[0];
        if (!account) return null;
        return account;
    };

    const getUserName = (): string | undefined => {
        return getCurrentUser()?.username;
    };

    const getAccessToken = async () => {
        console.log('HIT GETACCESSTOKEN');
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
        console.log('HIT ISLOGGEDIN');
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

    const handleLogin = async () => {
        console.log('HIT HANDLELOGIN');
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
    return {
        login,
        logout,
        getCurrentUser,
        handleLogin,
        isLoggedIn,
        getAccessToken,
        getUserName,
        logScopes,
    };
};

export default auth;
