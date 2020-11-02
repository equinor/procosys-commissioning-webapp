import React, { ReactNode, useEffect, useState } from 'react';
import * as auth from '../services/authService';
import * as API from '../services/api';
import FullPageLoader from '../components/loading/FullPageLoader';
import { Plant } from './PlantContext';

type UserContextProps = {
    userName: string;
    availablePlants: Plant[];
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
    const [userName, setUserName] = useState(auth.getUserName() || '');
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

    if (fetchPlantsStatus === AsyncStatus.LOADING) {
        return <FullPageLoader withNavbar text={'Loading available plants'} />;
    }
    if (fetchPlantsStatus === AsyncStatus.ERROR) return <p>ERROR</p>;
    return (
        <UserContext.Provider
            value={{
                userName,
                availablePlants,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
