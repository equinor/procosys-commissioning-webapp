import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ParamTypes } from '../../../App';
import PlantContext from '../../../contexts/PlantContext';
import { AsyncStatus } from '../../../contexts/UserContext';
import usePlantFromURL from '../../../utils/usePlantFromURL';
import * as api from '../../../services/api';
import { Project } from '../../../services/api';

const useSelectProject = () => {
    const { plant: plantInPath } = useParams<ParamTypes>();
    const [projects, setProjects] = useState<Project[]>([]);
    const [fetchProjectsStatus, setFetchProjectsStatus] = useState(
        AsyncStatus.LOADING
    );
    const currentPlant = usePlantFromURL(plantInPath);
    const { setSelectedPlant } = useContext(PlantContext);

    useEffect(() => {
        setSelectedPlant(currentPlant);
    }, []);

    useEffect(() => {
        (async () => {
            setFetchProjectsStatus(AsyncStatus.LOADING);
            try {
                const projectsFromApi = await api.getProjectsForPlant(
                    'PCS$' + plantInPath
                );
                setProjects(projectsFromApi);
                setFetchProjectsStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                console.error('Could not get projects');
                setFetchProjectsStatus(AsyncStatus.ERROR);
            }
        })();
    }, []);

    return {
        projects,
        fetchProjectsStatus,
        plantInPath,
        currentPlant,
    };
};

export default useSelectProject;
