import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckItem } from '../../services/apiTypes';
import { Checkbox } from '@equinor/eds-core-react';
import MetaTable from './MetaTable';
import * as api from '../../services/api';
import { CommParams } from '../../App';
import { useParams } from 'react-router-dom';
import CheckItemDescription from './CheckItemDescription';

// This file has -Component suffixed to its name to avoid naming conflict with the CheckItem type.

const CheckItemWrapper = styled.div`
    margin-bottom: 18px;
`;

const DescriptionAndCheckWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const LeftWrapper = styled.div`
    & > p {
        flex: auto;
        margin: 0;
        padding-top: 13px;
        padding-bottom: 0;
    }
`;

const CheckboxGroup = styled.div`
    flex: 0 0 80px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
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

    const clearCheckmarks = async () => {
        try {
            await api.postClear(plant, parseInt(checklistId), item.id);
            setIsOk(false);
            setIsNA(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSetNA = async () => {
        if (isNA) return clearCheckmarks();
        try {
            await api.postSetNA(plant, parseInt(checklistId), item.id);
            setIsOk(false);
            setIsNA(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSetOk = async () => {
        if (isOk) return clearCheckmarks();
        try {
            await api.postSetOk(plant, parseInt(checklistId), item.id);
            setIsNA(false);
            setIsOk(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <CheckItemWrapper>
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
                            disabled={isSigned}
                            enterKeyHint
                            onChange={handleSetOk}
                            checked={isOk}
                            label={''}
                        />
                        <Checkbox
                            disabled={isSigned}
                            enterKeyHint
                            onChange={handleSetNA}
                            checked={isNA}
                            label={''}
                        />
                    </CheckboxGroup>
                </DescriptionAndCheckWrapper>
                {item.metaTable && (
                    <MetaTable
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
