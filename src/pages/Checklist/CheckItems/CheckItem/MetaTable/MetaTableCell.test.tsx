import {
    render,
    waitFor,
    waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import MetaTableCell, { MetaTableCellProps } from './MetaTableCell';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ENDPOINTS, causeApiError } from '../../../../../test/setupServer';
import { withCommAppContext } from '../../../../../test/contexts';
import { act } from 'react-dom/test-utils';

jest.mock('../../../../../services/authService');

const metaTableCellTestProps: MetaTableCellProps = {
    checkItemId: 0,
    rowId: 0,
    cell: {
        columnId: 0,
        value: 'Test value',
        unit: 'Test unit',
        valueDate: '',
        isValueDate: false,
    },
    disabled: false,
    label: 'Test label',
};

const metaTableCellForTesting = withCommAppContext({
    Component: (
        <table>
            <tbody>
                <tr>
                    <MetaTableCell {...metaTableCellTestProps} />
                </tr>
            </tbody>
        </table>
    ),
});

async function setupWithInputTypedIn(): Promise<void> {
    render(metaTableCellForTesting);

    const input = await screen.findByDisplayValue(
        metaTableCellTestProps.cell.value
    );
    userEvent.type(input, 's');
}

describe('<MetaTableCell>', () => {
    it('Renders correct label, unit and initial value', () => {
        render(metaTableCellForTesting);
        expect(screen.getByText('Test label')).toBeInTheDocument();
        expect(screen.getByText('Test unit')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test value')).toBeInTheDocument();
    });
    it('Renders correct label, unit and initial value', async () => {
        render(metaTableCellForTesting);
        const input = await screen.findByDisplayValue(
            metaTableCellTestProps.cell.value
        );
        await userEvent.type(input, 's');

        expect(screen.getByDisplayValue('Test values')).toBeInTheDocument();
    });
    it('Renders whatever the user types into the input field.', async () => {
        render(metaTableCellForTesting);
        const input = await screen.findByDisplayValue(
            metaTableCellTestProps.cell.value
        );
        await userEvent.type(input, 's');
        await waitFor(() => {
            expect(screen.getByDisplayValue('Test values')).toBeInTheDocument();
        });
    });
    // it('Renders "Saving..."-message after exiting input field', async () => {
    //     render(metaTableCellForTesting);
    //     const input = await screen.findByDisplayValue(
    //         metaTableCellTestProps.cell.value
    //     );
    //     await userEvent.type(input, 's');
    //     await userEvent.tab();

    //     screen.debug();
    //         expect(screen.getByText('Saving data...')).toBeVisible();

    //     waitForElementToBeRemoved(() => screen.getByDisplayValue('Saving data...'));
    // });
    it('Renders "Data saved."-message upon successful save', async () => {
        render(metaTableCellForTesting);
        const input = await screen.findByDisplayValue(
            metaTableCellTestProps.cell.value
        );
        await userEvent.type(input, 's');
        await userEvent.tab();
        expect(screen.getByText('Data saved.')).toBeInTheDocument();
    });
    it('Renders "Unable to save." upon error', async () => {
        causeApiError(ENDPOINTS.putMetaTableCell, 'put');
        render(metaTableCellForTesting);
        const input = await screen.findByDisplayValue(
            metaTableCellTestProps.cell.value
        );
        await userEvent.type(input, 's');
        await userEvent.tab();

        expect(screen.getByText('Unable to save.')).toBeInTheDocument();

    });
});
