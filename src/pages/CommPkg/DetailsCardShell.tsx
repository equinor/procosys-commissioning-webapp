import styled from 'styled-components';
import React from 'react';
import { SHADOW } from '../../style/GlobalStyles';

const DetailsCardShellWrapper = styled.div<{ atBookmarksPage: boolean }>`
    padding: 16px 4%;
    box-shadow: ${SHADOW};
    background-color: #f7f7f7;
    border-radius: 15px;
    margin: ${(props) => (props.atBookmarksPage ? '0 4% 10px 4%' : '10px')};
    display: flex;
    height: 95px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
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
