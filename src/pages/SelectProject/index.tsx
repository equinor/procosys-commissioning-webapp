import { Button } from '@equinor/eds-core-react';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import EdsIcon from '../../components/EdsIcon';
import ErrorPage from '../../components/error/ErrorPage';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import PageHeader from '../../components/PageHeader';
import PlantContext from '../../contexts/PlantContext';
import { AsyncStatus } from '../../contexts/UserContext';
import { SelectPlantWrapper, SelectorButton } from '../SelectPlant';

const SelectProject = () => {
    const {
        availableProjects: projects,
        currentPlant,
        fetchProjectsAndPermissionsStatus,
    } = useContext(PlantContext);
    const history = useHistory();

    const projectsToRender = projects?.map((project) => (
        <SelectorButton
            key={project.id}
            to={`/${currentPlant?.slug}/${project.title}`}
        >
            <div>
                <label>{project.title}</label>
                <p>{project.description}</p>
            </div>
            <EdsIcon name="chevron_right" title="chevron right" />
        </SelectorButton>
    ));

    if (fetchProjectsAndPermissionsStatus === AsyncStatus.LOADING) {
        return <SkeletonLoadingPage text={`Loading projects . . .`} />;
    }

    if (fetchProjectsAndPermissionsStatus === AsyncStatus.ERROR) {
        return (
            <ErrorPage
                title="Error: Unable to load projects"
                description="There might be a problem with your connection or your permissions"
            />
        );
    }

    if (projectsToRender!.length < 1) {
        return (
            <SelectPlantWrapper>
                <PageHeader title="No projects to show" />
                <Button onClick={() => history.push('/')}>
                    <p>Select a different plant</p>
                </Button>
            </SelectPlantWrapper>
        );
    }

    return (
        <SelectPlantWrapper>
            <PageHeader
                title={'Select project'}
                subtitle={currentPlant?.title}
            />
            {projectsToRender}
        </SelectPlantWrapper>
    );
};

export default SelectProject;
