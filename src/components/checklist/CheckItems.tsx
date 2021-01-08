import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckItem, ChecklistDetails } from '../../services/apiTypes';
import CheckItemComponent from './checkItem/CheckItemComponent';
import CheckHeader from './CheckHeader';
import CheckAllButton from './CheckAllButton';

const CheckItemsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    & div:first-of-type {
        margin-top: 0;
    }
    & > div {
        &:first-child {
            margin-top: 36px;
        }
    }
`;

type CheckItemsProps = {
    checkItems: CheckItem[];
    details: ChecklistDetails;
    isSigned: boolean;
};

const CheckItems = ({ checkItems, details, isSigned }: CheckItemsProps) => {
    const [items, setItems] = useState(checkItems);

    const updateNA = (value: boolean, checkItemId: number) => {
        setItems((items) =>
            items.map((existingItem) =>
                existingItem.id === checkItemId
                    ? { ...existingItem, isNotApplicable: value }
                    : existingItem
            )
        );
    };

    const updateOk = (value: boolean, checkItemId: number) => {
        setItems((items) =>
            items.map((existingItem) =>
                existingItem.id === checkItemId
                    ? { ...existingItem, isOk: value }
                    : existingItem
            )
        );
    };

    const determineCheckItem = (
        item: CheckItem,
        index: number,
        nextItemIsHeading: boolean
    ) => {
        if (item.isHeading)
            return (
                <CheckHeader
                    text={item.text}
                    removeLabels={nextItemIsHeading}
                />
            );
        // Return "OK / NA" labels if the first check item is not a heading.
        if (index === 0) return <CheckHeader text="" />;
        return (
            <CheckItemComponent
                item={item}
                updateNA={updateNA}
                updateOk={updateOk}
                checklistId={details.id}
                isSigned={isSigned}
            />
        );
    };

    const itemsToDisplay = items.map((item, index) => {
        let nextItemIsHeading = items[index + 1]
            ? items[index + 1].isHeading
            : true;
        return (
            <React.Fragment key={item.id}>
                {determineCheckItem(item, index, nextItemIsHeading)}
            </React.Fragment>
        );
    });

    return (
        <CheckItemsWrapper>
            {!isSigned && <CheckAllButton items={items} updateOk={updateOk} />}
            {itemsToDisplay}
        </CheckItemsWrapper>
    );
};

export default CheckItems;
