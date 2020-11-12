import { Button } from '@equinor/eds-core-react';
import { SelectPlantWrapper, SelectorButton } from '../SelectPlant';
import { AsyncStatus } from '../../../contexts/UserContext';
import ErrorPage from '../../error/ErrorPage';
import PageHeader from '../../PageHeader';
import React, { useContext } from 'react';
import SkeletonLoadingPage from '../../loading/SkeletonLoadingPage';
import { useHistory } from 'react-router-dom';
import EdsIcon from '../../EdsIcon';
import PlantContext from '../../../contexts/PlantContext';

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
            <p>{project.title}</p>
            <EdsIcon name="chevron_right" title="chevron right" />
        </SelectorButton>
    ));

    if (fetchProjectsAndPermissionsStatus === AsyncStatus.LOADING) {
        return <SkeletonLoadingPage text={`Loading projects . . .`} />;
    }

    if (fetchProjectsAndPermissionsStatus === AsyncStatus.ERROR) {
        return (
            <ErrorPage
                errorTitle="Error: Unable to load projects"
                errorDescription="There might be a problem with your connection or your permissions"
            />
        );
    }

    if (
        fetchProjectsAndPermissionsStatus === AsyncStatus.SUCCESS &&
        !currentPlant
    ) {
        return (
            <ErrorPage
                errorTitle="Error: Could not find plant in URL"
                errorDescription="Could not find the plant specified in the URL. Please check your permissions, or whether your URL is correct"
            />
        );
    }

    if (projectsToRender!.length < 1) {
        return (
            <SelectPlantWrapper>
                <PageHeader text="No projects to show" />
                <Button onClick={() => history.push('/')}>
                    Select a different plant
                </Button>
            </SelectPlantWrapper>
        );
    }

    return (
        <SelectPlantWrapper>
            <PageHeader text={'Select project'} />
            {projectsToRender}
        </SelectPlantWrapper>
    );
};

export default SelectProject;
