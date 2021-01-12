import React from 'react';
import { ChecklistDetails } from '../../services/apiTypes';
import { Button, TextField } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { SHADOW } from '../../style/GlobalStyles';
import * as api from '../../services/api';
import { useParams } from 'react-router-dom';
import { CommParams } from '../../App';

const ChecklistWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 25px 0;
    /* box-shadow: ${SHADOW}; */
    /* background-color: #deecee; */
    box-sizing: border-box;
    /* padding: 20px; */
    & button {
        width: 100%;
        margin-top: 15px;
    }
`;

type ChecklistSignatureProps = {
    details: ChecklistDetails;
    setIsSigned: React.Dispatch<React.SetStateAction<boolean>>;
    isSigned: boolean;
};

const ChecklistSignature = ({
    details,
    setIsSigned,
    isSigned,
}: ChecklistSignatureProps) => {
    const { plant, checklistId } = useParams<CommParams>();

    const helperText = `Updated at ${new Date(details.updatedAt).toLocaleString(
        'en-gb'
    )} by ${details.updatedByFirstName} ${details.updatedByLastName}`;

    const handleSignClick = async () => {
        try {
            if (isSigned) {
                await api.postUnsign(plant, parseInt(checklistId));
                setIsSigned(false);
            } else {
                await api.postSign(plant, parseInt(checklistId));
                setIsSigned(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ChecklistWrapper>
            <TextField
                id={'Comment field'}
                multiline
                rows={5}
                label="Comment"
                helperText={helperText}
            />
            <Button onClick={handleSignClick}>
                {isSigned ? 'Unsign' : 'Sign'}
            </Button>
        </ChecklistWrapper>
    );
};

export default ChecklistSignature;
