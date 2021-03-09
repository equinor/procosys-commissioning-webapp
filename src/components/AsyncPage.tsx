import { Banner } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../contexts/CommAppContext';
import { SHADOW } from '../style/GlobalStyles';
import EdsIcon from './icons/EdsIcon';
import SkeletonLoadingPage from './loading/SkeletonLoader';
const { BannerIcon, BannerMessage } = Banner;

export const ContentWrapper = styled.article`
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
};

const AsyncPage = ({
    fetchStatus,
    errorMessage,
    emptyContentMessage,
    children,
}: ProcosysCardProps) => {
    const content = () => {
        if (fetchStatus === AsyncStatus.SUCCESS) {
            return <>{children}</>;
        } else if (fetchStatus === AsyncStatus.EMPTY_RESPONSE) {
            return (
                <Banner>
                    <BannerIcon>
                        <EdsIcon name={'info_circle'} color={'#007079'} />
                    </BannerIcon>
                    <BannerMessage>{emptyContentMessage!}</BannerMessage>
                </Banner>
            );
        } else if (fetchStatus === AsyncStatus.ERROR) {
            return (
                <Banner>
                    <BannerIcon variant="warning">
                        <EdsIcon name={'error_filled'} color={'#FF3B3B'} />
                    </BannerIcon>
                    <BannerMessage>{errorMessage}</BannerMessage>
                </Banner>
            );
        } else {
            return <SkeletonLoadingPage nrOfRows={10} />;
        }
    };

    return <div>{content()}</div>;
};

export default AsyncPage;
