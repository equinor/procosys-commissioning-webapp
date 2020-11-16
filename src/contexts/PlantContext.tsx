import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ParamTypes } from '../App';
import * as api from '../services/api';
import { Project } from '../services/api';
import matchPlantFromURL from '../utils/matchPlantFromURL';
import UserContext, { AsyncStatus } from './UserContext';

export interface Plant {
    id: string;
    title: string;
    slug: string;
    projects?: Project[];
}

export type Params = {
    plant: string;
    project: string;
};

type PlantContextProps = {
    fetchProjectsAndPermissionsStatus: AsyncStatus;
    permissions: string[];
    currentPlant: Plant | undefined;
    availableProjects: Project[] | null;
};

const PlantContext = React.createContext({} as PlantContextProps);

export const PlantContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { plant: plantInURL } = useParams<ParamTypes>();
    const [currentPlant, setCurrentPlant] = useState<Plant | undefined>();
    const { availablePlants } = useContext(UserContext);
    const [availableProjects, setAvailableProjects] = useState<
        Project[] | null
    >(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [
        fetchProjectsAndPermissionsStatus,
        setFetchProjectsAndPermissionsStatus,
    ] = useState(AsyncStatus.LOADING);

    useEffect(() => {
        if (availablePlants.length < 1) return;
        setCurrentPlant(matchPlantFromURL(availablePlants, plantInURL));
    }, [availablePlants, plantInURL]);

    useEffect(() => {
        if (!currentPlant) return;
        (async () => {
            setFetchProjectsAndPermissionsStatus(AsyncStatus.LOADING);
            try {
                const [
                    projectsFromApi,
                    permissionsFromApi,
                ] = await Promise.all([
                    api.getProjectsForPlant(currentPlant.id),
                    await api.getPermissionsForPlant(currentPlant.id),
                ]);
                setAvailableProjects(projectsFromApi);
                setPermissions(permissionsFromApi);
                setFetchProjectsAndPermissionsStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchProjectsAndPermissionsStatus(AsyncStatus.ERROR);
            }
        })();
    }, [currentPlant]);

    return (
        <PlantContext.Provider
            value={{
                fetchProjectsAndPermissionsStatus,
                permissions,
                currentPlant,
                availableProjects,
            }}
        >
            {children}
        </PlantContext.Provider>
    );
};

export default PlantContext;
