import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import UserContext, { AsyncStatus } from '../../contexts/UserContext';
import { COLORS } from '../../style/GlobalStyles';
import PageHeader from '../PageHeader';
import LoadingPage from '../loading/LoadingPage';
import ErrorPage from '../error/ErrorPage';
import EdsIcon from '../EdsIcon';

export const SelectPlantWrapper = styled.main`
    display: flex;
    flex-direction: column;
`;

export const SelectorButton = styled(Link)`
    display: flex;
    border-top: 2px solid ${COLORS.ui.background__light.hex};
    height: 60px;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    padding: 0 4%;
    & p {
        margin: 0;
    }
    &:hover {
        background-color: ${COLORS.interactive.secondary__highlight.hex};
    }
`;

const SelectPlant = () => {
    const { availablePlants, fetchPlantsStatus } = useContext(UserContext);

    const plantsToRender = availablePlants.map((plant) => (
        <SelectorButton key={plant.id} to={`/${plant.slug}`}>
            <p>{plant.title}</p>
            <EdsIcon name="chevron_right" title="chevron right" />
        </SelectorButton>
    ));

    if (fetchPlantsStatus === AsyncStatus.LOADING) {
        return <LoadingPage loadingText={'Loading available plants . . .'} />;
    }

    if (fetchPlantsStatus === AsyncStatus.ERROR)
        return (
            <ErrorPage
                errorTitle="Error: Could not load plants"
                errorDescription="We were unable to get a list of available plants. Please check your connection, sign in with a different user or refresh this page."
            ></ErrorPage>
        );

    if (plantsToRender.length < 1) {
        return (
            <ErrorPage
                errorTitle="No plants to show"
                errorDescription="We were able to connect to the server, but there are no plants to show. Make sure you're logged in correctly, and that you have the necessary permissions"
            ></ErrorPage>
        );
    }

    return (
        <SelectPlantWrapper>
            <PageHeader text={'Select plant'} />
            {plantsToRender}
        </SelectPlantWrapper>
    );
};

export default SelectPlant;
