import { Card, TextField } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import { TaskParameter } from '../../../services/apiTypes';
import { BREAKPOINT } from '../../../style/GlobalStyles';
import useCommonHooks from '../../../utils/useCommonHooks';
import { TaskCardWrapper } from '../TaskDescription';
import MeasuredValueInput from './MeasuredValueInput';
const { CardHeader, CardHeaderTitle } = Card;

const ParameterRow = styled.div`
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid #007179;
`;

const ParameterInputWrapper = styled.div`
    display: flex;
    max-width: 50%;
    & div:first-of-type {
        margin-right: 8px;
    }
    ${BREAKPOINT.sm} {
        flex-direction: column;
        & div:first-of-type {
            margin-bottom: 8px;
        }
    }
`;

export type TaskParameterDto = {
    ParameterId: number;
    Value: string;
};

type TaskParametersProps = {
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const TaskParameters = ({ setSnackbarText }: TaskParametersProps) => {
    const { api, params } = useCommonHooks();
    const [parameters, setParameters] = useState<TaskParameter[]>([]);
    const [fetchParametersStatus, setFetchParametersStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        (async () => {
            try {
                const parametersFromApi = await api.getTaskParameters(
                    params.plant,
                    params.taskId
                );
                setParameters(parametersFromApi);
                setFetchParametersStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchParametersStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params.taskId, params.plant]);

    const content = () => {
        if (
            fetchParametersStatus === AsyncStatus.SUCCESS &&
            parameters.length < 1
        ) {
            return <p>This task has no parameters.</p>;
        } else if (
            fetchParametersStatus === AsyncStatus.SUCCESS &&
            parameters.length > 0
        ) {
            return parameters.map((parameter) => (
                <ParameterRow key={parameter.id}>
                    <p>{parameter.description}</p>
                    <ParameterInputWrapper>
                        <TextField
                            label={'Reference'}
                            disabled
                            readOnly
                            meta={parameter.referenceUnit}
                            defaultValue={parameter.referenceValue}
                            id={'ReferenceValue'}
                        />
                        <MeasuredValueInput
                            parameter={parameter}
                            setSnackbarText={setSnackbarText}
                        />
                    </ParameterInputWrapper>
                </ParameterRow>
            ));
        } else if (fetchParametersStatus === AsyncStatus.ERROR) {
            return <p>Unable to fetch parameters. Please reload.</p>;
        } else {
            return <SkeletonLoadingPage nrOfRows={3} />;
        }
    };

    return (
        <TaskCardWrapper>
            <Card>
                <CardHeader>
                    <CardHeaderTitle>
                        <h3>Parameters</h3>
                    </CardHeaderTitle>
                    <EdsIcon name="tune" />
                </CardHeader>
                {content()}
            </Card>
        </TaskCardWrapper>
    );
};

export default TaskParameters;
