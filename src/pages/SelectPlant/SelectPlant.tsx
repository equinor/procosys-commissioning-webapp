import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import ErrorPage from '../../components/error/ErrorPage';
import UserContext from '../../contexts/UserContext';
import { COLORS } from '../../style/GlobalStyles';
import PageHeader from '../../components/PageHeader';
import Navbar from '../../components/navigation/Navbar';

export const SelectPlantWrapper = styled.main`
    display: flex;
    flex-direction: column;
    & button {
        border-radius: 0;
    }
`;

export const SelectorButton = styled(Link)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    padding: 16px 4%;
    margin: 8px 10px;
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
    const { availablePlants } = useContext(UserContext);

    const plantsToRender = availablePlants.map((plant) => (
        <SelectorButton key={plant.id} to={`/${plant.slug}`}>
            <p>{plant.title}</p>
            <EdsIcon name="chevron_right" title="chevron right" />
        </SelectorButton>
    ));

    let content = (
        <>
            <PageHeader title={'Select plant'} />
            {plantsToRender}
        </>
    );

    if (plantsToRender.length < 1) {
        content = (
            <ErrorPage
                title="No plants to show"
                description="We were able to connect to the server, but there are no plants to show. Make sure you're logged in correctly, and that you have the necessary permissions"
            ></ErrorPage>
        );
    }

    return (
        <>
            <Navbar leftContent={{ name: 'hamburger' }} />
            <SelectPlantWrapper>{content}</SelectPlantWrapper>
        </>
    );
};

export default SelectPlant;
