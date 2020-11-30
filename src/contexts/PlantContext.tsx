import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { CommParams } from '../App';
import * as api from '../services/api';
import { Project } from '../services/api';
import matchPlantInURL from '../utils/matchPlantInURL';
import matchProjectInURL from '../utils/matchProjectInURL';
import UserContext, { AsyncStatus } from './UserContext';

export interface Plant {
    id: string;
    title: string;
    slug: string;
    projects?: Project[];
}

export type PlantContextProps = {
    fetchProjectsAndPermissionsStatus: AsyncStatus;
    permissions: string[];
    currentPlant: Plant | undefined;
    availableProjects: Project[] | null;
    currentProject: Project | undefined;
};

const PlantContext = React.createContext({} as PlantContextProps);

export const PlantContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { plant: plantInURL, project: projectInURL } = useParams<
        CommParams
    >();
    const [currentPlant, setCurrentPlant] = useState<Plant | undefined>();
    const { availablePlants } = useContext(UserContext);
    const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [currentProject, setCurrentProject] = useState<Project | undefined>();
    const [
        fetchProjectsAndPermissionsStatus,
        setFetchProjectsAndPermissionsStatus,
    ] = useState(AsyncStatus.LOADING);

    useEffect(() => {
        if (!plantInURL) setCurrentProject(undefined);
        if (availablePlants.length < 1) return;
        setCurrentPlant(matchPlantInURL(availablePlants, plantInURL));
    }, [availablePlants, plantInURL]);

    useEffect(() => {
        if (!projectInURL) setCurrentProject(undefined);
        if (availableProjects.length < 1 || !projectInURL) return;
        setCurrentProject(matchProjectInURL(availableProjects, projectInURL));
    }, [availableProjects, projectInURL]);

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
                currentProject,
            }}
        >
            {children}
        </PlantContext.Provider>
    );
};

export default PlantContext;
