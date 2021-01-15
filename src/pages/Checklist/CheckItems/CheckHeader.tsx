import React from 'react';
import styled from 'styled-components';

const CheckHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 48px;
    padding-bottom: 12px;
    border-bottom: 2px solid #deecee;
    & div {
        flex: 0 0 95px;
        padding-right: 6px;
        display: flex;
        justify-content: space-around;
    }
    & h4 {
        margin: 0;
    }
`;

const GreyText = styled.p`
    margin: 0;
    color: #a2a2a2;
`;

type CheckHeaderProps = {
    text: string;
    removeLabels?: boolean;
};

const CheckHeader = ({ text, removeLabels }: CheckHeaderProps) => {
    return (
        <CheckHeaderWrapper>
            <h4>{text}</h4>
            <div>
                <GreyText>{!removeLabels && 'Check'}</GreyText>
                <GreyText>{!removeLabels && 'NA'}</GreyText>
            </div>
        </CheckHeaderWrapper>
    );
};

export default CheckHeader;