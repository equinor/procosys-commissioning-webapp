import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import PlantContext from '../../contexts/PlantContext';
import { AsyncStatus } from '../../contexts/UserContext';
import * as api from '../../services/api';
import { H3 } from '../../style/text';
import FullPageLoader from '../loading/FullPageLoader';
import { WideButton } from './SelectPlant';

export type Project = {
    description: string;
    id: number;
    title: string;
};

export type ParamTypes = {
    plant: string;
    project: string;
};

const SelectProject = () => {
    const { plant } = useParams<ParamTypes>();
    const { push } = useHistory();
    const [projects, setProjects] = useState<Project[]>([]);
    const [fetchProjectsStatus, setFetchProjectsStatus] = useState(
        AsyncStatus.LOADING
    );
    const { selectedPlant } = useContext(PlantContext);

    const projectsToRender = projects.map((project) => (
        <WideButton
            color="secondary"
            variant="outlined"
            key={project.id}
            onClick={() => push(`/${plant}/${project.title}`)}
        >
            {project.description}
        </WideButton>
    ));

    useEffect(() => {
        (async () => {
            setFetchProjectsStatus(AsyncStatus.LOADING);
            try {
                const projectsFromApi = await api.getProjectsForPlant(
                    'PCS$' + plant
                );
                setProjects(projectsFromApi);
                setFetchProjectsStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                console.log(error);
                setFetchProjectsStatus(AsyncStatus.ERROR);
            }
        })();
    }, []);

    if (fetchProjectsStatus === AsyncStatus.LOADING) {
        return (
            <FullPageLoader
                text={`Loading projects for ${selectedPlant?.title}`}
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
