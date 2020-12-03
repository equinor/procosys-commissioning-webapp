import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CommPackageContext from '../../contexts/CommPackageContext';
import { COLORS } from '../../style/GlobalStyles';
import * as getStatusIcon from '../../utils/getStatusIcon';
import { ParagraphOverline } from '../../style/GlobalStyles';
import EdsIcon from '../EdsIcon';

const ScopeWrapper = styled.div`
    padding-bottom: 100px;
`;

const ChecklistPreview = styled(Link)`
    display: flex;
    align-items: center;
    border-bottom: 2px solid ${COLORS.ui.background__light.hex};
    padding: 15px 16px;
    text-decoration: none;
    position: relative;
    justify-content: space-between;
    & img {
        height: 15px;
        object-fit: contain;
        flex: 0.25;
    }
    & div {
        margin-left: 16px;
        flex: 3;
        & p {
            margin: 0;
        }
    }
    & svg {
        flex: 0.7;
    }
`;

const FormulaTypeText = styled.p`
    margin: 0 16px;
    flex: 1;
`;

const Scope = () => {
    const { scope } = useContext(CommPackageContext);
    const scopeToRender = scope.map((checklist) => (
        <ChecklistPreview key={checklist.id} to={``}>
            {getStatusIcon.scopeStatus(checklist.status)}
            <div>
                <ParagraphOverline>{checklist.tagNo}</ParagraphOverline>
                <p>{checklist.tagDescription}</p>
            </div>
            <FormulaTypeText>{checklist.formularType}</FormulaTypeText>
            <EdsIcon name="chevron_right" />
        </ChecklistPreview>
    ));
    return <ScopeWrapper>{scopeToRender}</ScopeWrapper>;
};

export default Scope;

// export const SelectorButton = styled(Link)`
//     display: flex;
//     border-top: 2px solid ${COLORS.ui.background__light.hex};
//     justify-content: space-between;
//     align-items: center;
//     text-decoration: none;
//     padding: 20px 4%;
//     position: relative;
//     & p {
//         margin: 0 30px 0 0;
//     }
//     &:hover {
//         background-color: ${COLORS.interactive.secondary__highlight.hex};
//     }
//     & svg {
//         position: absolute;
//         right: 10px;
//     }
// `;
