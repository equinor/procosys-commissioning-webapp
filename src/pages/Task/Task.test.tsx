import { render, screen } from '@testing-library/react';
import { withPlantContext } from '../../test/contexts';
import Task from './Task';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { ENDPOINTS, rest, server } from '../../test/setupServer';

beforeEach(async () => {
    render(withPlantContext({ Component: <Task /> }));
    await expect(
        await screen.findByText('dummy-task-description')
    ).toBeInTheDocument();
});

const editAndSaveComment = async () => {
    const editButton = screen.getByRole('button', {
        name: 'Edit comment',
    });
    userEvent.click(editButton);
    const saveButton = screen.getByRole('button', { name: 'Save comment' });
    userEvent.click(saveButton);
};

describe('<Task>', () => {
    it('Allows user to edit and save a comment', async () => {
        await editAndSaveComment();
        expect(
            await screen.findByText('Comment successfully saved.')
        ).toBeInTheDocument();
    });
    it('Renders error message if user is unable to edit and save a comment', async () => {
        server.use(
            rest.put(ENDPOINTS.putTaskComment, (request, response, context) => {
                return response(context.status(400));
            })
        );
        await editAndSaveComment();
        expect(await screen.findByText('Error')).toBeInTheDocument();
    });
    it('Allows user to sign and unsign the task, enabling and disabling the comment button', async () => {
        const editButton = screen.getByRole('button', {
            name: 'Edit comment',
        });
        expect(editButton).not.toBeDisabled();
        const signButton = screen.getByRole('button', { name: 'Sign' });
        userEvent.click(signButton);
        expect(
            await screen.findByText('Task successfully signed')
        ).toBeInTheDocument();
        expect(editButton).toBeDisabled();
        const unsignButton = screen.getByRole('button', { name: 'Unsign' });
        userEvent.click(unsignButton);
        expect(
            await screen.findByText('Task successfully unsigned')
        ).toBeInTheDocument();
        expect(editButton).not.toBeDisabled();
    });
    it('Renders error message when task signing fails', async () => {
        server.use(
            rest.post(ENDPOINTS.postTaskSign, (request, response, context) => {
                return response(context.status(400));
            })
        );
        const signButton = screen.getByRole('button', { name: 'Sign' });
        userEvent.click(signButton);
        expect(await screen.findByText('Error')).toBeInTheDocument();
    });
    it('Renders error message when task unsigning fails', async () => {
        server.use(
            rest.post(
                ENDPOINTS.postTaskUnsign,
                (request, response, context) => {
                    return response(context.status(400));
                }
            )
        );
        const signButton = screen.getByRole('button', { name: 'Sign' });
        userEvent.click(signButton);
        await screen.findByText('Task successfully signed');
        const unsignButton = screen.getByRole('button', { name: 'Unsign' });
        userEvent.click(unsignButton);
        expect(await screen.findByText('Error')).toBeInTheDocument();
    });
    it('Allows user to input and save a parameter value.', async () => {
        const measuredInput = screen.getByRole('textbox', {
            name: 'Measured V',
        });
        userEvent.type(measuredInput, '230');
        userEvent.tab();
        expect(
            await screen.findByText('Parameter value saved')
        ).toBeInTheDocument();
    });
    it('Renders error if failing to save parameter input.', async () => {
        server.use(
            rest.put(
                ENDPOINTS.putTaskParameter,
                (request, response, context) => {
                    return response(context.status(400));
                }
            )
        );
        const measuredInput = screen.getByRole('textbox', {
            name: 'Measured V',
        });
        userEvent.type(measuredInput, '230');
        userEvent.tab();
        expect(await screen.findByText('Error')).toBeInTheDocument();
    });
});
