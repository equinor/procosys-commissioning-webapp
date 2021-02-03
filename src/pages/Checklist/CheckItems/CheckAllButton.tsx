import React, { useContext, useState } from 'react';
import { CheckItem } from '../../../services/apiTypes';
import { Button } from '@equinor/eds-core-react';
import EdsIcon from '../../../components/icons/EdsIcon';
import styled from 'styled-components';
import { CommParams } from '../../../App';
import { useParams } from 'react-router-dom';
import CommAppContext, { AsyncStatus } from '../../../contexts/CommAppContext';

const StyledCheckAllButton = styled(Button)`
    :disabled {
        margin: 24px 0 12px auto;
    }
    margin: 24px 0 12px auto;
`;

type CheckAllButtonProps = {
    items: CheckItem[];
    updateOk: (value: boolean, checkItemId: number) => void;
    allItemsCheckedOrNA: boolean;
};

const CheckAllButton = ({
    items,
    updateOk,
    allItemsCheckedOrNA,
}: CheckAllButtonProps) => {
    const { api } = useContext(CommAppContext);
    const { plant, checklistId } = useParams<CommParams>();
    const [checkAllStatus, setCheckAllStatus] = useState(AsyncStatus.INACTIVE);
    const checkAll = async () => {
        setCheckAllStatus(AsyncStatus.LOADING);
        const itemsToCheck = items.filter(
            (item) => !item.isOk && !item.isNotApplicable
        );
        try {
            await Promise.all(
                itemsToCheck.map((item) => {
                    return api.postSetOk(plant, parseInt(checklistId), item.id);
                })
            );
            itemsToCheck.forEach((item) => updateOk(true, item.id));
            setCheckAllStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setCheckAllStatus(AsyncStatus.ERROR);
        }
    };

    const uncheckAll = async () => {
        setCheckAllStatus(AsyncStatus.LOADING);
        const itemsToCheck = items.filter(
            (item) => item.isOk && !item.isNotApplicable
        );
        try {
            await Promise.all(
                itemsToCheck.map((item) => {
                    return api.postClear(plant, parseInt(checklistId), item.id);
                })
            );
            itemsToCheck.forEach((item) => updateOk(false, item.id));
            setCheckAllStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setCheckAllStatus(AsyncStatus.ERROR);
        }
    };

    return (
        <StyledCheckAllButton
            variant="outlined"
            onClick={allItemsCheckedOrNA ? uncheckAll : checkAll}
            disabled={checkAllStatus === AsyncStatus.LOADING}
        >
            <EdsIcon
                name={allItemsCheckedOrNA ? 'checkbox' : 'checkbox_outline'}
            />
            {allItemsCheckedOrNA ? 'Uncheck all' : 'Check all'}
        </StyledCheckAllButton>
    );
};

export default CheckAllButton;
