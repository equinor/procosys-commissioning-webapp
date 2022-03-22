import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { withPlantContext } from '../../test/contexts';
import { dummySignedChecklistResponse } from '../../test/dummyData';
import { ENDPOINTS, rest, server } from '../../test/setupServer';
import ChecklistPage from './ChecklistPage';

const renderChecklistPage = (contentType?: string): void => {
    render(
        withPlantContext({
            Component: (
                <MemoryRouter
                    initialEntries={[
                        `/plant-name/project-name/Comm/33/checklist/10${
                            contentType ? `/${contentType}` : ''
                        }`,
                    ]}
                >
                    <Route path="/:plant/:project/:searchType/:entityId/checklist/:checklistId">
                        <ChecklistPage />
                    </Route>
                </MemoryRouter>
            ),
        })
    );
};

jest.mock('@equinor/procosys-webapp-components', () => ({
    ...jest.requireActual('@equinor/procosys-webapp-components'),
    removeSubdirectories: (url: string, num: number): string => '/',
}));

describe('<Checklist/> after loading', () => {
    beforeEach(async () => {
        renderChecklistPage();
        const tagDescription = await screen.findByText('dummy-tag-description');
        expect(tagDescription).toBeInTheDocument();
        const attachmentImage = await screen.findByAltText(
            'Dummy image thumbnail'
        );
        expect(attachmentImage).toBeInTheDocument();
    });

    it('Lets user check all and uncheck all items', async () => {
        const checkAllButton = screen.getByRole('button', {
            name: 'Check all',
        });
        const firstCheckItem = screen.getByTestId('checked-2');
        const secondCheckItem = screen.getByTestId('checked-3');
        expect(firstCheckItem).toBeDisabled();
        expect(secondCheckItem).toBeEnabled();
        expect(secondCheckItem).not.toBeChecked();
        userEvent.click(checkAllButton);
        expect(checkAllButton).toBeDisabled();
        await screen.findByText('Changes saved.');
        expect(firstCheckItem).toBeDisabled();
        expect(secondCheckItem).toBeChecked();
        const uncheckAllButton = screen.getByRole('button', {
            name: 'Uncheck all',
        });
        userEvent.click(uncheckAllButton);
        await screen.findByText('Uncheck complete.');
        expect(firstCheckItem).toBeDisabled();
        expect(secondCheckItem).not.toBeChecked();
    });

    it('Lets user sign/unsign a checklist, showing relevant messages', async () => {
        const signButton = screen.getByRole('button', { name: 'Sign' });
        expect(signButton).toBeDisabled();
        const applicableMustBeCheckedWarning = screen.getByText(
            'All applicable items must be checked before signing.'
        );
        expect(applicableMustBeCheckedWarning).toBeInTheDocument();
        const missingCheckItem = screen.getByTestId('checked-3');
        expect(missingCheckItem).toBeEnabled();
        expect(missingCheckItem).not.toBeChecked();
        userEvent.click(missingCheckItem);
        await screen.findByText('Change saved.');
        expect(applicableMustBeCheckedWarning).not.toBeInTheDocument();
        expect(signButton).toBeEnabled();
        server.use(
            rest.get(ENDPOINTS.getChecklist, (_, response, context) => {
                return response(context.json(dummySignedChecklistResponse));
            })
        );
        userEvent.click(signButton);
        expect(signButton).toBeDisabled();
        await screen.findByText('Signing complete.');
        const checklistIsSignedBanner = await screen.findByText(
            'This checklist is signed. Unsign to make changes.'
        );
        expect(checklistIsSignedBanner).toBeInTheDocument();
        await screen.findByText('Signed by', { exact: false });
    });
});
