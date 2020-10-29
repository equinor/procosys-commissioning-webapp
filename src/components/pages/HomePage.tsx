import React, { ChangeEvent, useState } from 'react';
import { MSAL } from '../../services/authService';
import { Typography, Search } from '@equinor/eds-core-react';
import styled from 'styled-components';

const HomePageWrapper = styled.main`
    padding: 4%;
`;

const HomePage = () => {
    const [searchInput, setSearchInput] = useState('');

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
    return (
        <HomePageWrapper>
            <Typography variant="h4">Search for a comm package: </Typography>
            <Search
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchInput(e.target.value)
                }
            />
        </HomePageWrapper>
    );
};

export default HomePage;
