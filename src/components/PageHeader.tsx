import React from 'react';
import styled from 'styled-components';
import EdsIcon from './EdsIcon';

const PageHeaderWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & h2 {
        text-align: center;
        margin: 24px 0 0 0;
    }
    & svg {
        margin: -5px 0 18px 0;
    }
    & h6 {
        text-align: center;
        margin: 0 0 5px 0;
    }
`;
type PageHeaderProps = {
    title: string;
    subtitle?: string;
};
const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
    return (
        <PageHeaderWrapper>
            <h2>{title}</h2>
            {subtitle && <h6>{subtitle}</h6>}
            <EdsIcon name="arrow_drop_down" title="Caret down" />
        </PageHeaderWrapper>
    );
};

export default PageHeader;
