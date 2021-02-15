import * as Msal from '@azure/msal-browser';
import { AccountInfo } from '@azure/msal-browser';
import axios from 'axios';

export type AuthSettings = {
    clientId: string;
    authority: string;
    scopes: string[];
};

export interface IAuthService {
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => AccountInfo | null;
    handleLogin: () => Promise<boolean>;
    isLoggedIn: () => Promise<boolean>;
    getAccessToken: (scope: string[]) => Promise<string>;
    getUserName: () => string | undefined;
}
export interface IAuthServiceProps {
    MSAL: Msal.PublicClientApplication;
    scopes: string[];
}

const Settings = require('../settings.json');

export const getAuthSettings = async () => {
    const { data } = await axios.get(Settings.authSettingsEndpoint);
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
    const configurationEndpoint = data.configurationEndpoint;
    return {
        clientSettings,
        scopes,
        configurationScope,
        configurationEndpoint,
    };
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
        const account = MSAL.getAllAccounts()[0];
        if (!account) return '';
        const { accessToken } = await MSAL.acquireTokenSilent({
            account,
            scopes: scope,
        });
        if (accessToken) {
            return Promise.resolve(accessToken);
        } else {
            console.log('Token acquisition failed, redirecting');
            MSAL.acquireTokenRedirect({ scopes: scope });
            return '';
        }
    };

    const isLoggedIn = async () => {
        const cachedAccount = MSAL.getAllAccounts()[0];
        if (cachedAccount == null) return false;
        // User is able to get accessToken, no login required
        const accessToken = await MSAL.acquireTokenSilent({
            account: cachedAccount,
            scopes: ['User.read'],
        });
        if (accessToken) return true;
        return false;
    };

    const handleLogin = async () => {
        const redirectFromSigninResponse = await MSAL.handleRedirectPromise();
        if (redirectFromSigninResponse !== null) {
            return Promise.resolve(false);
        }
        const userIsloggedIn = await isLoggedIn();
        if (userIsloggedIn) {
            return Promise.resolve(false);
        } else {
            login();
            return Promise.resolve(true);
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
