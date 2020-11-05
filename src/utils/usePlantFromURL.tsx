import React, { useContext } from 'react';
import UserContext from '../contexts/UserContext';

const usePlantFromURL = (slug: string) => {
    const { availablePlants } = useContext(UserContext);
    const matchedPlant = availablePlants.find((plant) => plant.slug === slug);
    if (matchedPlant === undefined) return null;
    return matchedPlant;
};

export default usePlantFromURL;
