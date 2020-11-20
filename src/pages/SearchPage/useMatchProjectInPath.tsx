import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ParamTypes } from '../../App';
import PlantContext from '../../contexts/PlantContext';
import { AsyncStatus } from '../../contexts/UserContext';

class MatchProjectError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'Project is unavailable';
    }
}

const useMatchProjectInPath = () => {
    const {
        currentPlant,
        availableProjects,
        currentProject,
        setCurrentProject,
    } = useContext(PlantContext);
    const { project: projectInPath } = useParams<ParamTypes>();
    const [matchProjectStatus, setMatchProjectStatus] = useState(
        AsyncStatus.LOADING
    );
    useEffect(() => {
        if (!currentPlant || !availableProjects) return;
        const matchedProject = availableProjects.find(
            (project) => project.title === projectInPath
        );
        if (!matchedProject) {
            throw new MatchProjectError(
                'This project is either non-existent or unavailable to you. Please double check your URL and make sure you have access to this project'
            );
        }
        setCurrentProject(matchedProject);
        setMatchProjectStatus(AsyncStatus.SUCCESS);
    }, [currentPlant, availableProjects, projectInPath]);
    return { matchProjectStatus, currentProject };
};

export default useMatchProjectInPath;
