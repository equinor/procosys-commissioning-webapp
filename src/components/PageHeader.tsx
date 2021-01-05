import React from 'react';
import styled from 'styled-components';

const PageHeaderWrapper = styled.div<{ hasSubtitle: boolean }>`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & h2 {
        text-align: center;
        margin: ${(props) =>
            props.hasSubtitle ? '12px 0 0 0' : '12px 0 24px 0'};
    }
    & h6 {
        text-align: center;
        margin: 0 0 5px 0;
        margin-bottom: 24px;
    }
`;
type PageHeaderProps = {
    title: string;
    subtitle?: string;
};
const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
    return (
        <PageHeaderWrapper hasSubtitle={!!subtitle}>
            <h2>{title}</h2>
            {subtitle && <h6>{subtitle}</h6>}
        </PageHeaderWrapper>
    );
};

export default PageHeader;
