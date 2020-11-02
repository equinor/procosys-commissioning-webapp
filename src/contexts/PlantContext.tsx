import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import * as api from '../services/api';
import UserContext, { AsyncStatus } from './UserContext';

export interface Plant {
    id: string;
    title: string;
    slug: string;
    projects?: Project[];
}

export type Project = {
    id: number;
    description: string;
};

export type Params = {
    plant: string;
    project: string;
};

type PlantContextProps = {
    fetchPermissionsStatus: AsyncStatus;
    permissions: string[];
    selectedPlant: Plant | null;
    setSelectedPlant: (selectedPlant: Plant | null) => void;
    selectedProject: Project | null;
    setSelectedProject: (selectedProject: Project | null) => void;
};

const PlantContext = React.createContext({} as PlantContextProps);

export const PlantContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );
    const [permissions, setPermissions] = useState<string[]>([]);
    const [fetchPermissionsStatus, setfetchPermissionsStatus] = useState(
        AsyncStatus.LOADING
    );
    // Load permissions once plant is selected
    useEffect(() => {
        if (selectedPlant) {
            (async () => {
                setfetchPermissionsStatus(AsyncStatus.LOADING);
                try {
                    const permissionsFromApi = await api.getPermissionsForPlant(
                        selectedPlant!.id
                    );
                    setPermissions(permissionsFromApi);
                    setfetchPermissionsStatus(AsyncStatus.SUCCESS);
                } catch (error) {
                    setfetchPermissionsStatus(AsyncStatus.ERROR);
                }
            })();
        }
    }, [selectedPlant]);

    return (
        <PlantContext.Provider
            value={{
                fetchPermissionsStatus,
                permissions,
                setSelectedPlant,
                selectedPlant,
                setSelectedProject,
                selectedProject,
            }}
        >
            {children}
        </PlantContext.Provider>
    );
};

export default PlantContext;
