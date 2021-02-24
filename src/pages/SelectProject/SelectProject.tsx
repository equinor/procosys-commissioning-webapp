import { Button } from '@equinor/eds-core-react';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import EdsIcon from '../../components/icons/EdsIcon';
import ErrorPage from '../../components/error/ErrorPage';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import Navbar from '../../components/navigation/Navbar';
import PageHeader from '../../components/PageHeader';
import PlantContext from '../../contexts/PlantContext';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { SelectPlantWrapper, SelectorButton } from '../SelectPlant/SelectPlant';

const SelectProject = () => {
    const {
        availableProjects: projects,
        currentPlant,
        fetchProjectsAndPermissionsStatus,
    } = useContext(PlantContext);
    const history = useHistory();

    const content = () => {
        if (
            fetchProjectsAndPermissionsStatus === AsyncStatus.SUCCESS &&
            projects &&
            projects.length > 0
        ) {
            return (
                <>
                    <PageHeader
                        title={'Select project'}
                        subtitle={currentPlant?.title}
                    />
                    {projects.map((project) => (
                        <SelectorButton
                            key={project.id}
                            to={`/${currentPlant?.slug}/${project.title}`}
                        >
                            <div>
                                <label>{project.title}</label>
                                <p>{project.description}</p>
                            </div>
                            <EdsIcon
                                name="chevron_right"
                                title="chevron right"
                            />
                        </SelectorButton>
                    ))}
                </>
            );
        } else if (
            fetchProjectsAndPermissionsStatus === AsyncStatus.SUCCESS &&
            projects &&
            projects.length < 1
        ) {
            return (
                <>
                    <PageHeader title="No projects to show" />
                    <Button onClick={() => history.push('/')}>
                        Select a different plant
                    </Button>
                </>
            );
        } else if (fetchProjectsAndPermissionsStatus === AsyncStatus.ERROR) {
            return (
                <ErrorPage
                    title="Error: Unable to load projects"
                    description="There might be a problem with your connection or your permissions"
                />
            );
        } else {
            return <SkeletonLoadingPage text={`Loading projects`} />;
        }
    };

    return (
        <>
            <Navbar leftContent={{ name: 'hamburger' }} />
            <SelectPlantWrapper>{content()}</SelectPlantWrapper>
        </>
    );
};

export default SelectProject;
