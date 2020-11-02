import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Icon, Typography } from '@equinor/eds-core-react';
import styled from 'styled-components';
import UserContext from '../../contexts/UserContext';
import PlantContext from '../../contexts/PlantContext';
import { H3 } from '../../style/text';

const SelectPlantWrapper = styled.main`
    display: flex;
    flex-wrap: wrap;
`;

export const WideButton = styled(Button)`
    flex: 1 0 auto;
    display: flex;
    margin: 7px;
    height: 50px;
`;

const SelectPlant = () => {
    const { availablePlants } = useContext(UserContext);
    const { setSelectedPlant } = useContext(PlantContext);
    const { push } = useHistory();

    const plantsToRender = availablePlants.map((plant) => (
        <WideButton
            color="secondary"
            key={plant.id}
            onClick={() => {
                setSelectedPlant(plant);
                push(`/${plant.slug}`);
            }}
        >
            {plant.title}
            <Icon name="chevron_right" title="chevron right" />
        </WideButton>
    ));

    return (
        <>
            <H3 style={{ textAlign: 'center' }}>Select plant</H3>
            <SelectPlantWrapper>{plantsToRender}</SelectPlantWrapper>
        </>
    );
};

export default SelectPlant;
