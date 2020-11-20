import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import EdsIcon from '../components/EdsIcon';
import ErrorPage from '../components/error/ErrorPage';
import LoadingPage from '../components/loading/LoadingPage';
import UserContext, { AsyncStatus } from '../contexts/UserContext';
import { COLORS } from '../style/GlobalStyles';
import PageHeader from '../components/PageHeader';

export const SelectPlantWrapper = styled.main`
    display: flex;
    flex-direction: column;
    & button {
        border-radius: 0;
    }
`;

export const SelectorButton = styled(Link)`
    display: flex;
    border-top: 2px solid ${COLORS.ui.background__light.hex};
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    padding: 20px 4%;
    position: relative;
    & p {
        margin: 0 30px 0 0;
    }
    &:hover {
        background-color: ${COLORS.interactive.secondary__highlight.hex};
    }
    & svg {
        position: absolute;
        right: 10px;
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
