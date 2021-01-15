import { Button } from '@equinor/eds-core-react';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import EdsIcon from '../../components/icons/EdsIcon';
import ErrorPage from '../../components/error/ErrorPage';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import Navbar from '../../components/navigation/Navbar';
import PageHeader from '../../components/PageHeader';
import PlantContext from '../../contexts/PlantContext';
import { AsyncStatus } from '../../contexts/UserContext';
import { SelectPlantWrapper, SelectorButton } from '../SelectPlant/SelectPlant';

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

    let content = (
        <>
            <PageHeader
                title={'Select project'}
                subtitle={currentPlant?.title}
            />
            {projectsToRender}
        </>
    );

    if (fetchProjectsAndPermissionsStatus === AsyncStatus.LOADING) {
        content = <SkeletonLoadingPage text={`Loading projects`} />;
    }

    if (fetchProjectsAndPermissionsStatus === AsyncStatus.ERROR) {
        content = (
            <ErrorPage
                title="Error: Unable to load projects"
                description="There might be a problem with your connection or your permissions"
            />
        );
    }

    if (
        fetchProjectsAndPermissionsStatus === AsyncStatus.SUCCESS &&
        projectsToRender!.length < 1
    ) {
        content = (
            <>
                <PageHeader title="No projects to show" />
                <Button onClick={() => history.push('/')}>
                    Select a different plant
                </Button>
            </>
        );
    }

    return (
        <>
            <Navbar leftContent={{ name: 'hamburger' }} />
            <SelectPlantWrapper>{content}</SelectPlantWrapper>
        </>
    );
};

export default SelectProject;
