import React from 'react';
import styled from 'styled-components';
import { Banner } from '@equinor/eds-core-react';
import { COLORS } from '../../style/GlobalStyles';
import EdsIcon from '../EdsIcon';

interface CommError {
    errorTitle?: string;
    errorDescription?: string;
}

const ErrorPageWrapper = styled.main`
    padding: 0 4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    & p {
        padding: 4%;
    }
    & svg {
        transform: scale(1);
    }
    & h3 {
        margin-bottom: 0;
    }
`;

const ErrorPage = ({ errorTitle, errorDescription }: CommError) => {
    return (
        <ErrorPageWrapper>
            <h3>{errorTitle}</h3>
            <Banner>
                <EdsIcon
                    color={COLORS.interactive.danger__resting.hex}
                    name="error_outlined"
                    title="Error icon"
                />
                <p>{errorDescription}</p>
            </Banner>
        </ErrorPageWrapper>
    );
};

export default ErrorPage;
