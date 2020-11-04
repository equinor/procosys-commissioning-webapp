import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '@equinor/eds-core-react';
import styled from 'styled-components';
import UserContext from '../../contexts/UserContext';

const SelectPlantWrapper = styled.main`
    display: flex;
    flex-wrap: wrap;
`;

export const WideButton = styled(Button)`
    display: flex;
    width: 100%;
    margin: 7px;
    height: 50px;
`;

const SelectPlant = () => {
    const { availablePlants } = useContext(UserContext);
    const { push } = useHistory();

    const plantsToRender = availablePlants.map((plant) => (
        <WideButton
            variant="outlined"
            color="secondary"
            key={plant.id}
            onClick={() => {
                push(`/${plant.slug}`);
            }}
        >
            {plant.title}
            <Icon name="chevron_right" title="chevron right" />
        </WideButton>
    ));

    return (
        <>
            <p>Select plant</p>
            <SelectPlantWrapper>{plantsToRender}</SelectPlantWrapper>
        </>
    );
};

export default SelectPlant;
