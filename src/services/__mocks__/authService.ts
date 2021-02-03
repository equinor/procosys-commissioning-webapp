import { IAuthService, IAuthServiceProps } from '../authService';
import { AccountInfo } from '@azure/msal-browser';

const authService = ({ MSAL, scopes }: IAuthServiceProps): IAuthService => {
    const login = async () => {
        return Promise.resolve();
    };
    const getCurrentUser = (): AccountInfo | null => {
        const account: AccountInfo = MSAL.getAllAccounts()[0];
        if (!account) return null;
        return account;
    };
    const logout = async () => {
        return Promise.resolve();
    };

    const getUserName = () => {
        return 'dummy-user';
    };

    const getAccessToken = () => {
        return Promise.resolve('dummy-bearer-token');
    };

    const isLoggedIn = async () => {
        return true;
    };

    const handleLogin = async () => {
        return Promise.resolve(false);
    };
    return {
        logout,
        handleLogin,
        isLoggedIn,
        getAccessToken,
        getUserName,
        login,
        getCurrentUser,
    };
};

export default authService;
