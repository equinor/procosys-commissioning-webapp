import React, { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ParamTypes } from '../App';
import * as api from '../services/api';
import { Project } from '../services/api';
import usePlantFromURL from '../utils/usePlantFromURL';
import { AsyncStatus } from './UserContext';

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
    currentPlant: Plant | null;
    setCurrentPlant: (currentPlant: Plant | null) => void;
    currentProject: Project | null;
    setCurrentProject: (currentProject: Project | null) => void;
    availableProjects: Project[] | null;
};

const PlantContext = React.createContext({} as PlantContextProps);

export const PlantContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { plant: plantInPath } = useParams<ParamTypes>();
    const plantFromUrl = usePlantFromURL(plantInPath);
    const [currentPlant, setCurrentPlant] = useState<Plant | null>(null);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [availableProjects, setAvailableProjects] = useState<
        Project[] | null
    >(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [
        fetchProjectsAndPermissionsStatus,
        setFetchProjectsAndPermissionsStatus,
    ] = useState(AsyncStatus.LOADING);

    useEffect(() => {
        setCurrentPlant(plantFromUrl);
    }, [plantFromUrl]);

    // Load permissions once plant is selected
    useEffect(() => {
        if (currentPlant) {
            (async () => {
                setFetchProjectsAndPermissionsStatus(AsyncStatus.LOADING);
                try {
                    const projectsFromApi = await api.getProjectsForPlant(
                        currentPlant.id
                    );
                    const permissionsFromApi = await api.getPermissionsForPlant(
                        currentPlant.id
                    );
                    setAvailableProjects(projectsFromApi);
                    setPermissions(permissionsFromApi);
                    setFetchProjectsAndPermissionsStatus(AsyncStatus.SUCCESS);
                } catch (error) {
                    setFetchProjectsAndPermissionsStatus(AsyncStatus.ERROR);
                }
            })();
        }
    }, [currentPlant]);

    return (
        <PlantContext.Provider
            value={{
                fetchProjectsAndPermissionsStatus,
                permissions,
                setCurrentPlant,
                currentPlant,
                setCurrentProject,
                currentProject,
                availableProjects,
            }}
        >
            {children}
        </PlantContext.Provider>
    );
};

export default PlantContext;
