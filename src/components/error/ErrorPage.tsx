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
    display: flex;
    flex-direction: column;
`;

const ErrorPage = ({ title, description }: CommError) => {
    return (
        <ErrorPageWrapper>
            <Banner>
                <BannerIcon variant={'warning'}>
                    <EdsIcon
                        color={COLORS.danger}
                        name="error_outlined"
                        title="Error icon"
                    />
                </BannerIcon>
                <BannerMessage variant="h4">{title}</BannerMessage>
            </Banner>
            {description && description.length > 0 && (
                <Banner>
                    <BannerIcon>
                        <EdsIcon name="info_circle" title="Error icon" />
                    </BannerIcon>
                    <BannerMessage>{description}</BannerMessage>
                </Banner>
            )}
        </ErrorPageWrapper>
    );
};

export default ErrorPage;
