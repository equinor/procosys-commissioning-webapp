import React, { useState } from 'react';

export interface Plant {
    id: string;
    title: string;
    slug: string;
}

export type Project = {
    id: number;
    description: string;
};

const defaultProject: Project = {
    id: 0,
    description: 'default project',
};

const defaultPlant: Plant = {
    id: 'default id',
    title: 'default name',
    slug: 'default-title',
};

type PlantAndProjectContextProps = {
    selectedPlant: Plant;
    setSelectedPlant: (selectedPlant: Plant) => void;
    selectedProject: Project;
    setSelectedProject: (selectedProject: Project) => void;
};

const PlantAndProjectContext = React.createContext<
    Partial<PlantAndProjectContextProps>
>({});

const PlantAndProjectProvider: React.FC = ({ children }) => {
    const [selectedPlant, setSelectedPlant] = useState<Plant>(defaultPlant);
    const [selectedProject, setSelectedProject] = useState<Project>(
        defaultProject
    );

    return (
        <PlantAndProjectContext.Provider
            value={{
                setSelectedPlant,
                selectedPlant,
                setSelectedProject,
                selectedProject,
            }}
        >
            {children}
        </PlantAndProjectContext.Provider>
    );
};

export default PlantAndProjectProvider;
