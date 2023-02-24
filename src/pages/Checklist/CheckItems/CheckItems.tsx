import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
    CheckItem as CheckItemType,
    ChecklistDetails,
} from '../../../typings/apiTypes';
import CheckItem from './CheckItem/CheckItem';
import CheckHeader from './CheckHeader';

const CheckItemsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    & div:first-of-type {
        margin-top: 0;
    }
    & > div {
        &:first-child {
            margin-top: 16px;
        }
    }
`;

type CheckItemsProps = {
    checkItems: CheckItemType[];
    details: ChecklistDetails;
    isSigned: boolean;
    setCheckItems: React.Dispatch<React.SetStateAction<CheckItemType[]>>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const CheckItems = ({
    checkItems,
    details,
    isSigned,
    setCheckItems,
    setSnackbarText,
}: CheckItemsProps): JSX.Element => {
    const determineCheckItem = (
        item: CheckItemType,
        index: number,
        nextItemIsHeading: boolean
    ): JSX.Element => {
        if (item.isHeading && nextItemIsHeading) {
            return <></>;
        }
        if (item.isHeading) {
            return (
                <CheckHeader
                    text={item.text}
                    removeLabels={nextItemIsHeading}
                />
            );
        }
        // Return "OK / NA" labels if the first check item is not a heading.
        return (
            <>
                {index === 0 ? <CheckHeader text="" /> : null}
                <CheckItem
                    item={item}
                    checklistId={details.id}
                    isSigned={isSigned}
                    setCheckItems={setCheckItems}
                    setSnackbarText={setSnackbarText}
                />
            </>
        );
    };

    const itemsToDisplay = checkItems.map((item, index) => {
        const nextItemIsHeading = checkItems[index + 1]
            ? checkItems[index + 1].isHeading
            : true;
        return (
            <React.Fragment key={item.id}>
                {determineCheckItem(item, index, nextItemIsHeading)}
            </React.Fragment>
        );
    });

    return <CheckItemsWrapper>{itemsToDisplay}</CheckItemsWrapper>;
};

export default CheckItems;
