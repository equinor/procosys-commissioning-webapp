import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { ParamTypes } from '../../App';
import PlantContext, { Plant } from '../../contexts/PlantContext';
import { AsyncStatus } from '../../contexts/UserContext';
import * as api from '../../services/api';
import { H3 } from '../../style/text';
import SkeletonLoadingPage from '../loading/SkeletonLoadingPage';
import { WideButton } from './SelectPlant';
import usePlantFromURL from '../../utils/usePlantFromURL';
import { Icon } from '@equinor/eds-core-react';
import styled from 'styled-components';

export type Project = {
    description: string;
    id: number;
    title: string;
};

const SelectProjectWrapper = styled.main`
    display: flex;
    flex-direction: column;
    & h3 {
        text-align: center;
    }
`;

const SelectProject = () => {
    const { plant: plantInPath } = useParams<ParamTypes>();
    const { push } = useHistory();
    const [projects, setProjects] = useState<Project[]>([]);
    const [fetchProjectsStatus, setFetchProjectsStatus] = useState(
        AsyncStatus.LOADING
    );
    const currentPlant = usePlantFromURL(plantInPath);
    const { setSelectedPlant } = useContext(PlantContext);
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
                console.log('Could not get projects');
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
            <SkeletonLoadingPage
                text={`Loading projects for ${currentPlant!.title}`}
            />
        );
    }

    if (fetchProjectsStatus === AsyncStatus.SUCCESS) {
        return (
            <SelectProjectWrapper>
                {projectsToRender.length > 0 ? (
                    <>
                        <h3>Select Project</h3>
                        {projectsToRender}
                    </>
                ) : (
                    <h3>No projects available for this plant</h3>
                )}
            </SelectProjectWrapper>
        );
    }
    return <h3>Error getting projects</h3>;
};

export default SelectProject;
