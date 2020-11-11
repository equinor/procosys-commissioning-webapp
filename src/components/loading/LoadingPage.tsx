import React from 'react';
import { LinearProgress, StarProgress } from '@equinor/eds-core-react';
import styled from 'styled-components';

const LoadingPageWrapper = styled.main`
    position: fixed;
    top: 0;
    left: 0;
    width: 80vw;
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10vh 10vw;
    & h1 {
        text-align: center;
    }
`;

type LoadingPageProps = {
    loadingText: string;
};

const LoadingPage = ({ loadingText }: LoadingPageProps) => {
    return (
        <LoadingPageWrapper>
            <h1>{loadingText}</h1>
            <StarProgress size="100px" />
        </LoadingPageWrapper>
    );
};

export default LoadingPage;
