import React, { useContext } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import CommPkgContext from '../../../contexts/CommPkgContext';
import EdsIcon from '../../../components/icons/EdsIcon';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';

export const CommPkgListWrapper = styled.div`
    padding-bottom: 85px;
    & h3 {
        text-align: center;
        margin-top: 16px;
    }
`;

export const PreviewButton = styled(Link)`
    display: flex;
    align-items: center;
    padding: 10px 2%;
    margin: 10px 4% 0 4%;
    text-decoration: none;
    justify-content: space-between;
    & img {
        max-height: 20px;
        object-fit: contain;
        flex: 0.1;
    }
    & > div {
        margin-left: 24px;
        flex: 3;
        & p {
            margin: 0;
        }
    }
    & svg {
        flex: 0.5;
    }
`;

const FormulaTypeText = styled.p`
    padding-left: 12px;
    flex: 1;
`;

const Scope = () => {
    const { scope } = useContext(CommPkgContext);
    const { url } = useRouteMatch();
    const scopeToRender = scope.map((checklist) => (
        <PreviewButton key={checklist.id} to={`${url}/${checklist.id}`}>
            <CompletionStatusIcon status={checklist.status} />
            <div>
                <label>{checklist.tagNo}</label>
                <p>{checklist.tagDescription}</p>
            </div>
            <FormulaTypeText>{checklist.formularType}</FormulaTypeText>
            <EdsIcon name="chevron_right" />
        </PreviewButton>
    ));
    if (scope.length < 1)
        return (
            <CommPkgListWrapper>
                <h3>The scope is empty</h3>
            </CommPkgListWrapper>
        );
    return <CommPkgListWrapper>{scopeToRender}</CommPkgListWrapper>;
};

export default Scope;
