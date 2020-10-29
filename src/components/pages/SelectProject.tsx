import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as api from '../../services/api';
import { WideButton } from './SelectPlant';

export type Project = {
    description: string;
    id: number;
    title: string;
};

interface ParamTypes {
    plant: string;
}

const SelectProject = () => {
    const { plant } = useParams<ParamTypes>();
    const [projects, setProjects] = useState<Project[]>([]);
    const projectsToRender = projects.map((project) => (
        <Link to={`/${plant}/${project.title}`} key={project.id}>
            <WideButton color="secondary" variant="outlined">
                {project.description}
            </WideButton>
            <br />
        </Link>
    ));
    useEffect(() => {
        const populateProjects = async () => {
            try {
                const projectsFromApi = await api.getProjectsForPlant(
                    'PCS$' + plant
                );
                setProjects(projectsFromApi);
            } catch (error) {
                console.log(error);
            }
        };
        populateProjects();
    }, []);
    return <div>{projectsToRender}</div>;
};

export default SelectProject;
