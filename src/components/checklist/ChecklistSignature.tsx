import React from 'react';
import { ChecklistDetails } from '../../services/apiTypes';
import { Button, TextField } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { SHADOW } from '../../style/GlobalStyles';

const ChecklistWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 25px 0;
    box-shadow: ${SHADOW};
    box-sizing: border-box;
    padding: 20px;
`;

const SignatureWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > p {
        font-size: 14px;
    }
`;

type ChecklistSignatureProps = {
    details: ChecklistDetails;
    setIsSigned: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChecklistSignature = ({ details }: ChecklistSignatureProps) => {
    return (
        <ChecklistWrapper>
            <TextField
                id={'Comment field'}
                multiline
                rows={5}
                label="Comment"
            />
            <SignatureWrapper>
                <p>
                    Updated at{' '}
                    {new Date(details.updatedAt).toLocaleString('en-gb')} <br />
                    by {details.updatedByFirstName} {details.updatedByLastName}
                </p>
                <Button>Sign</Button>
            </SignatureWrapper>
        </ChecklistWrapper>
    );
};

export default ChecklistSignature;
