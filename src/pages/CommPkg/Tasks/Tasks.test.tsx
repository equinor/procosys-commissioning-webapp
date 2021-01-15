import { testTasks, withCommPkgContext } from '../../../test/contexts';
import React from 'react';
import Tasks from './Tasks';

describe('<Tasks />', () => {
    it('Renders placeholder text when an empty task list is returned from API', () => {
        const { getByText } = withCommPkgContext({
            Component: <Tasks />,
            tasks: [],
        });
        expect(getByText('No tasks to display.')).toBeInTheDocument();
    });
    it('Renders a task preview button with task title and task number', () => {
        const { getByText } = withCommPkgContext({
            Component: <Tasks />,
            tasks: testTasks,
        });
        expect(getByText('Test task title')).toBeInTheDocument();
        expect(getByText('Test task number')).toBeInTheDocument();
    });
});
