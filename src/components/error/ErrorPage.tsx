import React from 'react';
import styled from 'styled-components';
import { Banner } from '@equinor/eds-core-react';
import { COLORS } from '../../style/GlobalStyles';
import EdsIcon from '../icons/EdsIcon';
const { BannerIcon, BannerMessage } = Banner;

interface CommError {
    title: string;
    description?: string;
}

const ErrorPageWrapper = styled.main`
    padding: 0 4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    & p {
        padding: 4%;
    }
    & h3 {
        margin-bottom: 0;
    }
`;

const ErrorPage = ({ title, description }: CommError) => {
    return (
        <ErrorPageWrapper>
            <Banner>
                <BannerIcon variant={'warning'}>
                    <EdsIcon
                        color={COLORS.interactive.danger__resting.hex}
                        name="error_outlined"
                        title="Error icon"
                    />
                </BannerIcon>
                <BannerMessage bold>{title}</BannerMessage>
            </Banner>
            {description && description.length > 0 && (
                <Banner>
                    <BannerMessage>{description}</BannerMessage>
                </Banner>
            )}
        </ErrorPageWrapper>
    );
};

export default ErrorPage;
