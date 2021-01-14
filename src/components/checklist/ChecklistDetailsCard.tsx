import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChecklistDetails } from '../../services/apiTypes';
import { SHADOW } from '../../style/GlobalStyles';
import * as getStatusIcon from '../../utils/getStatusIcon';

const FormularTypeText = styled.p`
    flex: 1;
`;

const TextWrapper = styled.div`
    flex: 3;
    padding-right: 15px;
    & p,
    h6 {
        margin: 0;
    }
`;

const ChecklistDetailsCardWrapper = styled.div<{ isSigned?: boolean }>`
    padding: 16px 4%;
    box-sizing: border-box;
    width: 100%;
    background-color: ${(props) => (props.isSigned ? '#deecee' : '#f7f7f7')};
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: ${SHADOW};
    /* background-color: #deecee; */
    & img {
        max-width: 20px;
        margin: 10px 16px 10px 0px;
        flex: 1;
    }
    & ${FormularTypeText} {
        flex: 1;
        text-align: right;
        padding-right: 24px;
    }
`;

type ChecklistDetailsCardProps = {
    details: ChecklistDetails;
    descriptionLabel: string;
    isSigned?: boolean;
};

const ChecklistDetailsCard = ({
    details,
    isSigned,
    descriptionLabel,
}: ChecklistDetailsCardProps) => {
    return (
        <ChecklistDetailsCardWrapper isSigned={isSigned}>
            {getStatusIcon.completionStatus(details.status)}
            <TextWrapper>
                <label>
                    {isSigned !== undefined &&
                        (isSigned ? 'Signed' : 'Unsigned')}{' '}
                    {descriptionLabel}:
                </label>
                <p>{details.tagDescription}</p>
            </TextWrapper>
            <FormularTypeText>{details.formularType}</FormularTypeText>
        </ChecklistDetailsCardWrapper>
    );
};

export default ChecklistDetailsCard;
