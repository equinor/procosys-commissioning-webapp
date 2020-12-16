import React from 'react';
import styled from 'styled-components';
import { CheckItem } from '../../services/apiTypes';
import { Button } from '@equinor/eds-core-react';
import EdsIcon from '../EdsIcon';
import MetaTable from './MetaTable';

const CheckItemWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    & p {
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
};

const CheckItemComponent = ({ item }: CheckItemComponentProps) => {
    const radioButtonSelected = (
        <EdsIcon name="radio_button_selected" color="primary" />
    );
    const radioButtonUnselected = (
        <EdsIcon name="radio_button_unselected" color="primary" />
    );
    return (
        <CheckItemWrapper>
            <p>{item.text}</p>
            <RadioGroup>
                {item.isOk ? (
                    <Button variant="ghost">{radioButtonSelected}</Button>
                ) : (
                    <Button variant="ghost">{radioButtonUnselected}</Button>
                )}
                {item.isNotApplicable ? (
                    <Button variant="ghost">{radioButtonSelected}</Button>
                ) : (
                    <Button variant="ghost">{radioButtonUnselected}</Button>
                )}
            </RadioGroup>
            {item.metaTable && (
                <MetaTable
                    labels={item.metaTable.columnLabels}
                    rows={item.metaTable.rows}
                />
            )}
        </CheckItemWrapper>
    );
};

export default CheckItemComponent;
