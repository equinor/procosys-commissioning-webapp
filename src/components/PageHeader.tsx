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
        margin: 0;
    }
    & svg {
        margin: -5px 0 18px 0;
    }
    & h6 {
        margin: 24px 0 0 0;
        color: #6f6f6f;
    }
`;
type PageHeaderProps = {
    text: string;
    plantName?: string;
};
const PageHeader = ({ text, plantName }: PageHeaderProps) => {
    return (
        <PageHeaderWrapper>
            {plantName && (
                <h6>
                    <i>plantName</i>
                </h6>
            )}
            <h2>{text}</h2>
            <EdsIcon name="arrow_drop_down" title="Caret down" />
        </PageHeaderWrapper>
    );
};

export default PageHeader;
