import React, { ReactNode, useEffect, useState } from 'react';
import { Button } from '@equinor/eds-core-react';
import ErrorPage from '../components/error/ErrorPage';
import LoadingPage from '../components/loading/LoadingPage';
import { Plant } from '../typings/apiTypes';
import { AppConfig, FeatureFlags } from '../services/appConfiguration';
import { IAuthService } from '../services/authService';
import { ProcosysApiService } from '../services/procosysApi';

type CommAppContextProps = {
    availablePlants: Plant[];
    fetchPlantsStatus: AsyncStatus;
    api: ProcosysApiService;
    auth: IAuthService;
    appConfig: AppConfig;
    featureFlags: FeatureFlags;
};

export enum AsyncStatus {
    INACTIVE,
    LOADING,
    SUCCESS,
    ERROR,
    EMPTY_RESPONSE,
}

const CommAppContext = React.createContext({} as CommAppContextProps);

type CommAppContextProviderProps = {
    children: ReactNode;
    auth: IAuthService;
    api: ProcosysApiService;
    appConfig: AppConfig;
    featureFlags: FeatureFlags;
};

export const CommAppContextProvider: React.FC<CommAppContextProviderProps> = ({
    children,
    auth,
    api,
    appConfig,
    featureFlags,
}: CommAppContextProviderProps) => {
    const [availablePlants, setAvailablePlants] = useState<Plant[]>([]);
    const [fetchPlantsStatus, setFetchPlantsStatus] = useState<AsyncStatus>(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        (async (): Promise<void> => {
            setFetchPlantsStatus(AsyncStatus.LOADING);
            try {
                const plantsFromApi = await api.getPlants();
                setAvailablePlants(plantsFromApi);
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
            <>
                <ErrorPage
                    actions={[
                        <Button key={'signOut'} onClick={auth.logout}>
                            Sign out
                        </Button>,
                    ]}
                    title="Error: Could not load plants"
                    description="We were unable to get a list of available plants. Please check your connection, sign in with a different user or refresh this page."
                ></ErrorPage>
            </>
        );
    }
    return (
        <CommAppContext.Provider
            value={{
                availablePlants,
                fetchPlantsStatus,
                api,
                auth,
                appConfig,
                featureFlags,
            }}
        >
            {children}
        </CommAppContext.Provider>
    );
};

export default CommAppContext;
