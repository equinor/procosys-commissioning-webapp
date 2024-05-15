import { withPlantContext } from '../../../test/contexts';
import Tasks from './Tasks';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server, ENDPOINTS, causeApiError } from '../../../test/setupServer';
import { TaskPreview } from '../../../typings/apiTypes';
import { AsyncStatus } from '../../../contexts/CommAppContext';

type TasksProps = {
    fetchStatus: AsyncStatus;
    tasks: TaskPreview[] | undefined;
};

const renderTasks = (props: TasksProps): void => {
    render(
        withPlantContext({
            Component: <Tasks {...props} />,
        })
    );
};

describe('<Tasks />', () => {
    it('Renders a checklist preview button with tag description', async () => {
        const mockTasks: TaskPreview[] = [
            {
                id: 1,
                number: 'dummy-task-number',
                title: 'Dummy Task',
                chapter: 'Dummy Chapter',
                isSigned: false,
            },
        ];
        const mockProps: TasksProps = {
            fetchStatus: AsyncStatus.SUCCESS,
            tasks: mockTasks,
        };
        renderTasks(mockProps);
        const previewButton = await screen.findByText('dummy-task-number');
        expect(previewButton).toBeInTheDocument();
    });

    it('Renders placeholder text when an empty tasks is returned from API', async () => {
        server.use(
            rest.get(ENDPOINTS.getTasks, (request, response, context) => {
                return response(context.json([]), context.status(200));
            })
        );
    });

    it('Renders error message if unable to get tasks', async () => {
        causeApiError(ENDPOINTS.getTasks, 'get');
        renderTasks({ fetchStatus: AsyncStatus.ERROR, tasks: undefined });
        const errorMessage = await screen.findByText('Unable to load tasks.');
        expect(errorMessage).toBeInTheDocument();
    });
});
