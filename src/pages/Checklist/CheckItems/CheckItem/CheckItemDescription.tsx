import React, { useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../../../components/icons/EdsIcon';

const CheckItemDescriptionWrapper = styled.div`
    & button {
        margin: 0;
        padding: 0;
        border: 0;
        background: none;
        display: flex;
        align-items: center;

        & p {
            margin: 0;
            color: #007079;
        }
    }
    & > p {
        margin: 8px 0px 8px 0px;
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
                <p>{showInfo ? 'Hide details' : 'Show details'}</p>
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
