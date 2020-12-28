import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckItem } from '../../services/apiTypes';
import { Button } from '@equinor/eds-core-react';
import EdsIcon from '../EdsIcon';
import MetaTable from './MetaTable';
import * as api from '../../services/api';
import { CommParams } from '../../App';
import { useParams } from 'react-router-dom';

// This file has -Component suffixed to its name to avoid naming conflict with the CheckItem type.

const CheckItemWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > p {
        flex: auto;
    }
`;

const RadioGroup = styled.div`
    flex: 0 0 116px;
    display: flex;
    justify-content: space-between;
`;

type CheckItemComponentProps = {
    item: CheckItem;
    checklistId: number;
    isSigned: boolean;
};

const CheckItemComponent = ({ item, isSigned }: CheckItemComponentProps) => {
    const { checklistId } = useParams<CommParams>();
    const { plant } = useParams<CommParams>();
    const [isNA, setIsNA] = useState(item.isNotApplicable);
    const [isOk, setIsOk] = useState(item.isOk);

    const handleSetNA = async () => {
        try {
            await api.postSetNA(plant, parseInt(checklistId), item.id);
            setIsOk(false);
            setIsNA(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSetOk = async () => {
        try {
            await api.postSetOk(plant, parseInt(checklistId), item.id);
            setIsNA(false);
            setIsOk(true);
        } catch (error) {
            console.log(error);
        }
    };

    const radioButtonSelected = (
        <EdsIcon name="check_circle_outlined" color="primary" />
    );
    const radioButtonUnselected = (
        <EdsIcon name="radio_button_unselected" color="primary" />
    );
    return (
        <>
            <CheckItemWrapper>
                <p>{item.text}</p>
                <RadioGroup>
                    {isOk ? (
                        <Button variant="ghost">{radioButtonSelected}</Button>
                    ) : (
                        <Button variant="ghost" onClick={handleSetOk}>
                            {radioButtonUnselected}
                        </Button>
                    )}
                    {isNA ? (
                        <Button variant="ghost">{radioButtonSelected}</Button>
                    ) : (
                        <Button variant="ghost" onClick={handleSetNA}>
                            {radioButtonUnselected}
                        </Button>
                    )}
                </RadioGroup>
            </CheckItemWrapper>
            {item.metaTable && (
                <MetaTable
                    labels={item.metaTable.columnLabels}
                    rows={item.metaTable.rows}
                    isSigned={isSigned}
                    checkItemId={item.id}
                />
            )}
        </>
    );
};

export default CheckItemComponent;
