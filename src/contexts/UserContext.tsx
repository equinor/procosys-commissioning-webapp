import React, { ReactNode, useEffect, useState } from 'react';
import * as API from '../services/api';
import { Plant } from './PlantContext';

type UserContextProps = {
    availablePlants: Plant[];
    fetchPlantsStatus: AsyncStatus;
};

export enum AsyncStatus {
    LOADING,
    SUCCESS,
    ERROR,
}

const UserContext = React.createContext({} as UserContextProps);

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [availablePlants, setAvailablePlants] = useState<Plant[]>([]);
    const [fetchPlantsStatus, setFetchPlantsStatus] = useState<AsyncStatus>(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        (async () => {
            setFetchPlantsStatus(AsyncStatus.LOADING);
            try {
                const plantsFromAPI = await API.getPlants();
                setAvailablePlants(plantsFromAPI);
                setFetchPlantsStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchPlantsStatus(AsyncStatus.ERROR);
            }
        })();
    }, []);

    return (
        <UserContext.Provider
            value={{
                fetchPlantsStatus,
                availablePlants,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
