import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '@equinor/eds-core-react';
import styled from 'styled-components';
import UserContext from '../../contexts/UserContext';

export const SelectPlantWrapper = styled.main`
    display: flex;
    flex-direction: column;
    & h3 {
        text-align: center;
        margin-bottom: 18px;
    }
`;

export const WideButton = styled(Button)`
    display: flex;
    margin: 7px;
    height: 50px;
    text-align: left;
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
        <SelectPlantWrapper>
            <h3>Select plant</h3>
            {plantsToRender}
        </SelectPlantWrapper>
    );
};

export default SelectPlant;
