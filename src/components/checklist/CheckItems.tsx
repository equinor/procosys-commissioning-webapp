import React from 'react';
import styled from 'styled-components';
import { CheckItem, ChecklistDetails } from '../../services/apiTypes';
import CheckItemComponent from './CheckItemComponent';
import CheckHeader from './CheckHeader';
import DetailsCard from '../commPkg/DetailsCard';

const CheckItemsWrapper = styled.div`
    & > div {
        &:first-child {
            /* margin-top: 24px; */
        }
    }
`;

type CheckItemsProps = {
    items: CheckItem[];
    details: ChecklistDetails;
    isSigned: boolean;
};

const CheckItems = ({ items, details, isSigned }: CheckItemsProps) => {
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
    return <CheckItemsWrapper>{itemsToDisplay}</CheckItemsWrapper>;
};

export default CheckItems;
