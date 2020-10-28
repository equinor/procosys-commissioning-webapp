import React, { useEffect, useState } from 'react';
import * as auth from '../services/authService';
import { MSAL } from '../services/authService';

type AuthContextProps = {
    userName: string;
    isLoggedIn: boolean;
    redirectToLogin: () => Promise<void>;
};

const AuthContext = React.createContext({} as AuthContextProps);

const AuthContextProvider: React.FC = ({ children }) => {
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const redirectToLogin = auth.login;

    useEffect(() => {
        // const handleRedirectFromSigninPage = async () => {
        //     try {
        //         const redirectFromSigninResponse = await MSAL.handleRedirectPromise();
        //         if (redirectFromSigninResponse !== null)
        //             alert('Login was succesful');
        //     } catch {
        //         alert('Login failed');
        //     }
        // };
        // handleRedirectFromSigninPage();
    }, []);

    // useEffect(() => {
    //     const setLoginStatus = async () => {
    //         const status = await auth.getLoginStatus();
    //         setIsLoggedIn(status);
    //     };
    //     setLoginStatus();
    // }, []);

    return (
        <AuthContext.Provider
            value={{
                redirectToLogin,
                userName,
                isLoggedIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextProps =>
    React.useContext<AuthContextProps>(AuthContext);

export default AuthContextProvider;
