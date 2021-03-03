import { Card } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../contexts/CommAppContext';
import { SHADOW } from '../style/GlobalStyles';
import SkeletonLoadingPage from './loading/SkeletonLoader';
const { CardHeader, CardHeaderTitle } = Card;

export const CardWrapper = styled.article`
    & h3,
    label {
        margin: 0;
    }
    & h5 {
        margin: 12px 0;
    }
    & p {
        margin-bottom: 8px;
        margin-top: 0;
    }
    margin-bottom: 16px;
    box-shadow: ${SHADOW};
    border-radius: 10px;
`;

type ProcosysCardProps = {
    fetchStatus: AsyncStatus;
    errorMessage: string;
    emptyContentMessage?: string;
    children: JSX.Element;
    cardTitle: string;
};

const ProcosysCard = ({
    fetchStatus,
    errorMessage,
    emptyContentMessage,
    cardTitle,
    children,
}: ProcosysCardProps) => {
    const content = () => {
        if (fetchStatus === AsyncStatus.SUCCESS) {
            return children;
        } else if (fetchStatus === AsyncStatus.EMPTY_RESPONSE) {
            return <p>{emptyContentMessage}</p>;
        } else if (fetchStatus === AsyncStatus.ERROR) {
            return <p>{errorMessage}</p>;
        } else {
            return <SkeletonLoadingPage nrOfRows={3} />;
        }
    };

    return (
        <CardWrapper>
            <Card>
                <CardHeader>
                    <CardHeaderTitle>
                        <h3>{cardTitle}</h3>
                    </CardHeaderTitle>
                </CardHeader>
                <div>{content()}</div>
            </Card>
        </CardWrapper>
    );
};

export default ProcosysCard;
