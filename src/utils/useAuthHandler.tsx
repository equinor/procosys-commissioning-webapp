import React, { useEffect, useState } from 'react';
import { AsyncStatus } from '../contexts/UserContext';
import { handleLogin } from '../services/authService';

const useAuthHandler = () => {
    const [authStatus, setAuthStatus] = useState(AsyncStatus.LOADING);
    useEffect(() => {
        (async () => {
            try {
                const loginResult = await handleLogin();
                setAuthStatus(loginResult);
            } catch (error) {
                setAuthStatus(error);
            }
        })();
    }, []);
    return authStatus;
};

export default useAuthHandler;
