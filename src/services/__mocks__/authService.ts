import { IAuthService, IAuthServiceProps } from '../authService';
import Msal, { AccountInfo } from '@azure/msal-browser';
import { AsyncStatus } from '../../contexts/CommAppContext';

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
        return 'Test user';
    };

    const getAccessToken = () => {
        return Promise.resolve('Bearer test');
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
