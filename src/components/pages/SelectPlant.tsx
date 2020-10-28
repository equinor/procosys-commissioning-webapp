import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plant } from '../../contexts/PlantAndProjectContext';
import * as api from '../../services/api';
import { Button } from '@equinor/eds-core-react';

const SelectPlant = () => {
    const [selectedPlant, setSelectedPlant] = useState<Plant>({
        title: 'default',
        id: '',
        slug: '',
    });
    const [plants, setPlants] = useState<Plant[]>([]);
    const plantsToRender = plants.map((plant) => (
        <Link
            to={`/plant=${plant.slug}`}
            key={plant.id}
            onClick={(e: React.MouseEvent) => setSelectedPlant(plant)}
        >
            <Button>{plant.title}</Button>
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

    return (
        <div>
            {plantsToRender}
            <p>Selected: {selectedPlant.title}</p>
        </div>
    );
};

export default SelectPlant;
