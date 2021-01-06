import React, { useEffect, useState } from 'react';
import { TextField } from '@equinor/eds-core-react';
import { CommParams } from '../../App';
import { useParams } from 'react-router-dom';
import * as api from '../../services/api';
import { AsyncStatus } from '../../contexts/UserContext';
import styled from 'styled-components';

const HelperText = styled.div`
    height: 12px;
    margin-top: 2px;
    & p {
        margin: 0;
        font-size: 12px;
    }
`;

type MetaTableCellProps = {
    checkItemId: number;
    rowId: number;
    columnId: number;
    value: string;
    unit: string;
    disabled: boolean;
};

const MetaTableCell = ({
    value,
    unit,
    disabled,
    rowId,
    columnId,
    checkItemId,
}: MetaTableCellProps) => {
    const { checklistId, plant } = useParams<CommParams>();
    const [inputValue, setInputValue] = useState(value);
    const [submitStatus, setSubmitStatus] = useState<AsyncStatus | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const submitData = async () => {
        if (inputValue === value) return;
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
            console.log(error);
            setErrorMessage(error);
            setSubmitStatus(AsyncStatus.ERROR);
            console.log(errorMessage);
        }
    };

    useEffect(() => {
        if (submitStatus !== AsyncStatus.SUCCESS) return;
        setTimeout(() => {
            setSubmitStatus(null);
        }, 2000);
    }, [submitStatus]);

    const helperText = () => {
        if (submitStatus === AsyncStatus.ERROR) return 'Unable to save.';
        if (submitStatus === AsyncStatus.LOADING) return 'Saving data...';
        if (submitStatus === AsyncStatus.SUCCESS) return 'Success.';
        return '';
    };

    const determineVariant = () => {
        if (submitStatus === AsyncStatus.ERROR) return 'error';
        if (submitStatus === AsyncStatus.SUCCESS) return 'success';
        return 'default';
    };

    return (
        <td>
            <TextField
                id={rowId.toString() + columnId.toString() + 'textfield'}
                meta={unit}
                label={}
                value={inputValue ? inputValue : ''}
                disabled={disabled}
                variant={
                    (submitStatus === AsyncStatus.ERROR && 'error') ||
                    (submitStatus === AsyncStatus.SUCCESS && 'success') ||
                    'default'
                }
                onBlur={submitData}
                onChange={(
                    event: React.ChangeEvent<
                        HTMLTextAreaElement | HTMLInputElement
                    >
                ) => setInputValue(event.target.value)}
            />
            <HelperText>
                <p>{helperText()}</p>
            </HelperText>
        </td>
    );
};

export default MetaTableCell;
