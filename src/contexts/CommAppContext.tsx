import React, { ReactNode, useEffect, useState } from 'react';
import ErrorPage from '../components/error/ErrorPage';
import LoadingPage from '../components/loading/LoadingPage';
import { Plant } from '../services/apiTypes';
import { IAuthService } from '../services/authService';
import { ProcosysApiService } from '../services/procosysApi';

type CommAppContextProps = {
    availablePlants: Plant[];
    fetchPlantsStatus: AsyncStatus;
    api: ProcosysApiService;
    auth: IAuthService;
};

export enum AsyncStatus {
    INACTIVE,
    LOADING,
    SUCCESS,
    ERROR,
}

const CommAppContext = React.createContext({} as CommAppContextProps);

export const CommAppContextProvider: React.FC<{
    children: ReactNode;
    auth: IAuthService;
    api: ProcosysApiService;
}> = ({ children, auth, api }) => {
    const [availablePlants, setAvailablePlants] = useState<Plant[]>([]);
    const [fetchPlantsStatus, setFetchPlantsStatus] = useState<AsyncStatus>(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        (async () => {
            setFetchPlantsStatus(AsyncStatus.LOADING);
            try {
                const plantsFromAPI = await api.getPlants();
                setAvailablePlants(plantsFromAPI);
                setFetchPlantsStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchPlantsStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api]);

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
        <CommAppContext.Provider
            value={{
                fetchPlantsStatus,
                availablePlants,
                api,
                auth,
            }}
        >
            {children}
        </CommAppContext.Provider>
    );
};

export default CommAppContext;