import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plant } from '../../contexts/PlantAndProjectContext';
import * as api from '../../services/api';
import { Button } from '@equinor/eds-core-react';
import styled from 'styled-components';

export const WideButton = styled(Button)`
    width: 100%;
    text-align: left;
    border-radius: 0;
    border: none;
    border-top: 1px solid;
`;

const SelectPlant = () => {
    const [selectedPlant, setSelectedPlant] = useState<Plant>({
        title: 'default',
        id: '',
        slug: '',
    });
    const [plants, setPlants] = useState<Plant[]>([]);
    const plantsToRender = plants.map((plant) => (
        <Link
            to={`/${plant.slug}`}
            key={plant.id}
            onClick={(e: React.MouseEvent) => setSelectedPlant(plant)}
        >
            <WideButton color="secondary" variant="outlined">
                {plant.title}
            </WideButton>
            <br />
        </Link>
    ));

    useEffect(() => {
        if (plants.length < 1) {
            const populatePlants = async () => {
                const plantsFromAPI = await api.getPlants();
                console.log(plantsFromAPI);
                setPlants(plantsFromAPI);
            };
            populatePlants();
        }
    }, []);

    return <>{plantsToRender}</>;
};

export default SelectPlant;
