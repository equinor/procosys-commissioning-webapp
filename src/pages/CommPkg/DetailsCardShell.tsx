import styled from 'styled-components';
import React from 'react';
import { SHADOW } from '../../style/GlobalStyles';

const DetailsCardShellWrapper = styled.div<{ atBookmarksPage: boolean }>`
    padding: 16px 4%;
    box-shadow: ${SHADOW};
    background-color: #deecee;
    border-radius: 15px;
    display: flex;
    height: 95px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) =>
        props.atBookmarksPage ? 'white' : '#deecee'};
    box-shadow: ${(props) => (props.atBookmarksPage ? SHADOW : 'none')};
    border-radius: 5px;
    margin: ${(props) => (props.atBookmarksPage ? '0 4% 10px 4%' : '0')};
`;

type DetailsCardSkeletonProps = {
    atBookmarksPage: boolean;
    children: JSX.Element;
};

const DetailsCardShell = ({
    atBookmarksPage,
    children,
}: DetailsCardSkeletonProps) => {
    return (
        <DetailsCardShellWrapper atBookmarksPage={atBookmarksPage}>
            {children}
        </DetailsCardShellWrapper>
    );
};

export default DetailsCardShell;
