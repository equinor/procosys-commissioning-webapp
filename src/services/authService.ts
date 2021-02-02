import * as Msal from '@azure/msal-browser';
import { AccountInfo } from '@azure/msal-browser';
import axios from 'axios';
import { AsyncStatus } from '../contexts/CommAppContext';

export type AuthSettings = {
    clientId: string;
    authority: string;
    scopes: string[];
};

export interface IAuthService {
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => AccountInfo | null;
    handleLogin: () => Promise<AsyncStatus>;
    isLoggedIn: () => Promise<void>;
    getAccessToken: (scope: string[]) => Promise<string>;
    getUserName: () => string | undefined;
}
export interface IAuthServiceProps {
    MSAL: Msal.PublicClientApplication;
    scopes: string[];
}

const settingsEndpint =
    'https://pcs-config-non-prod-func.azurewebsites.net/api/CommWebApp/Auth';

export const getAuthSettings = async () => {
    const { data } = await axios.get(settingsEndpint);
    // Todo: TypeGuard authsettings
    const clientSettings = {
        auth: {
            clientId: data.clientId,
            authority: data.authority,
            redirectUri: window.location.href,
        },
    };
    const scopes = data.scopes;
    const configurationScope = data.configurationScope;
    return { clientSettings, scopes, configurationScope };
};

const authService = ({ MSAL, scopes }: IAuthServiceProps): IAuthService => {
    const logout = async () => {
        return await MSAL.logout();
    };

    const login = async () => {
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

    const getAccessToken = async (scope: string[]) => {
        try {
            const account = MSAL.getAllAccounts()[0];
            const silentTokenResponse = await MSAL.acquireTokenSilent({
                account,
                scopes: scope,
            });
            return Promise.resolve(silentTokenResponse.accessToken);
        } catch (error) {
            console.log('Token acquisition failed, redirecting');
            MSAL.acquireTokenRedirect({ scopes: scope });
            return Promise.reject(error as Msal.AuthError);
        }
    };

    const isLoggedIn = async () => {
        const cachedAccount = MSAL.getAllAccounts()[0];
        if (cachedAccount == null) return Promise.reject();
        try {
            // User is able to get accessToken, no login required
            await MSAL.acquireTokenSilent({
                account: cachedAccount,
                scopes: ['User.read'],
            });
            return Promise.resolve();
        } catch {
            return Promise.reject();
        }
    };

    const handleLogin = async () => {
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
    };
};

export default authService;
