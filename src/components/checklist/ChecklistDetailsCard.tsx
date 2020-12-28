import React from 'react';
import styled from 'styled-components';
import { ChecklistDetails } from '../../services/apiTypes';
import { SHADOW } from '../../style/GlobalStyles';
import * as getStatusIcon from '../../utils/getStatusIcon';

const FormularTypeText = styled.p`
    flex: 1;
`;

const ChecklistDetailsCardWrapper = styled.div`
    padding: 16px 0;
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: ${SHADOW};
    & p {
        &:first-of-type {
            padding-right: 15px;
        }
        margin: 0;
        flex: 3;
    }
    & img {
        max-width: 20px;
        margin: 10px 16px;
        flex: 1;
    }
    & ${FormularTypeText} {
        flex: 1;
    }
`;

type ChecklistDetailsCardProps = {
    details: ChecklistDetails;
};

const ChecklistDetailsCard = ({ details }: ChecklistDetailsCardProps) => {
    return (
        <ChecklistDetailsCardWrapper>
            {getStatusIcon.completionStatus(details.status)}
            <p>{details.tagDescription}</p>
            <FormularTypeText>{details.formularType}</FormularTypeText>
        </ChecklistDetailsCardWrapper>
    );
};

export default ChecklistDetailsCard;
