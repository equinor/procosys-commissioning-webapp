import React from 'react';
import { MSAL } from '../../services/authService';

const HomePage = () => {
    const handleRedirectFromSigninPage = async () => {
        try {
            const redirectFromSigninResponse = await MSAL.handleRedirectPromise();
            if (redirectFromSigninResponse !== null)
                alert('Login was succesful');
        } catch {
            alert('Login failed');
        }
    };
    handleRedirectFromSigninPage();
    return <div>Welcome to procosys</div>;
};

export default HomePage;
