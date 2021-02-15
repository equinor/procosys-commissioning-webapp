import { withPlantContext } from '../../../test/contexts';
import React from 'react';
import Tasks from './Tasks';
import { render, screen, waitFor } from '@testing-library/react';

const renderTasks = () => {
    render(
        withPlantContext({
            Component: <Tasks />,
        })
    );
};

describe('<Tasks />', () => {
    it('Renders a task preview button with task title and task number', async () => {
        renderTasks();
        await waitFor(async () => {
            await expect(
                screen.getByText('dummy-task-title')
            ).toBeInTheDocument();
        });
    });
    test.todo(
        'Renders placeholder text when an empty task list is returned from API'
    );
    test.todo('Renders error page');
});
