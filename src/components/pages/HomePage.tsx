import React, { useContext } from 'react';
import { MSAL } from '../../services/authService';
import { Typography } from '@equinor/eds-core-react';
import styled from 'styled-components';
import UserContextProvider from '../../contexts/UserContext';

const HomePageWrapper = styled.main`
    padding: 4%;
`;

const HomePage = () => {
    const { availablePlants } = useContext(UserContextProvider);
    return (
        <HomePageWrapper>
            <Typography variant="h4">Home</Typography>
        </HomePageWrapper>
    );
};

export default HomePage;
