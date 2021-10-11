import React, { ReactNode, useContext, useEffect, useState } from 'react';
import LoadingPage from '../components/loading/LoadingPage';
import { Plant, Project } from '../services/apiTypes';
import { StorageKey } from '../pages/Bookmarks/useBookmarks';
import matchPlantInURL from '../utils/matchPlantInURL';
import matchProjectInURL from '../utils/matchProjectInURL';
import CommAppContext, { AsyncStatus } from './CommAppContext';
import useCommonHooks from '../utils/useCommonHooks';
import ErrorPage from '../components/error/ErrorPage';
import { Navbar } from '@equinor/procosys-webapp-components';

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
    const { params, api, history } = useCommonHooks();
    const [currentPlant, setCurrentPlant] = useState<Plant | undefined>();
    const { availablePlants } = useContext(CommAppContext);
    const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [currentProject, setCurrentProject] = useState<Project | undefined>();
    const [
        fetchProjectsAndPermissionsStatus,
        setFetchProjectsAndPermissionsStatus,
    ] = useState(AsyncStatus.LOADING);

    //Sends user to the last selected plant and project. This will be his/hers landing page.
    useEffect(() => {
        const plantInStorage = window.localStorage.getItem(StorageKey.PLANT);
        const projectInStorage = window.localStorage.getItem(
            StorageKey.PROJECT
        );
        const redirectPath = window.localStorage.getItem(
            StorageKey.REDIRECTPATH
        );
        if (redirectPath && redirectPath.length > 1) {
            history.push(redirectPath);
            window.localStorage.removeItem(StorageKey.REDIRECTPATH);
        }

        if (params.plant || !plantInStorage || !projectInStorage) return;
        if (projectInStorage)
            history.push(`/${plantInStorage}/${projectInStorage}`);
    }, [params.plant, params.project]);

    //Sets the last visited plant/project as the users landing page
    useEffect(() => {
        window.localStorage.setItem(StorageKey.PLANT, params.plant);
        if (!params.project) return;
        window.localStorage.setItem(StorageKey.PROJECT, params.project);
    }, [params.plant, params.project]);

    useEffect(() => {
        if (!params.plant) setCurrentPlant(undefined);
        if (availablePlants.length < 1) return;
        let matchedPlant: Plant | undefined;
        try {
            matchedPlant = matchPlantInURL(availablePlants, params.plant);
            setCurrentPlant(matchedPlant);
        } catch (error) {
            // Prevents an invalid plant being set as the users home-plant
            window.localStorage.removeItem(StorageKey.PLANT);
            window.localStorage.removeItem(StorageKey.PROJECT);
            throw error;
        }
    }, [availablePlants, params.plant]);

    useEffect(() => {
        if (!params.project) setCurrentProject(undefined);
        if (availableProjects.length < 1 || !params.project) return;
        let matchedProject: Project | undefined;
        try {
            matchedProject = matchProjectInURL(
                availableProjects,
                params.project
            );
            setCurrentProject(matchedProject);
        } catch (error) {
            // Prevents an invalid project being set as the users home-plant
            window.localStorage.removeItem(StorageKey.PROJECT);
            throw error;
        }
    }, [availableProjects, params.project]);

    useEffect(() => {
        if (!currentPlant) return;
        (async (): Promise<void> => {
            setFetchProjectsAndPermissionsStatus(AsyncStatus.LOADING);
            try {
                const [projectsFromApi, permissionsFromApi] = await Promise.all(
                    [
                        api.getProjectsForPlant(currentPlant.id),
                        await api.getPermissionsForPlant(currentPlant.id),
                    ]
                );
                setAvailableProjects(projectsFromApi);
                setPermissions(permissionsFromApi);
                if (projectsFromApi.length < 1) {
                    setFetchProjectsAndPermissionsStatus(
                        AsyncStatus.EMPTY_RESPONSE
                    );
                } else {
                    setFetchProjectsAndPermissionsStatus(AsyncStatus.SUCCESS);
                }
            } catch (error) {
                setFetchProjectsAndPermissionsStatus(AsyncStatus.ERROR);
            }
        })();
    }, [currentPlant, api]);

    const renderChildren = (): boolean => {
        if (params.plant && !currentPlant) return false;
        if (params.project && !currentProject) return false;
        return true;
    };

    if (!renderChildren()) {
        if (fetchProjectsAndPermissionsStatus === AsyncStatus.ERROR) {
            return (
                <>
                    <Navbar />
                    <ErrorPage
                        title={'Unable to obtain permissions.'}
                        description={
                            'Please check your internet connection or refresh this page.'
                        }
                    />
                </>
            );
        } else {
            return <LoadingPage loadingText={'Loading plant from URL'} />;
        }
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
