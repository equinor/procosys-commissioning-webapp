import React from 'react';
import styled from 'styled-components';

const CheckHeaderWrapper = styled.div`
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

const GreyText = styled.p`
    margin: 0;
    color: #a2a2a2;
`;

type CheckHeaderProps = {
    text: string;
};

const CheckHeader = ({ text }: CheckHeaderProps) => {
    return (
        <CheckHeaderWrapper>
            <h5>{text}</h5>
            <div>
                <GreyText>OK</GreyText>
                <GreyText>NA</GreyText>
            </div>
        </CheckHeaderWrapper>
    );
};

export default CheckHeader;
