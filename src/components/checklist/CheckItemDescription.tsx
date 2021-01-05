import React, { useState } from 'react';
import { Button } from '@equinor/eds-core-react';
import styled from 'styled-components';
import EdsIcon from '../EdsIcon';

const CheckItemDescriptionWrapper = styled.div`
    margin-bottom: 2px;
    & button {
        margin: 0;
        padding: 0;
        border: 0;
        background: none;
        display: flex;
        align-items: center;
        color: #007079;
    }
    & p {
        margin: 8px 0px 0px 0px;
        padding-left: 24px;
        border-left: 4px solid #deecee;
        color: #6c6c6c;
    }
`;

type CheckItemDescriptionProps = {
    description: string;
};

const CheckItemDescription = ({ description }: CheckItemDescriptionProps) => {
    const [showInfo, setShowInfo] = useState(false);
    return (
        <CheckItemDescriptionWrapper>
            <button onClick={() => setShowInfo((current) => !current)}>
                {showInfo ? 'Less details' : 'More details'}{' '}
                <EdsIcon
                    name={showInfo ? 'chevron_down' : 'chevron_right'}
                    size={16}
                />
            </button>
            {showInfo && <p>{description}</p>}
        </CheckItemDescriptionWrapper>
    );
};

export default CheckItemDescription;
