import { Card } from '@equinor/eds-core-react';
import React from 'react';
import styled, { keyframes } from 'styled-components';

const SkeletonLoadingPageWrapper = styled.main`
    & h3 {
        margin-top: 24px;
        text-align: center;
    }
`;

const load = keyframes`
    from {
        left: -150px;
    }
    to   {
        left: 100%;
    }
`;

const BaseSkeleton = styled(Card)`
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #f1f1f1;
    position: relative;
    overflow: hidden;
    margin: 20px;
    ::before {
        content: '';
        display: block;
        position: absolute;
        left: -150px;
        top: 0;
        height: 100%;
        width: 50%;
        background: linear-gradient(
            to right,
            transparent 0%,
            #fafafa 50%,
            transparent 100%
        );
        animation: ${load} 1s cubic-bezier(0.1, 0, 0.2, 1) infinite;
    }
`;

const ContentSkeleton = styled(BaseSkeleton)`
    width: 85%;
    height: 50px;
    margin: 15px auto 15px auto;
`;

type SkeletonLoadingPageProps = {
    text: string;
};

const SkeletonLoadingPage = ({ text }: SkeletonLoadingPageProps) => {
    return (
        <SkeletonLoadingPageWrapper>
            <h3>{text}</h3>
            <ContentSkeleton />
            <ContentSkeleton />
            <ContentSkeleton />
            <ContentSkeleton />
            <ContentSkeleton />
            <ContentSkeleton />
            <ContentSkeleton />
            <ContentSkeleton />
        </SkeletonLoadingPageWrapper>
    );
};

export default SkeletonLoadingPage;
