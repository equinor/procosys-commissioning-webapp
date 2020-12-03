import React from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

const TasksWrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: red;
`;

const Tasks = () => {
    return <TasksWrapper></TasksWrapper>;
};

export default Tasks;
