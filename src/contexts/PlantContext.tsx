import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { CommParams } from '../App';
import LoadingPage from '../components/loading/LoadingPage';
import { Plant, Project } from '../services/apiTypes';
import { StorageKey } from '../pages/Bookmarks/useBookmarks';
import matchPlantInURL from '../utils/matchPlantInURL';
import matchProjectInURL from '../utils/matchProjectInURL';
import CommAppContext, { AsyncStatus } from './CommAppContext';

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
    const { api } = useContext(CommAppContext);
    const history = useHistory();
    const [currentPlant, setCurrentPlant] = useState<Plant | undefined>();
    const { availablePlants } = useContext(CommAppContext);
    const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [currentProject, setCurrentProject] = useState<Project | undefined>();
    const [
        fetchProjectsAndPermissionsStatus,
        setFetchProjectsAndPermissionsStatus,
    ] = useState(AsyncStatus.LOADING);

    useEffect(() => {
        const plantInStorage = window.localStorage.getItem(StorageKey.PLANT);
        const projectInStorage = window.localStorage.getItem(
            StorageKey.PROJECT
        );
        if (plantInURL || !plantInStorage || !projectInStorage) return;
        if (projectInStorage)
            history.push(`/${plantInStorage}/${projectInStorage}`);
    }, [plantInURL, projectInURL]);

    useEffect(() => {
        if (!plantInURL) return;
        window.localStorage.setItem(StorageKey.PLANT, plantInURL);
        if (!projectInURL) return;
        window.localStorage.setItem(StorageKey.PROJECT, projectInURL);
    }, [plantInURL, projectInURL]);

    useEffect(() => {
        if (!plantInURL) setCurrentPlant(undefined);
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

    const renderChildren = () => {
        if (plantInURL && !currentPlant) return false;
        if (projectInURL && !currentProject) return false;
        return true;
    };

    if (!renderChildren()) {
        return <LoadingPage loadingText={'Loading plant from URL'} />;
    } else {
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
    }
};

export default PlantContext;
