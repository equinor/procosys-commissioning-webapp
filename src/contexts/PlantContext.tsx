import React, { ReactNode, useEffect, useState } from 'react';
import * as api from '../services/api';
import { AsyncStatus } from './UserContext';

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
