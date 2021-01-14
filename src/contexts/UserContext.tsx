import React, { ReactNode, useEffect, useState } from 'react';
import ErrorPage from '../components/error/ErrorPage';
import LoadingPage from '../components/loading/LoadingPage';
import * as API from '../services/api';
import { Plant } from '../services/apiTypes';

type UserContextProps = {
    availablePlants: Plant[];
    fetchPlantsStatus: AsyncStatus;
};

export enum AsyncStatus {
    INACTIVE,
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

    if (fetchPlantsStatus === AsyncStatus.LOADING) {
        return <LoadingPage loadingText={'Loading available plants'} />;
    }
    if (fetchPlantsStatus === AsyncStatus.ERROR) {
        return (
            <ErrorPage
                title="Error: Could not load plants"
                description="We were unable to get a list of available plants. Please check your connection, sign in with a different user or refresh this page."
            ></ErrorPage>
        );
    }
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
