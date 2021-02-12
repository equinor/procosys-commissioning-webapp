import React, { useContext, useEffect, useState } from 'react';
import { TextField } from '@equinor/eds-core-react';
import { CommParams } from '../../../../../App';
import { useParams } from 'react-router-dom';
import CommAppContext, {
    AsyncStatus,
} from '../../../../../contexts/CommAppContext';
import styled from 'styled-components';

const HelperText = styled.div`
    height: 12px;
    margin-top: 2px;
    margin-left: 8px;
    & p {
        margin: 0;
        font-size: 12px;
    }
`;

export type MetaTableCellProps = {
    checkItemId: number;
    rowId: number;
    columnId: number;
    value: string;
    unit: string;
    disabled: boolean;
    label: string;
};

function determineHelperText(submitStatus: AsyncStatus) {
    if (submitStatus === AsyncStatus.ERROR) return 'Unable to save.';
    if (submitStatus === AsyncStatus.LOADING) return 'Saving data...';
    if (submitStatus === AsyncStatus.SUCCESS) return 'Data saved.';
    return '';
}

const MetaTableCell = ({
    value,
    unit,
    disabled,
    rowId,
    columnId,
    checkItemId,
    label,
}: MetaTableCellProps) => {
    const { api } = useContext(CommAppContext);
    const { checklistId, plant } = useParams<CommParams>();
    const [inputValue, setInputValue] = useState(value);
    const [submitStatus, setSubmitStatus] = useState<AsyncStatus>(
        AsyncStatus.INACTIVE
    );
    const [errorMessage, setErrorMessage] = useState('');
    let valueBeforeFocus = '';

    const submitData = async () => {
        setSubmitStatus(AsyncStatus.LOADING);
        try {
            await api.putMetaTableCell(
                plant,
                checkItemId,
                parseInt(checklistId),
                columnId,
                rowId,
                inputValue
            );
            setSubmitStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setErrorMessage(error);
            setSubmitStatus(AsyncStatus.ERROR);
        }
    };

    useEffect(() => {
        if (submitStatus !== AsyncStatus.SUCCESS) return;
        let timerId = setTimeout(() => {
            setSubmitStatus(AsyncStatus.INACTIVE);
        }, 2000);
        return () => clearTimeout(timerId);
    }, [submitStatus]);

    return (
        <td>
            <TextField
                id={rowId.toString() + columnId.toString() + 'textfield'}
                meta={unit}
                label={label}
                value={inputValue ? inputValue : ''}
                disabled={disabled}
                variant={
                    (submitStatus === AsyncStatus.ERROR && 'error') ||
                    (submitStatus === AsyncStatus.SUCCESS && 'success') ||
                    'default'
                }
                onFocus={() => (valueBeforeFocus = value)}
                onBlur={() => {
                    value !== valueBeforeFocus && submitData();
                }}
                onChange={(
                    event: React.ChangeEvent<
                        HTMLTextAreaElement | HTMLInputElement
                    >
                ) => setInputValue(event.target.value)}
            />
            <HelperText>
                <p>{determineHelperText(submitStatus)}</p>
            </HelperText>
        </td>
    );
};

export default MetaTableCell;
