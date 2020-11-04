import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { ParamTypes } from '../../App';
import PlantContext, { Plant } from '../../contexts/PlantContext';
import { AsyncStatus } from '../../contexts/UserContext';
import * as api from '../../services/api';
import { H3 } from '../../style/text';
import FullPageLoader from '../loading/FullPageLoader';
import { WideButton } from './SelectPlant';
import usePlantFromURL from '../../utils/usePlantFromURL';

export type Project = {
    description: string;
    id: number;
    title: string;
};

const SelectProject = () => {
    const { plant: plantInPath } = useParams<ParamTypes>();
    const { push } = useHistory();
    const [projects, setProjects] = useState<Project[]>([]);
    const [fetchProjectsStatus, setFetchProjectsStatus] = useState(
        AsyncStatus.LOADING
    );
    const currentPlant = usePlantFromURL(plantInPath);

    const projectsToRender = projects.map((project) => (
        <WideButton
            color="secondary"
            variant="outlined"
            key={project.id}
            onClick={() => push(`/${plantInPath}/${project.title}`)}
        >
            {project.description}
        </WideButton>
    ));

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
                console.log(error);
                setFetchProjectsStatus(AsyncStatus.ERROR);
            }
        })();
    }, []);

    if (currentPlant === undefined) {
        return (
            <h3>
                Error: Could not find the plant specified in your URL. Check
                your permissions.
            </h3>
        );
    }

    if (fetchProjectsStatus === AsyncStatus.LOADING) {
        return (
            <FullPageLoader
                text={`Loading projects for ${currentPlant!.title}`}
            />
        );
    }

    if (fetchProjectsStatus === AsyncStatus.SUCCESS) {
        return (
            <>
                {projectsToRender.length > 0 ? (
                    <>
                        <H3 style={{ margin: '20px 0', textAlign: 'center' }}>
                            Select Project
                        </H3>
                        {projectsToRender}
                    </>
                ) : (
                    <H3>No projects available for this plant</H3>
                )}
            </>
        );
    }
    return <H3>Error getting projects</H3>;
};

export default SelectProject;
