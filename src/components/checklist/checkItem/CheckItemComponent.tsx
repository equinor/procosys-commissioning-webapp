import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckItem } from '../../../services/apiTypes';
import { Checkbox, Switch } from '@equinor/eds-core-react';
import MetaTable from './MetaTable';
import * as api from '../../../services/api';
import { CommParams } from '../../../App';
import { useParams } from 'react-router-dom';
import CheckItemDescription from './CheckItemDescription';

// This file has -Component suffixed to its name to avoid naming conflict with the CheckItem type.

const CheckItemWrapper = styled.div<{ disabled: boolean }>`
    background-color: ${(props) =>
        props.disabled ? 'transparent' : 'transparent'};
    padding: 12px 0 12px 0;
    margin-top: 12px;
    & p,
    button {
        color: ${(props) => (props.disabled ? '#777777' : 'initial')};
    }
    transition: background-color 0.2s ease-in-out;
    transition: color 0.2s ease-in-out;
`;

const DescriptionAndCheckWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const LeftWrapper = styled.div`
    & > p {
        flex: auto;
        margin: 0;
    }
`;

const CheckboxGroup = styled.div`
    flex: 0 0 80px;
    display: flex;
    justify-content: space-between;
`;

type CheckItemComponentProps = {
    item: CheckItem;
    updateNA: (value: boolean, checkItemId: number) => void;
    updateOk: (value: boolean, checkItemId: number) => void;
    checklistId: number;
    isSigned: boolean;
};

const CheckItemComponent = ({
    item,
    isSigned,
    updateNA,
    updateOk,
}: CheckItemComponentProps) => {
    const { checklistId } = useParams<CommParams>();
    const { plant } = useParams<CommParams>();

    const clearCheckmarks = async () => {
        try {
            await api.postClear(plant, parseInt(checklistId), item.id);
            updateOk(false, item.id);
            updateNA(false, item.id);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSetNA = async () => {
        if (item.isNotApplicable) return clearCheckmarks();
        try {
            await api.postSetNA(plant, parseInt(checklistId), item.id);
            updateOk(false, item.id);
            updateNA(true, item.id);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSetOk = async () => {
        if (item.isOk) return clearCheckmarks();
        try {
            await api.postSetOk(plant, parseInt(checklistId), item.id);
            updateNA(false, item.id);
            updateOk(true, item.id);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <CheckItemWrapper disabled={item.isNotApplicable}>
                <DescriptionAndCheckWrapper>
                    <LeftWrapper>
                        <p>{item.text}</p>
                        {item.detailText && (
                            <CheckItemDescription
                                description={item.detailText}
                            />
                        )}
                    </LeftWrapper>
                    <CheckboxGroup>
                        <Checkbox
                            disabled={isSigned || item.isNotApplicable}
                            enterKeyHint
                            onChange={handleSetOk}
                            checked={item.isOk}
                            label={''}
                        />
                        <Checkbox
                            disabled={isSigned}
                            enterKeyHint
                            onChange={handleSetNA}
                            checked={item.isNotApplicable}
                            label={''}
                        />
                    </CheckboxGroup>
                </DescriptionAndCheckWrapper>
                {item.metaTable && !item.isNotApplicable && (
                    <MetaTable
                        disabled={item.isNotApplicable || isSigned}
                        labels={item.metaTable.columnLabels}
                        rows={item.metaTable.rows}
                        isSigned={isSigned}
                        checkItemId={item.id}
                    />
                )}
            </CheckItemWrapper>
        </>
    );
};

export default CheckItemComponent;
