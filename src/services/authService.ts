import * as Msal from '@azure/msal-browser';
import { AccountInfo } from '@azure/msal-browser';
import { StorageKey } from '../pages/Bookmarks/useBookmarks';
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

const authService = ({ MSAL, scopes }: IAuthServiceProps): IAuthService => {
    const logout = async () => {
        return await MSAL.logout();
    };

    const login = async () => {
        let pathName = window.location.pathname;
        if (pathName.substr(0, 5) === '/comm')
            pathName = '/' + pathName.slice(6);
        window.localStorage.setItem(StorageKey.REDIRECTPATH, pathName);
        MSAL.loginRedirect({ scopes: scopes });
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
        try {
            const accessToken = await MSAL.acquireTokenSilent({
                account: cachedAccount,
                scopes: ['User.read'],
            });
            if (accessToken) {
                return true;
            } else {
                return false;
            }
        } catch {
            return false;
        }
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
