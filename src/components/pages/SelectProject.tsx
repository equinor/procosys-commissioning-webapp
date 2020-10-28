import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

type Project = {
    name: string;
    id: number;
};

const SelectProject = () => {
    const lala = useParams();
    console.log(lala);
    const [selectedProject, setSelectedProject] = useState<Project>({
        name: 'default',
        id: 0,
    });
    const [projects, setProjects] = useState([
        { name: 'Vannprosjekt', id: 1 },
        { name: 'Brannprosjekt', id: 2 },
    ]);
    const projectsToRender = projects.map((project) => (
        <Link
            to={`/project=${project.name}`}
            key={project.id}
            onClick={(e: React.MouseEvent) => setSelectedProject(project)}
        >
            SELECT {project.name}
        </Link>
    ));
    return (
        <div>
            {projectsToRender}
            <p>Selected: {selectedProject.name}</p>
        </div>
    );
};

export default SelectProject;
