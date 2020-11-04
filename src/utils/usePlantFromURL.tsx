import React, { useContext } from 'react';
import UserContext from '../contexts/UserContext';

const usePlantFromURL = (slug: string) => {
    const { availablePlants } = useContext(UserContext);
    return availablePlants.find((plant) => plant.slug === slug);
};

export default usePlantFromURL;
