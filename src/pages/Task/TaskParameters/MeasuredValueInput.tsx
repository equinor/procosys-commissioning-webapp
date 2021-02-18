import { TextField } from '@equinor/eds-core-react';
import React, { useState } from 'react';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import { TaskParameter } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import { TaskParameterDto } from './TaskParameters';

type MeasuredValueInputProps = {
    parameter: TaskParameter;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const MeasuredValueInput = ({
    parameter,
    setSnackbarText,
}: MeasuredValueInputProps) => {
    const { api, params } = useCommonHooks();
    const [value, setValue] = useState(parameter.measuredValue);
    const [updateValueStatus, setUpdateValueStatus] = useState(
        AsyncStatus.INACTIVE
    );
    let valueBeforeFocus = '';

    const updateValue = async () => {
        setUpdateValueStatus(AsyncStatus.LOADING);
        const dto: TaskParameterDto = {
            ParameterId: parameter.id,
            Value: value,
        };
        try {
            await api.putTaskParameter(params.plant, dto);
            setUpdateValueStatus(AsyncStatus.SUCCESS);
            setSnackbarText('Parameter value saved');
        } catch {
            setUpdateValueStatus(AsyncStatus.ERROR);
            setSnackbarText('Unable to save parameter value');
        }
    };

    return (
        <TextField
            label={'Measured'}
            disabled={updateValueStatus === AsyncStatus.LOADING}
            meta={parameter.referenceUnit}
            value={value}
            id={'MeasuredValue ' + parameter.id.toString()}
            onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
                setValue(e.target.value);
            }}
            onFocus={() => (valueBeforeFocus = value)}
            onBlur={() => value !== valueBeforeFocus && updateValue()}
        />
    );
};

export default MeasuredValueInput;