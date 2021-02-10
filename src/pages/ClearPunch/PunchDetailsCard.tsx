import React from 'react';
import styled from 'styled-components';
import { SHADOW } from '../../style/GlobalStyles';

const PunchDetailsCardWrapper = styled.div`
    padding: 16px;
    box-shadow: ${SHADOW};
    background-color: #fafafa;
    display: flex;
    & div {
        margin-right: 16px;
        & > p {
            margin: 0;
        }
    }
`;

type PunchDetailsCardProps = {
    systemModule: string;
    tagDescription: string;
};

const PunchDetailsCard = ({
    systemModule,
    tagDescription,
}: PunchDetailsCardProps) => {
    return (
        <PunchDetailsCardWrapper>
            <div>
                <label>Module</label>
                <p>{systemModule}</p>
            </div>
            <div>
                <label>Tag</label>
                <p>{tagDescription}</p>
            </div>
        </PunchDetailsCardWrapper>
    );
};

export default PunchDetailsCard;
