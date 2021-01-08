import React, { useEffect, useState } from 'react';
import { CheckItem } from '../../services/apiTypes';
import { Button, Checkbox } from '@equinor/eds-core-react';
import EdsIcon from '../EdsIcon';
import styled from 'styled-components';
import { postClear, postSetOk } from '../../services/api';
import { CommParams } from '../../App';
import { useParams } from 'react-router-dom';

type CheckAllButtonProps = {
    items: CheckItem[];
    updateOk: (value: boolean, checkItemId: number) => void;
};

enum CheckStatus {
    CHECKED,
    UNCHECKED,
    DISABLED,
}

const StyledCheckAllButton = styled(Button)`
    margin-left: auto;
    margin-bottom: 12px;
`;

const determineIfAllAreChecked = (itemsToDetermine: CheckItem[]) => {
    return itemsToDetermine.every((item) => item.isOk || item.isNotApplicable);
};

const CheckAllButton = ({ items, updateOk }: CheckAllButtonProps) => {
    const { plant, checklistId } = useParams<CommParams>();
    const [allChecked, setAllChecked] = useState(
        determineIfAllAreChecked(items)
    );

    const checkAll = async () => {
        const itemsToCheck = items.filter(
            (item) => !item.isOk && !item.isNotApplicable
        );
        try {
            await Promise.all(
                itemsToCheck.map((item) => {
                    return postSetOk(plant, parseInt(checklistId), item.id);
                })
            );
            itemsToCheck.forEach((item) => updateOk(true, item.id));
        } catch (error) {
            console.log(error);
        }
    };

    const uncheckAll = async () => {
        const itemsToCheck = items.filter(
            (item) => item.isOk && !item.isNotApplicable
        );
        try {
            await Promise.all(
                itemsToCheck.map((item) => {
                    return postClear(plant, parseInt(checklistId), item.id);
                })
            );
            itemsToCheck.forEach((item) => updateOk(false, item.id));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setAllChecked(determineIfAllAreChecked(items));
    }, [items]);

    return (
        <StyledCheckAllButton onClick={allChecked ? uncheckAll : checkAll}>
            <EdsIcon name={allChecked ? 'checkbox' : 'checkbox_outline'} />
            {allChecked ? 'Uncheck all' : 'Check all'}
        </StyledCheckAllButton>
    );
};

export default CheckAllButton;
