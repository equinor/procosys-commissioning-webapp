import React from 'react';
import styled from 'styled-components';
import { CheckItem } from '../../services/apiTypes';
import CheckItemComponent from './CheckItemComponent';

const GreyText = styled.p`
    margin: 0;
    color: #a2a2a2;
`;

const CheckHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 16px;
    & div {
        flex: 0 0 116px;
        display: flex;
        justify-content: space-around;
    }
    & h5 {
        margin-bottom: 12px;
    }
`;

type CheckItemsProps = {
    items: CheckItem[];
};

const CheckItems = ({ items }: CheckItemsProps) => {
    const itemsToDisplay = items.map((item, index) =>
        item.isHeading ? (
            <CheckHeader>
                <h5>{item.text}</h5>
                <div>
                    <GreyText>OK</GreyText>
                    <GreyText>NA</GreyText>
                </div>
            </CheckHeader>
        ) : (
            <CheckItemComponent item={item} />
        )
    );
    return <div>{itemsToDisplay}</div>;
};

export default CheckItems;
