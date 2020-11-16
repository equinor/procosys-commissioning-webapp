import React from 'react';
import styled from 'styled-components';
import EdsIcon from './EdsIcon';

const PageHeaderWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & h3 {
        margin: 24px 0 0 0;
    }
    & svg {
        margin: -5px 0 18px 0;
    }
`;
type PageHeaderProps = {
    text: string;
};
const PageHeader = ({ text }: PageHeaderProps) => {
    return (
        <PageHeaderWrapper>
            <h3>{text}</h3>
            <EdsIcon name="arrow_drop_down" title="Caret down" />
        </PageHeaderWrapper>
    );
};

export default PageHeader;
